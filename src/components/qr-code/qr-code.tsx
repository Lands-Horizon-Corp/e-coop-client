import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { QRCodeSVG } from 'qrcode.react'

import { QrCodeIcon } from '@/components/icons'

import { IClassProps } from '@/types'

export interface IQrCodeProps extends IClassProps {
    value: string
    themeResponsive?: boolean
}

const QrCode = forwardRef<HTMLDivElement, IQrCodeProps>(
    ({ value, className }, qrRef) => {
        if (!value) return

        return (
            <div
                className={cn(
                    'relative flex size-48 flex-col items-center justify-center rounded-xl bg-white p-5',
                    className
                )}
                ref={qrRef}
            >
                {value.length === 0 ? (
                    <div className="flex flex-col items-center gap-y-4 text-gray-700/70">
                        <QrCodeIcon className="size-36" />
                        <p className="text-center text-sm lg:text-lg">
                            QR No Content
                        </p>
                    </div>
                ) : (
                    <QRCodeSVG
                        // NOTE: DO NOT PUT RADIUS THAT COULD CROP QRCODE! QR CODE WONT IDENTIFY BY QR CODE READER
                        className="size-full duration-300"
                        imageSettings={{
                            src: '/favicon.ico',
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            opacity: 1,
                            excavate: true,
                        }}
                        level={'M'}
                        value={value}
                    />
                )}
            </div>
        )
    }
)

export default QrCode
