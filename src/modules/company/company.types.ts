import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media/media.types'
import { CompanySchema } from './company.validation'

export interface ICompany extends IBaseEntityMeta {
    id: TEntityId
    name: string
    media_id?: TEntityId
    media?: IMedia
    description?: string
}

export type ICompanyRequest = z.infer<typeof CompanySchema>

export interface ICompanyPaginated extends IPaginatedResult<ICompany> {}
