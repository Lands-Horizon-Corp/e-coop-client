import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib'

import { CheckIcon, CopyIcon } from './icons'

interface Props<TErr = unknown> {
    textContent: string
    copyInterval?: number
    className?: string
    successText?: string
    successClassName?: string
    onCopySuccess?: () => void
    onCopyError?: (error: TErr) => void
}

const CopyTextButton = <TErr = unknown,>({
    className,
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

    if (copied)
        return (
            <CheckIcon
                className={cn(
                    'inline text-primary',
                    className,
                    successClassName
                )}
            />
        )

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
            <CopyIcon className="size-full" />
        </button>
    )
}

export default CopyTextButton
