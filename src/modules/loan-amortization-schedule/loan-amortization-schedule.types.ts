// import z from 'zod'
import { IBaseEntityMeta } from '@/types'

import { IAccount } from '../account'

// import { LoanAmortizationScheduleSchema } from './loan-amortization-schedule.validation'

export interface IAccountValue {
    account: IAccount
    total: number
    value: number
}

export interface ILoanAmortizationSchedule extends IBaseEntityMeta {
    scheduled_date: string
    actual_date: string
    days_skipped: number
    total: number
    balance: number
    accounts: IAccountValue[]
}

// export type ILoanAmortizationScheduleRequest = z.infer<
//     typeof LoanAmortizationScheduleSchema
// >

// export interface ILoanAmortizationSchedulePaginated
//     extends IPaginatedResult<ILoanAmortizationSchedule> {}
