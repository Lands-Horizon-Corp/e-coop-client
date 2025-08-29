import z from 'zod'

import {
    IBaseEntityMeta,
    IPaginatedResult,
    TEntityId,
    TTagCategory,
} from '@/types'

import { TagTemplateSchema } from './tag-template.validation'

export interface ITagTemplate extends IBaseEntityMeta {
    account_id: TEntityId

    name: string
    description: string
    category: TTagCategory
    color: string
    icon: string
}

export type ITagTemplateRequest = z.infer<typeof TagTemplateSchema>

export interface ITagTemplatePaginated extends IPaginatedResult<ITagTemplate> {}
