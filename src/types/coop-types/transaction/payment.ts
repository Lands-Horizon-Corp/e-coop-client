import { TEntityId } from '@/types'

export interface IPaymentRequest {
    amount: number

    bank_id?: TEntityId
    account_id: TEntityId
    payment_type_id?: TEntityId
    signature_media_id?: TEntityId
    proof_of_payment_media_id?: TEntityId

    bank_reference_number?: string
    entry_date?: string

    /** Validation: max=255 */
    description?: string
}

export interface IPaymentQuickRequest {
    amount: number

    signature_media_id?: TEntityId
    proof_of_payment_media_id?: TEntityId
    bank_id?: TEntityId
    bank_reference_number?: string
    entry_date?: string
    account_id?: TEntityId
    payment_type_id?: TEntityId

    /** Validation: max=255 */
    description?: string
    member_profile_id?: TEntityId
    member_joint_account_id?: TEntityId
    reference_number: string
    or_auto_generated?: boolean
}
