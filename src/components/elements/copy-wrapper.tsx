import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib'

import { CheckIcon, CopyIcon } from '@/components/icons'

import { IBaseProps } from '@/types'

interface CopyToClipboardProps extends IBaseProps {
    copyMsg?: string
    cooldown?: number
    disabled?: boolean
    onCopy?: () => boolean
}

export const CopyWrapper: React.FC<CopyToClipboardProps> = ({
    copyMsg = 'Coppied',
    children,
    disabled = false,
    cooldown = 1500,
    className,
    onCopy,
}) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (onCopy) return setCopied(onCopy())

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
                'relative inline-block cursor-pointer max-w-full text-foreground/80 group hover:text-foreground',
                className,
                disabled && 'opacity-80 pointer-events-none cursor-not-allowed'
            )}
            onClick={handleCopy}
        >
            <span className="relative inline mr-1 text-muted-foreground/70 group-hover:text-foreground">
                <CheckIcon
                    className={cn(
                        'transition-all',
                        'inline mr-1 text-primary',
                        copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    )}
                />
                <CopyIcon
                    className={cn(
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all',
                        'inline mr-1',
                        copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    )}
                />
            </span>
            {children}
        </div>
    )
}

export default CopyWrapper
