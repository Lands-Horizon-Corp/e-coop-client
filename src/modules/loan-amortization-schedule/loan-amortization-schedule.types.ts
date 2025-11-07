// import z from 'zod'
import { IBaseEntityMeta } from '@/types'

import { IAccount } from '../account'

// import { LoanAmortizationScheduleSchema } from './loan-amortization-schedule.validation'

export interface IAccountValue {
    account: IAccount
    value: number
}

export interface ILoanAmortizationSchedule extends IBaseEntityMeta {
    scheduledDate: string
    actualDate: string
    daysSkipped: number
    total: number
    accounts: IAccountValue[]
}

// export type ILoanAmortizationScheduleRequest = z.infer<
//     typeof LoanAmortizationScheduleSchema
// >

// export interface ILoanAmortizationSchedulePaginated
//     extends IPaginatedResult<ILoanAmortizationSchedule> {}
