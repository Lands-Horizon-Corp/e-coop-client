import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { AmortizationSchema } from './amortization.validation'

// not used for now
export interface IAmortization extends IBaseEntityMeta {
    //add here
}

// not used for now
export type IAmortizationRequest = z.infer<typeof AmortizationSchema>

// not used for now
export interface IAmortizationPaginated
    extends IPaginatedResult<IAmortization> {}

// Amortization Schedule Types
export interface IAmortizationPayment {
    date: string
    principal: number
    lr: number // Loan Receivable (remaining balance)
    interest: number
    service_fee: number
    total: number
}

export interface IAmortizationSummary {
    total_terms: number
    total_principal: number
    total_interest: number
    total_service_fee: number
    total_amount: number
    loan_amount: number
    monthly_payment: number
    interest_rate: number
    computation_type: string
    mode_of_payment: string
}

export interface IAmortizationLoanDetails {
    due_date: string
    account_applied: number
    voucher: string
}

export interface IAmortizationSchedule {
    loan_details: IAmortizationLoanDetails
    amortization_schedule: IAmortizationPayment[]
    summary: IAmortizationSummary
    generated_at: string
}
