import { IBaseEntityMeta } from '@/types'

export type ChargesRateByTermHeaderRequest = {
    header_1?: number
    header_2?: number
    header_3?: number
    header_4?: number
    header_5?: number
    header_6?: number
    header_7?: number
    header_8?: number
    header_9?: number
    header_10?: number
    header_11?: number
    header_12?: number
    header_13?: number
    header_14?: number
    header_15?: number
    header_16?: number
    header_17?: number
    header_18?: number
    header_19?: number
    header_20?: number
    header_21?: number
    header_22?: number
}

export interface ChargesRateByTermHeaderResponse
    extends IBaseEntityMeta,
        ChargesRateByTermHeaderRequest {}
