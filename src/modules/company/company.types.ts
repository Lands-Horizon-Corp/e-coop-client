import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { CompanySchema } from './company.validation'

export interface ICompany extends IBaseEntityMeta {
    //add here
}

export type ICompanyRequest = z.infer<typeof CompanySchema>

export interface ICompanyPaginated extends IPaginatedResult<ICompany> {}
