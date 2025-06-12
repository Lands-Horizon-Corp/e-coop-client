import { useRef } from 'react'

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import QrCode, { IQrCodeProps } from './qr-code'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ChevronDownIcon, DownloadIcon } from '@/components/icons'

import { cn } from '@/lib'
import {
    useDownloadElement,
    UseDownloadOptions,
} from '@/hooks/use-download-element'

interface Props
    extends Omit<IQrCodeProps, 'children'>,
        Omit<UseDownloadOptions, 'fileType'> {
    containerClassName?: string
}

const QrCodeDownloadable = ({
    fileName,
    containerClassName,
    onError,
    onSuccess,
    ...other
}: Props) => {
    const qrRef = useRef<HTMLDivElement>(null)

    const { download, isDownloading } = useDownloadElement()

    return (
        <div className={cn('w-fit space-y-2', containerClassName)}>
            <QrCode ref={qrRef} {...other}></QrCode>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <LoadingSpinner />
                        ) : (
                            <DownloadIcon className="mr-1 inline" />
                        )}
                        Download
                        <ChevronDownIcon className="-me-1 ms-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                    <DropdownMenuLabel className="text-xs text-foreground/60">
                        QR Format
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() =>
                            download(qrRef.current, {
                                fileName,
                                fileType: 'png',
                                onSuccess,
                                onError,
                            })
                        }
                    >
                        PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            download(qrRef.current, {
                                fileName,
                                fileType: 'jpeg',
                                onSuccess,
                                onError,
                            })
                        }
                    >
                        JPEG
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            download(qrRef.current, {
                                fileName,
                                fileType: 'svg',
                                onSuccess,
                                onError,
                            })
                        }
                    >
                        SVG
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default QrCodeDownloadable
