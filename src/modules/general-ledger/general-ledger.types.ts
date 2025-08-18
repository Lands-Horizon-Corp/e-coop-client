import z from 'zod'

import { GENERAL_LEDGER_SOURCES } from '@/constants'

import { IAccount } from '../account'
import { IBank } from '../bank'
import {
    IBaseEntityMeta,
    IPaginatedResult,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IMedia } from '../media/media.types'
import { IPaymentType } from '../payment-type/payment-type.types'
import { ITransactionBatch } from '../transaction-batch/transaction-batch.types'
import { ITransactionResponse } from '../transaction/transaction.types'
import { IUserBase } from '../user/user.types'

export type TEntryType =
    | ''
    | 'check-entry'
    | 'online-entry'
    | 'cash-entry'
    | 'payment-entry'
    | 'withdraw-entry'
    | 'deposit-entry'
    | 'journal-entry'
    | 'adjustment-entry'
    | 'journal-voucher'
    | 'check-voucher'

export type TGeneralLedgerSource = (typeof GENERAL_LEDGER_SOURCES)[number]

export interface IGeneralLedger extends IBaseEntityMeta {
    account_id: TEntityId
    account: IAccount | null

    transaction_id: TEntityId
    transaction: ITransactionResponse | null

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch | null

    employee_user_id: TEntityId
    employee_user: IUserBase | null

    member_profile_id: TEntityId
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId
    member_joint_account: IMemberJointAccount | null

    payment_type_id: TEntityId
    payment_type: IPaymentType | null

    signature_media_id: TEntityId
    signature_media: IMedia | null

    bank_id: TEntityId
    bank: IBank | null

    proof_of_payment_media_id: TEntityId | null
    proof_of_payment_media: IMedia | null

    transaction_reference_number: string
    reference_number: string

    source: TGeneralLedgerSource
    journal_voucher_id: TEntityId
    adjustment_entry_id: TEntityId

    // adjustment_entry:  | null

    type_of_payment_type: string
    credit: number
    debit: number
    balance: number

    entry_date: TEntityId
    bank_reference_number: string
    description: string
}

export interface IGeneralLedgerResponse extends IBaseEntityMeta {
    account_id: TEntityId
    account: IAccount | null

    transaction_id: TEntityId
    transaction: ITransactionResponse | null

    transaction_batch_id: TEntityId
    transaction_batch: ITransactionBatch | null

    employee_user_id: TEntityId
    employee_user: IUserBase | null

    member_profile_id: TEntityId
    member_profile: IMemberProfile | null

    member_joint_account_id: TEntityId
    member_joint_account: IMemberJointAccount | null

    payment_type_id: TEntityId
    payment_type: IPaymentType | null

    signature_media_id: TEntityId
    signature_media: IMedia | null

    bank_id: TEntityId
    bank: IBank | null

    proof_of_payment_media_id: TEntityId | null
    proof_of_payment_media: IMedia | null

    transaction_reference_number: string
    reference_number: string

    source: TGeneralLedgerSource
    journal_voucher_id: TEntityId
    adjustment_entry_id: TEntityId

    // adjustment_entry:  | null

    type_of_payment_type: string
    credit: number
    debit: number
    balance: number

    entry_date: TEntityId
    bank_reference_number: string
    description: string
    print_number?: number
}

export interface IMemberGeneralLedgerTotal {
    total_debit: number
    total_credit: number
    balance: number
}

export interface IGeneralLedgerPaginated
    extends IPaginatedResult<IGeneralLedgerResponse> {}

export const generalLedgerRequestSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    account_id: entityIdSchema.optional().nullable(),
    transaction_id: entityIdSchema.optional().nullable(),
    transaction_batch_id: entityIdSchema.optional().nullable(),
    employee_user_id: entityIdSchema.optional().nullable(),
    member_profile_id: entityIdSchema.optional().nullable(),
    member_joint_account_id: entityIdSchema.optional().nullable(),
    transaction_reference_number: z.string().optional(),
    reference_number: z.string().optional(),
    payment_type_id: entityIdSchema.optional().nullable(),
    source: z.string().optional(),
    journal_voucher_id: entityIdSchema.optional().nullable(),
    adjustment_entry_id: entityIdSchema.optional().nullable(),
    type_of_payment_type: z.string().optional(),
    credit: z.number().optional(),
    debit: z.number().optional(),
    balance: z.number().optional(),
})
