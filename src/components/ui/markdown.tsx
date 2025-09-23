'use client'

import React, {
    memo,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useState,
} from 'react'

import { cn } from '@/helpers/tw-utils'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
    oneDark,
    oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/ui/button'

import Image from '../image'
import { CheckIcon, CopyIcon } from '../icons'

// Define remark and rehype plugins
const remarkPlugins = [remarkGfm]
const rehypePlugins = [rehypeRaw]

// **InlineCode Component**
function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
            {children}
        </code>
    )
}

// **CopyButton Component**
// Includes a fallback for browsers without navigator.clipboard
const CopyButton = memo(function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(() => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                })
                .catch(() => {
                    console.error('Failed to copy text')
                })
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            try {
                document.execCommand('copy')
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
            } catch (err) {
                console.error('Failed to copy text', err)
            } finally {
                document.body.removeChild(textarea)
            }
        }
    }, [text])

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            tabIndex={-1}
            aria-label="Copy code block"
        >
            {copied ? (
                <CheckIcon className="h-4 w-4 text-primary" />
            ) : (
                <CopyIcon className="h-4 w-4" />
            )}
        </Button>
    )
})

// **CodeBlock Component**
// Features unique IDs, lazy loading, theme support, and an option to disable highlighting
const CodeBlock = memo(function CodeBlock({
    children,
    className,
    showLineNumbers,
    allowCopy,
    theme,
    disableHighlighting = false,
}: {
    children: React.ReactNode
    className?: string
    showLineNumbers: boolean
    allowCopy: boolean
    theme: 'light' | 'dark' | 'auto'
    disableHighlighting?: boolean
}) {
    const id = useId()
    const [isVisible, setIsVisible] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    const match = /language-(\w+)/.exec(className || '')
    const language = match?.[1] || ''
    const code = String(children).replace(/\n$/, '')

    // Handle theme switching for 'auto' mode
    useEffect(() => {
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            setIsDarkMode(mediaQuery.matches)
            const handler = (e: MediaQueryListEvent) => setIsVisible(e.matches)
            mediaQuery.addEventListener('change', handler)
            return () => mediaQuery.removeEventListener('change', handler)
        }
    }, [theme])

    // Lazy load code blocks using IntersectionObserver
    useEffect(() => {
        const el = document.getElementById(id)
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.05 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [id])

    if (!code.trim()) return null

    const syntaxTheme =
        theme === 'auto'
            ? isDarkMode
                ? oneDark
                : oneLight
            : theme === 'dark'
              ? oneDark
              : oneLight

    // Estimate placeholder height to reduce layout shifts
    const numberOfLines = code.split('\n').length
    const estimatedHeight = numberOfLines * 20 // Adjust multiplier based on your styling

    // Render plain text if highlighting is disabled or no language is specified
    if (disableHighlighting || !language) {
        return (
            <div id={id} className="relative group my-4">
                {allowCopy && <CopyButton text={code} />}
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                    <code>{code}</code>
                </pre>
            </div>
        )
    }

    return (
        <div id={id} className="relative group my-4">
            {allowCopy && <CopyButton text={code} />}
            {isVisible ? (
                <SyntaxHighlighter
                    style={syntaxTheme}
                    language={language}
                    showLineNumbers={showLineNumbers}
                    customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        maxHeight: 500,
                        overflow: 'auto',
                    }}
                    wrapLines
                    wrapLongLines
                    PreTag="div"
                >
                    {code}
                </SyntaxHighlighter>
            ) : (
                <div
                    className="bg-muted rounded-lg p-4 flex items-center justify-center"
                    style={{ minHeight: `${estimatedHeight}px` }}
                >
                    <span className="text-muted-foreground">
                        Loading code block...
                    </span>
                </div>
            )}
        </div>
    )
})

// **ErrorBoundary Component**
// Catches rendering errors and displays a fallback UI
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Markdown rendering error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-destructive">
                    Error rendering markdown content.
                </div>
            )
        }
        return this.props.children
    }
}

