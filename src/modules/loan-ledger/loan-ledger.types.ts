import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import {
    LoanLedgerSchema,
    TLoanLedgerChangeLineSchema,
} from './loan-ledger.validation'

export interface ILoanLedger extends IBaseEntityMeta {
    //add here

    line_number?: number

    reference_number: string
    entry_date: string
    debit: number
    credit: number
    balance: number
    type: 'CASH'
}

export type ILoanLedgerRequest = z.infer<typeof LoanLedgerSchema>

export interface ILoanLedgerPaginated extends IPaginatedResult<ILoanLedger> {}

export type ILoanLedgerChangeLineRequest = TLoanLedgerChangeLineSchema
