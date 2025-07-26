import React from 'react'

import { Check, Copy } from 'lucide-react'
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

import { cn } from '@/lib/utils'

interface MarkdownProps {
    content: string
    theme?: 'light' | 'dark' | 'auto'
    showLineNumbers?: boolean
    allowCopy?: boolean
    className?: string
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    )
}

const CodeBlock: React.FC<{
    children: React.ReactNode
    className?: string
    showLineNumbers: boolean
    allowCopy: boolean
    theme: 'light' | 'dark' | 'auto'
}> = ({ children, className, showLineNumbers, allowCopy, theme }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match?.[1] || ''
    const code = String(children).replace(/\n$/, '')

    const getTheme = () => {
        if (theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? oneDark
                : oneLight
        }
        return theme === 'dark' ? oneDark : oneLight
    }

    return (
        <div className="relative group my-4">
            {allowCopy && <CopyButton text={code} />}
            <SyntaxHighlighter
                style={getTheme()}
                language={language}
                showLineNumbers={showLineNumbers}
                customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                }}
                wrapLines={true}
                wrapLongLines={true}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

export const Markdown: React.FC<MarkdownProps> = ({
    content,
    theme = 'auto',
    showLineNumbers = false,
    allowCopy = true,
    className,
}) => {
    const components: Components = {
        // Headings
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

        // Paragraphs
        p: ({ children, ...props }) => (
            <p className="mb-4 leading-7 text-muted-foreground" {...props}>
                {children}
            </p>
        ),

        // Blockquotes
        blockquote: ({ children, ...props }) => (
            <blockquote
                className="border-l-4 border-border pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r"
                {...props}
            >
                {children}
            </blockquote>
        ),

        // Code blocks and inline code
        code: ({
            inline,
            className,
            children,
            ...props
        }: React.ComponentProps<'code'> & { inline?: boolean }) => {
            if (inline) {
                return (
                    <code
                        className="bpx-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                        {...props}
                    >
                        {children}
                    </code>
                )
            }

            return (
                <CodeBlock
                    className={className}
                    showLineNumbers={showLineNumbers}
                    allowCopy={allowCopy}
                    theme={theme}
                >
                    {children}
                </CodeBlock>
            )
        },

        // Links
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

        // Images
        img: ({ src, alt, ...props }) => (
            <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg my-4 shadow-sm"
                {...props}
            />
        ),

        // Tables
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

        // Lists
        ul: ({ children, ...props }) => (
            <ul
                className="list-disc list-inside mb-4 space-y-2 text-muted-foreground ml-4"
                {...(props as React.HTMLAttributes<HTMLUListElement>)}
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
                        (
                            child.props as React.InputHTMLAttributes<HTMLInputElement>
                        )?.type === 'checkbox'
                )

            if (hasTaskList) {
                return (
                    <li
                        className="list-none flex items-center gap-2"
                        {...(props as React.HTMLAttributes<HTMLLIElement>)}
                    >
                        {children}
                    </li>
                )
            }

            return (
                <li className="mb-1" {...props}>
                    {children}
                </li>
            )
        },

        // Checkbox for task lists
        input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
                return (
                    <input
                        type="checkbox"
                        checked={!!checked}
                        readOnly
                        className="mr-2 accent-primary"
                        {...props}
                    />
                )
            }
            return (
                <input
                    type={type}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )
        },

        // Horizontal rule
        hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
    }

    return (
        <div className={cn(' max-w-none', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default Markdown
