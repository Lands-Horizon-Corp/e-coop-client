import { toast } from 'sonner'
import { useCallback } from 'react'
import { IDetectedBarcode } from '@yudiel/react-qr-scanner'

import QrScanner from './qr-scanner'
import Modal, { IModalProps } from '../modals/modal'
import LoadingSpinner from '../spinners/loading-spinner'

import { cn } from '@/lib'
import { IQrScanResult } from '@/types'
import { IQrCodeScannerProps } from './types'
import { useQrDecryptData } from '@/hooks/api-hooks/use-qr-crypto'

const QrCodeScanner = <TData, TErr = string>({
    paused,
    scanDelay = 1000,
    disableDecode = false,
    pauseOnDecoding = false,
    onScan,
    onErrorDecode,
    onSuccessDecode,
    ...props
}: IQrCodeScannerProps<TData, TErr>) => {
    const { mutateAsync, isPending } = useQrDecryptData<TData>()

    const handleOnScan = useCallback(
        (results: IDetectedBarcode[]) => {
            if (results.length === 0) return

            if (disableDecode) return onScan?.(results)

            try {
                const parsedQrContent = JSON.parse(
                    results[0].rawValue
                ) as IQrScanResult

                if (!parsedQrContent.data)
                    return toast.error(
                        'Sorry, QR Code is Not ECoop generated QR'
                    )

                toast.promise(mutateAsync(parsedQrContent.data as string), {
                    loading: 'Verifying QR...',
                    success: (data) => {
                        const finalQrResult: IQrScanResult<TData> = {
                            ...parsedQrContent,
                            data,
                        }
                        onSuccessDecode?.(finalQrResult as IQrScanResult<TData>)
                        return 'QRCode verified'
                    },
                    error: (err) => {
                        onErrorDecode?.(err)
                        return err
                    },
                })

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                toast.error('Invalid QR')
                onErrorDecode?.('Invalid QR code content' as TErr)
            }
        },
        [disableDecode, mutateAsync, onErrorDecode, onScan, onSuccessDecode]
    )

    return (
        <QrScanner
            onScan={handleOnScan}
            scanDelay={scanDelay}
            paused={paused || pauseOnDecoding ? isPending : undefined}
            {...props}
        >
            {isPending && (
                <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center bg-muted/70 text-sm">
                    <LoadingSpinner />
                    <p>analyzing qr...</p>
                </div>
            )}
        </QrScanner>
    )
}

export const QrCodeScannerModal = <TData, TErr>({
    className,
    title = 'QR Scan',
    qrScannerProps: { onScan, onSuccessDecode, ...qrScannerProps },
    ...props
}: IModalProps & { qrScannerProps: IQrCodeScannerProps<TData, TErr> }) => {
    return (
        <Modal
            title={title}
            className={cn('max-h[98vh] size-fit max-w-[98vw]', className)}
            {...props}
        >
            <QrCodeScanner<TData, TErr>
                onScan={(data) => {
                    onScan?.(data)
                    props.onOpenChange?.(false)
                }}
                onSuccessDecode={(data) => {
                    onSuccessDecode?.(data)
                    props.onOpenChange?.(false)
                }}
                {...qrScannerProps}
            />
        </Modal>
    )
}

export default QrCodeScanner
