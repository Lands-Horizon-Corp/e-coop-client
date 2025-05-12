import { IQrMemberIdData } from '@/types'

// Type of QR content identifier
export type TQrContentType = 'unknown-qr' | 'member-id' | 'user-id'

// Raw JSON-parsed QR scan result
export type IQrScanResult<
    TData = unknown,
    TContentType extends TQrContentType = 'unknown-qr',
> = {
    type: TContentType
    data: TData
}

// The decoded QR result specifically for a Member ID
export interface IQrMemberIdDecodedResult
    extends IQrScanResult<IQrMemberIdData, 'member-id'> {}

export interface IQrUserAccountDecodedResult
    extends IQrScanResult<IQrMemberIdData, 'user-id'> {}
