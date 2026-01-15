import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IGeneralLedger } from '../general-ledger'
import { ILoanAccount } from '../loan-account'
import { LOAN_SCHEDULE_STATUS } from './loan-guide-constant'
import { LoanGuideSchema } from './loan-guide.validation'

export type TLoanScheduleStatus = (typeof LOAN_SCHEDULE_STATUS)[number]

export interface ILoanPayments {
    amount: number
    pay_date: string
    general_ledger: IGeneralLedger
}

export interface ILoanPaymentSchedule {
    loan_payments: ILoanPayments[]

    payment_date: string
    scheduled_date: string
    actual_date: string
    days_skipped: string

    amount_due: number
    amount_paid: number
    balance: number
    principal_amount: number
    interest_amount: number
    fines_amount: number
    type: TLoanScheduleStatus
}

export interface ILoanAccountSummary {
    loan_account: ILoanAccount
    payment_schedules: ILoanPaymentSchedule[]

    total_amount_due: number
    total_amount_paid: number
    current_balance: number

    next_due_date?: string
    days_overdue: number
    overdue_amount: number
    completion_status: string
}

export interface ILoanGuide extends IBaseEntityMeta {
    loan_accounts: ILoanAccountSummary[]
    total_loans: number
    active_loans: number
    completed_loans: number
    defaulted_loans: number
    total_outstanding: number
    total_overdue: number
}

export type ILoanGuideRequest = z.infer<typeof LoanGuideSchema>

export interface ILoanGuidePaginated extends IPaginatedResult<ILoanGuide> {}
