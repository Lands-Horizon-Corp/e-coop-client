import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface IChargesRateMemberTypeModeOfPaymentRequest {
    member_type_id: TEntityId
    mode_of_payment?: string
    name?: string
    description?: string
}

export interface IChargesRateMemberTypeModeOfPaymentResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_type_id: TEntityId
    member_type?: {
        id: TEntityId
        name: string
    }
    mode_of_payment: string
    name: string
    description: string
}
