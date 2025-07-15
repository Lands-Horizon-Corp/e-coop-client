import { TAG_CATEGORY } from '@/constants'

import { IBaseEntityMeta, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export type TTagCategory = (typeof TAG_CATEGORY)[number]

export interface ITagTemplate extends IBaseEntityMeta {
    name: string
    description?: string

    category: TTagCategory

    color: string
    icon: string // when using this interface please type cast nlng to TIcon
}

export interface ITagTemplateRequest {
    id?: TEntityId

    name: string
    description?: string

    category: TTagCategory

    color: string
    icon: string
}

export interface ITagTemplatePaginated extends IPaginatedResult<ITagTemplate> {}
