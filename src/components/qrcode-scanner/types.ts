import { IQrScanResult } from '@/types'
import { IDetectedBarcode, IScannerProps } from '@yudiel/react-qr-scanner'

// Just scanner component desu (no decoding)
export interface IQrScannerProps extends IScannerProps {}

// Scanne component desu (with decoding support)
export interface IQrCodeScannerProps<T, Err>
    extends Omit<IQrScannerProps, 'onScan'> {
    disableDecode?: boolean
    pauseOnDecoding?: boolean
    onErrorDecode?: (error: Err) => void
    onSuccessDecode?: (data: IQrScanResult<T>) => void
    onScan?: (detectedCodes: IDetectedBarcode[]) => void
}
