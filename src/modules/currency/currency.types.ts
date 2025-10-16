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
    iso_3166_alpha2?: string // ISO 3166-1 alpha-2
    iso_3166_alpha3?: string // ISO 3166-1 alpha-3
    iso_3166_numeric?: string // ISO 3166-1 numeric
    phone_code?: string // Country phone code
    domain?: string // Country top-level domain
    locale?: string // Country locale code
}

export type ICurrencyRequest = z.infer<typeof CurrencySchema>

export interface ICurrencyPaginated extends IPaginatedResult<ICurrency> {}
