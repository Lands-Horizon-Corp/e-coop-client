import { TEntityId } from '@/types'

export const PaymentSource = [
    'withdraw',
    'deposit',
    'journal',
    'payment',
    'adjustment',
    'check',
    'voucher',
] as const

export type TPaymentSource = (typeof PaymentSource)[number]

export interface IPaymentRequest {
    amount: number

    bank_id?: TEntityId | null
    account_id?: TEntityId | null
    payment_type_id?: TEntityId | null
    signature_media_id?: TEntityId | null
    proof_of_payment_media_id?: TEntityId | null

    bank_reference_number?: string
    entry_date?: string | null

    /** Validation: max=255 */
    description?: string
}

export interface IPaymentQuickRequest {
    amount: number

    signature_media_id?: TEntityId | null
    proof_of_payment_media_id?: TEntityId | null
    bank_id?: TEntityId | null
    bank_reference_number?: string
    entry_date?: string | null
    account_id: TEntityId | null
    payment_type_id: TEntityId | null

    /** Validation: max=255 */
    description?: string
    member_profile_id?: TEntityId | null
    member_joint_account_id?: TEntityId | null
    reference_number: string
    or_auto_generated: boolean
}
