import { toast } from 'sonner'
import { Slot } from '@radix-ui/react-slot'
import React, { useState, useEffect, forwardRef, type ReactNode } from 'react'

import { CheckIcon, CopyIcon } from './icons'

import { cn } from '@/lib/utils'

interface CopyWrapperProps {
    hidden?: boolean
    children: ReactNode
    asChild?: boolean
    copyInterval?: number
    checkIcon?: ReactNode
    copyIcon?: ReactNode
    iconSide?: 'left' | 'right'
    className?: string
    onClick?: () => void
}

export const CopyWrapper = forwardRef<
    HTMLButtonElement,
    CopyWrapperProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
    (
        {
            hidden = false,
            children,
            asChild = false,
            copyInterval = 500,
            checkIcon = <CheckIcon className="size-3" />,
            copyIcon = <CopyIcon className="size-3" />,
            iconSide = 'left',
            className,
            onClick,
            ...props
        },
        ref
    ) => {
        const [isCopied, setIsCopied] = useState(false)
        const [isDisabled, setIsDisabled] = useState(false)

        const handleCopy = async () => {
            if (isDisabled) return

            try {
                const textContent = extractTextContent(children)
                await navigator.clipboard.writeText(textContent)

                setIsCopied(true)
                setIsDisabled(true)

                if (onClick) {
                    onClick()
                }

                toast.success('Copied')

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                toast.error('Failed to copy text: ')
            }
        }

        useEffect(() => {
            if (isCopied) {
                const timer = setTimeout(() => {
                    setIsCopied(false)
                    setIsDisabled(false)
                }, copyInterval)

                return () => clearTimeout(timer)
            }
        }, [isCopied, copyInterval])

        const extractTextContent = (node: ReactNode): string => {
            if (typeof node === 'string' || typeof node === 'number') {
                return String(node)
            }

            if (React.isValidElement(node)) {
                return extractTextContent(node.props.children)
            }

            if (Array.isArray(node)) {
                return node.map(extractTextContent).join('')
            }

            return ''
        }

        const currentIcon = isCopied ? checkIcon : copyIcon

        const content = (
            <>
                {iconSide === 'left' && !hidden && (
                    <span className="flex-shrink-0">{currentIcon}</span>
                )}
                <span className="flex-1">{children}</span>
                {iconSide === 'right' && !hidden && (
                    <span className="flex-shrink-0">{currentIcon}</span>
                )}
            </>
        )

        const Component = asChild ? Slot : 'button'

        return (
            <Component
                ref={ref}
                className={cn(
                    'inline-flex cursor-pointer items-center gap-2 transition-opacity',
                    isDisabled && 'cursor-not-allowed opacity-50',
                    className
                )}
                onClick={handleCopy}
                disabled={isDisabled}
                {...props}
            >
                {content}
            </Component>
        )
    }
)

CopyWrapper.displayName = 'CopyWrapper'