// **Static Markdown Components**
// Defined outside the Markdown component for optimization
const staticComponents: Components = {
    h1: ({ children, ...props }) => (
        <h1
            className="text-4xl font-bold mb-6 mt-8 first:mt-0 text-foreground"
            {...props}
        >
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2
            className="text-3xl font-semibold mb-4 mt-8 first:mt-0 text-foreground border-b border-border pb-2"
            {...props}
        >
            {children}
        </h2>
    ),
    h3: ({ children, ...props }) => (
        <h3
            className="text-2xl font-semibold mb-3 mt-6 text-foreground"
            {...props}
        >
            {children}
        </h3>
    ),
    h4: ({ children, ...props }) => (
        <h4
            className="text-xl font-semibold mb-2 mt-4 text-foreground"
            {...props}
        >
            {children}
        </h4>
    ),
    h5: ({ children, ...props }) => (
        <h5
            className="text-lg font-semibold mb-2 mt-3 text-foreground"
            {...props}
        >
            {children}
        </h5>
    ),
    h6: ({ children, ...props }) => (
        <h6
            className="text-base font-semibold mb-1 mt-2 text-foreground"
            {...props}
        >
            {children}
        </h6>
    ),
    p: ({ children, ...props }) => (
        <p className="mb-4 leading-7 text-muted-foreground" {...props}>
            {children}
        </p>
    ),
    blockquote: ({ children, ...props }) => (
        <blockquote
            className="border-l-4 border-border pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r"
            {...props}
        >
            {children}
        </blockquote>
    ),
    a: ({ children, href, ...props }) => (
        <a
            href={href}
            className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        >
            {children}
        </a>
    ),
    img: ({ src, alt, ...props }) => (
        <Image
            src={src || '/placeholder.svg'}
            alt={alt || 'placeholder image'}
            className="max-w-full h-auto rounded-lg my-4 shadow-sm"
            loading="lazy"
            {...props}
        />
    ),
    table: ({ children, ...props }) => (
        <div className="my-6 overflow-x-auto">
            <table
                className="w-full border-collapse border border-border rounded-lg"
                {...props}
            >
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }) => (
        <thead className="bg-muted/50" {...props}>
            {children}
        </thead>
    ),
    th: ({ children, ...props }) => (
        <th
            className="border border-border px-4 py-2 text-left font-semibold text-foreground"
            {...props}
        >
            {children}
        </th>
    ),
    td: ({ children, ...props }) => (
        <td
            className="border border-border px-4 py-2 text-muted-foreground"
            {...props}
        >
            {children}
        </td>
    ),
    ul: ({ children, ...props }) => (
        <ul
            className="list-disc list-inside mb-4 space-y-2 text-muted-foreground ml-4"
            {...props}
        >
            {children}
        </ul>
    ),
    ol: ({ children, ...props }) => (
        <ol
            className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground ml-4"
            {...props}
        >
            {children}
        </ol>
    ),
    li: ({ children, ...props }) => {
        const hasTaskList =
            Array.isArray(children) &&
            children.some(
                (child) =>
                    React.isValidElement(child) &&
                    child.type === 'input' &&
                    typeof child.props === 'object' &&
                    child.props !== null &&
                    (child.props as { type?: string }).type === 'checkbox'
            )
        return hasTaskList ? (
            <li className="list-none flex items-center gap-2" {...props}>
                {children}
            </li>
        ) : (
            <li className="mb-1" {...props}>
                {children}
            </li>
        )
    },
    input: ({ type, checked, ...props }) =>
        type === 'checkbox' ? (
            <input
                type="checkbox"
                checked={!!checked}
                readOnly
                className="mr-2 accent-primary"
                {...props}
            />
        ) : (
            <input type={type} {...props} />
        ),
    hr: (props) => <hr className="my-8 border-border" {...props} />,
}

// **Markdown Component**
interface MarkdownProps {
    content: string
    theme?: 'light' | 'dark' | 'auto'
    showLineNumbers?: boolean
    allowCopy?: boolean
    disableHighlighting?: boolean
    className?: string
}

export const Markdown = memo(function Markdown({
    content,
    theme = 'auto',
    showLineNumbers = false,
    allowCopy = true,
    disableHighlighting = false,
    className,
}: MarkdownProps) {
    // Memoize the code component based on its dependencies
    const codeComponent = useCallback(
        ({
            inline,
            className,
            children,
        }: {
            inline?: boolean
            className?: string
            children?: React.ReactNode
        }) => {
            return inline ? (
                <InlineCode>{children}</InlineCode>
            ) : (
                <CodeBlock
                    className={className}
                    showLineNumbers={showLineNumbers}
                    allowCopy={allowCopy}
                    theme={theme}
                    disableHighlighting={disableHighlighting}
                >
                    {children}
                </CodeBlock>
            )
        },
        [showLineNumbers, allowCopy, theme, disableHighlighting]
    )

    // Combine static components with the dynamic code component
    const components = useMemo(
        () => ({ ...staticComponents, code: codeComponent }),
        [codeComponent]
    )

    if (!content || !content.trim()) return null

    return (
        <div className={cn('max-w-none', className)}>
            <ErrorBoundary>
                <ReactMarkdown
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={components}
                >
                    {content}
                </ReactMarkdown>
            </ErrorBoundary>
        </div>
    )
})
