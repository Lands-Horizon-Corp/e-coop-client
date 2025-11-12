import { useCallback } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'

import { DownloadIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const triggerAnchorDownload = (url: string, fileName?: string) => {
    if (!url) return
    const anchor = document.createElement('a')
    anchor.href = url
    if (fileName) {
        anchor.download = fileName
    }
    document.body.appendChild(anchor)
    anchor.click()

    document.body.removeChild(anchor)
}

// 3. Reusable React Component
type FileDownloadButtonProps = {
    url: string
    fileName?: string
    buttonText?: string
    className?: string
    variant?: 'default' | 'outline' | 'ghost' | 'secondary'
    size?:
        | 'default'
        | 'sm'
        | 'lg'
        | 'icon'
        | 'nostyle'
        | 'xs'
        | null
        | undefined
    Icon?: React.ElementType
    onClick: () => void
}

export const FileDownloadButton = ({
    url,
    fileName,
    buttonText = 'Download',
    className,
    variant = 'default',
    size = 'sm',
    Icon = DownloadIcon,
    onClick,
}: FileDownloadButtonProps) => {
    const handleDownload = useCallback(() => {
        onClick?.()
        if (!url) {
            toast.error('Download URL is missing.')
            return
        }
        triggerAnchorDownload(url, fileName)
    }, [url, fileName])

    return (
        <Button
            className={cn('flex items-center justify-center gap-2', className)}
            onClick={handleDownload}
            size={size}
            title={
                url
                    ? `Download ${fileName || 'file'}`
                    : 'No download link available'
            }
            // disabled={!url}
            variant={variant}
        >
            <Icon className={cn('size-4', buttonText === '' && 'size-5')} />
            {buttonText && <span>{buttonText}</span>}
        </Button>
    )
}
