import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib'

import { CheckIcon, CopyIcon } from '@/components/icons'

import { IBaseProps } from '@/types'

interface CopyToClipboardProps extends IBaseProps {
    copyMsg?: string
    cooldown?: number
    disabled?: boolean
    iconClassName?: string
    onCopy?: () => boolean | Promise<boolean>
}

export const CopyWrapper: React.FC<CopyToClipboardProps> = ({
    copyMsg = 'Coppied',
    children,
    iconClassName,
    disabled = false,
    cooldown = 1500,
    className,
    onCopy,
}) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (disabled) return
        if (onCopy) {
            const result = await onCopy()
            setTimeout(() => setCopied(false), cooldown)
            return setCopied(result)
        }

        if (!rootRef.current || disabled || copied) return
        const text = rootRef.current.innerText
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), cooldown)
            toast.success(copyMsg)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Copy Failed')
        }
    }

    return (
        <div
            ref={rootRef}
            className={cn(
                'relative inline-block cursor-pointer max-w-full text-foreground/80 group/copy hover:text-foreground',
                className,
                disabled && 'opacity-80 pointer-events-none cursor-not-allowed'
            )}
            onClick={handleCopy}
        >
            <span className="relative inline mr-1 text-muted-foreground/40 group-hover/copy:text-foreground">
                <CheckIcon
                    data-check-icon-state={copied}
                    className={cn(
                        'transition-all scale-0 opacity-0 data-[check-icon-state=true]:scale-100 data-[check-icon-state=true]:opacity-100',
                        'inline mr-1 text-primary',
                        iconClassName
                    )}
                />
                <CopyIcon
                    data-copy-icon-state={copied}
                    className={cn(
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all',
                        'inline mr-1 scale-0 opacity-0 data-[copy-icon-state=false]:scale-100 data-[copy-icon-state=false]:opacity-100',
                        iconClassName
                    )}
                />
            </span>
            {children}
        </div>
    )
}

export default CopyWrapper
