import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { PermissionTemplateSchema } from './permission-template.validation'

export interface IPermissionTemplate extends IBaseEntityMeta {
    id: TEntityId
    //add here
}

export type IPermissionTemplateRequest = z.infer<typeof PermissionTemplateSchema>

export interface IPermissionTemplatePaginated extends IPaginatedResult<IPermissionTemplate> {}
