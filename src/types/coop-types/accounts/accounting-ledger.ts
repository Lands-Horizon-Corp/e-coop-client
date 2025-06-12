import { ITimeStamps, TEntityId } from '../../common'
import { IPaginatedResult } from '../paginated-result'

interface IAccountLedgerSummaryResource {
    debit: number
    credit: number
    balance: number
}

export type IAccountingLedgerRequest = {
    id?: TEntityId
    description: string
    notes: string
    companyId: TEntityId
    memberProfileId: TEntityId
    accountId: TEntityId
    employeeId: TEntityId
    orNumber: string
    transactionSource: TransactionSource
    debit: number
    credit: number
    balance: number
    transactionDate: Date
    entryDate: Date
    lineNumber?: number | null
    transactionTypeId: string
    createdBy: TEntityId
    created_at: string
}

export interface IAccountingLedgerResource extends ITimeStamps {
    id: TEntityId
    description: string
    notes: string
    companyId: TEntityId
    memberProfileId: TEntityId
    accountId: TEntityId
    employeeId: TEntityId
    orNumber: string
    transactionSource: TransactionSource
    debit: number
    credit: number
    balance: number
    transactionDate: Date
    entryDate: Date
    lineNumber?: number | null
    transactionTypeId: string
    createdBy: TEntityId
    summary: IAccountLedgerSummaryResource
}

export interface IAccountingLedgerPaginatedResource
    extends IPaginatedResult<IAccountingLedgerResource> {}

export enum TransactionSource {
    withdrawal = 'withdrawal',
    deposit = 'deposit',
    payment = 'payment',
}

export type TransactionType = {
    id: TEntityId
    description: string
    chequeId: TEntityId
}

export enum TransactionTypeEnum {
    CASH = 'CSH',
    CHEQUE = 'CHQ',
    FWB = 'Beginning',
}
