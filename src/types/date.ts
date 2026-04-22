import { MONTHS } from '@/constants'

export type TMonth = (typeof MONTHS)[number]

export type TMonthValue = TMonth['value']

export type TMonthName = TMonth['label']
