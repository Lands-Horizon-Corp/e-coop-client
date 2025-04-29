import { IQrMemberIdData } from '@/types'

// Type of QR content identifier
export type TQrContentType = 'member-id'

// Raw JSON-parsed QR scan result
export type IQrScanResult<T = unknown> = {
    type: TQrContentType
    data: T
}

// The decoded QR result specifically for a Member ID
export interface IQrMemberIdDecodedResult
    extends IQrScanResult<IQrMemberIdData> {
    type: 'member-id'
}
