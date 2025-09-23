import z from 'zod'

import { TIcon } from '@/components/icons'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { TagTemplateSchema } from './tag-template.validation'
import { TAG_CATEGORY } from './tag.constants'

export type TTagCategory = (typeof TAG_CATEGORY)[number]

export interface ITagTemplate extends IBaseEntityMeta {
    name: string
    description: string
    category: TTagCategory
    color: string
    icon: TIcon
}

export type ITagTemplateRequest = z.infer<typeof TagTemplateSchema>

export interface ITagTemplatePaginated extends IPaginatedResult<ITagTemplate> {}
