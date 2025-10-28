import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { ChargesRateSchemeModeOfPaymentSchema } from './charges-rate-scheme-mode-of-payment.validation'

export interface IChargesRateSchemeModeOfPayment extends IBaseEntityMeta {
    charges_rate_scheme_id: string
    from: number
    to: number
    column1: number
    column2: number
    column3: number
    column4: number
    column5: number
    column6: number
    column7: number
    column8: number
    column9: number
    column10: number
    column11: number
    column12: number
    column13: number
    column14: number
    column15: number
    column16: number
    column17: number
    column18: number
    column19: number
    column20: number
    column21: number
    column22: number
}

export type IChargesRateSchemeModeOfPaymentRequest = z.infer<
    typeof ChargesRateSchemeModeOfPaymentSchema
>

export interface IChargesRateSchemeModeOfPaymentPaginated
    extends IPaginatedResult<IChargesRateSchemeModeOfPayment> {}
