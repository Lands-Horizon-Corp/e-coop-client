import { IAuditable, ITimeStamps } from '@/types/common'

export interface IChargesRateByRangeOrMinimumAmountBase
    extends ITimeStamps,
        IAuditable {
    id: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    from: number
    to: number
    charge: number
    amount: number
    minimum_amount: number
}

export interface IChargesRateByRangeOrMinimumAmountRequest {
    id?: string
    organization_id: string
    branch_id: string
    charges_rate_scheme_id: string

    from: number
    to: number
    charge: number
    amount: number
    minimum_amount: number
}
