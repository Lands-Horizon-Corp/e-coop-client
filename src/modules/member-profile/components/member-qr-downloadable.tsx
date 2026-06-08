import { ReactNode, useRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { FaFileCode, FaFileImage, FaRegImage } from 'react-icons/fa6'

import { IQrCodeProps, QrCode } from '@/components/qr-code'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import {
    UseDownloadOptions,
    useDownloadElement,
} from '@/hooks/use-download-element'

interface Props
    extends
        Omit<IQrCodeProps, 'children'>,
        Omit<UseDownloadOptions, 'fileType'> {
    containerClassName?: string
    children?: ReactNode
}

const MemberQrCodeDownloadable = ({
    fileName,
    containerClassName,
    onError,
    onSuccess,
    children,
    ...other
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { download, isDownloading } = useDownloadElement()

    const handleDownload = (fileType: 'png' | 'jpeg' | 'svg') => {
        download(containerRef.current, {
            fileName,
            fileType,
            onSuccess,
            onError,
        })
    }

    return (
        <div className={cn('w-fit space-y-2', containerClassName)}>
            <div
                className="flex flex-col items-center rounded-xl bg-white text-black p-4"
                ref={containerRef}
            >
                <QrCode {...other} />

                {children && (
                    <div className="mt-3 w-full text-center">{children}</div>
                )}
            </div>

            <p className="text-muted-foreground my-4 text-center text-sm">
                choose file type to download
            </p>

            {isDownloading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        onClick={() => handleDownload('png')}
                        size="sm"
                        variant="secondary"
                    >
                        <FaFileImage className="mr-1" />
                        PNG
                    </Button>

                    <Button
                        onClick={() => handleDownload('jpeg')}
                        size="sm"
                        variant="secondary"
                    >
                        <FaRegImage className="mr-1" />
                        JPEG
                    </Button>

                    <Button
                        disabled={isDownloading}
                        onClick={() => handleDownload('svg')}
                        size="sm"
                        variant="secondary"
                    >
                        <FaFileCode className="mr-1" />
                        SVG
                    </Button>
                </div>
            )}
        </div>
    )
}

export default MemberQrCodeDownloadable
