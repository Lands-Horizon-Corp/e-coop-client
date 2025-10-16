import { IBaseEntityMeta, TEntityId } from '@/types/common'

export interface IChargesRateSchemeModeOfPaymentRequest {
    member_type_id: TEntityId
    mode_of_payment?: string
    name?: string
    description?: string
}

export interface IChargesRateSchemeModeOfPayment extends IBaseEntityMeta {
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
