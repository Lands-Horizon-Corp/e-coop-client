import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { CalculatorSchema } from './calculator.validation'

export interface ICalculator extends IBaseEntityMeta {
    //add here
}

export type ICalculatorRequest = z.infer<typeof CalculatorSchema>

export interface ICalculatorPaginated extends IPaginatedResult<ICalculator> {}
