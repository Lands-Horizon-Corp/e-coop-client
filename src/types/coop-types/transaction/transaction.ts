import {
    IBaseEntityMeta,
    IMedia,
    IMemberJointAccount,
    IMemberProfile,
    IPaginatedResult,
    ITransactionBatch,
    IUserBase,
    TEntityId,
    TPaymentSource,
} from '@/types'

export interface ITransactionRequest {
    member_joint_account_id?: TEntityId
    transaction_batch_id?: TEntityId
    signature_media_id?: TEntityId
    employee_user_id?: TEntityId
    member_profile_id?: TEntityId

    is_reference_number_checked?: boolean
    reference_number?: string
    source?: TPaymentSource
    description?: string
}

export interface ITransactionResponse extends IBaseEntityMeta {
    amount: number
    source: TPaymentSource
    description: string

    signature_media_id: TEntityId
    signature_media: IMedia | null

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch | null

    employee_user_id: TEntityId
    employee_user: IUserBase | null

    member_profile_id: TEntityId
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId
    member_joint_account: IMemberJointAccount | null

    loan_balance: number
    loan_due: number
    total_due: number
    fines_due: number
    total_loan: number
    interest_due: number
    reference_number: string
}

export interface ITransactionPaginated
    extends IPaginatedResult<ITransactionResponse> {}
