import { IQRInvitationCode, IQrMemberIdData, IQRMemberProfile } from '@/types'

// Type of QR content identifier
export type TQrContentType =
    | 'unknown-qr'
    | 'invitation-code-qr'
    | 'user-qr'
    | 'member-profile-qr'

// Raw JSON-parsed QR scan result
export type IQrScanResult<
    TData = unknown,
    TContentType extends TQrContentType = 'unknown-qr',
> = {
    type: TContentType
    data: TData
}

export interface IQrUserDecodedResult
    extends IQrScanResult<IQrMemberIdData, 'user-qr'> {}

export interface IQrInvitationCodeDecodedResult
    extends IQrScanResult<IQRInvitationCode, 'invitation-code-qr'> {}

export interface IQRMemberProfileDecodedResult
    extends IQrScanResult<IQRMemberProfile, 'member-profile-qr'> {}
