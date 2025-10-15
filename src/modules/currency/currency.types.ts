import z from 'zod'

import { IAuditable, IPaginatedResult, TEntityId } from '@/types'

import { CurrencySchema } from './currency.validation'

export interface ICurrency extends IAuditable {
    id: TEntityId
    name: string
    country: string
    currency_code: string
    symbol?: string
    emoji?: string
}

export type ICurrencyRequest = z.infer<typeof CurrencySchema>

export interface ICurrencyPaginated extends IPaginatedResult<ICurrency> {}
