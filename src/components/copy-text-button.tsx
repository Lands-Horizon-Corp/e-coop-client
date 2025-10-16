import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'

import { IBaseProps } from '@/types'

import { CheckIcon, CopyIcon } from './icons'

interface Props<TErr = Error> extends IBaseProps {
    textContent: string
    copyInterval?: number
    className?: string
    successText?: string
    successClassName?: string
    iconClassName?: string
    onCopySuccess?: () => void
    onCopyError?: (error: TErr) => void
}

const CopyTextButton = <TErr = Error,>({
    children,
    className,
    iconClassName,
    textContent,
    successText,
    successClassName,
    copyInterval = 2500,
    onCopyError,
    onCopySuccess,
}: Props<TErr>) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(() => {
        navigator.clipboard
            .writeText(textContent)
            .then(() => {
                setCopied(true)
                toast.success(successText ?? 'Coppied')
                onCopySuccess?.()
                setTimeout(() => setCopied(false), copyInterval)
            })
            .catch((err: TErr) => {
                onCopyError?.(err)
                toast.error('Sorry, Failed to copy')
            })
    }, [copyInterval, onCopyError, onCopySuccess, successText, textContent])

    return (
        <button
            className={cn(
                'inline cursor-pointer text-foreground/40 duration-150 ease-in-out hover:text-foreground',
                copied && 'pointer-events-none',
                className
            )}
            onClick={(e) => {
                e.stopPropagation()
                handleCopy()
            }}
        >
            {copied ? (
                <CheckIcon
                    className={cn(
                        'inline text-primary size-4 mr-1',
                        className,
                        successClassName
                    )}
                />
            ) : (
                <CopyIcon className={cn('inline size-4 mr-1', iconClassName)} />
            )}
            {children}
        </button>
    )
}

export default CopyTextButton
