import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { InventoryBrandSchema } from './inventory-brand.validation'

export interface IInventoryBrand extends IBaseEntityMeta {
    name: string
    description?: string
    icon?: string

    media_id: TEntityId
    media: IMedia
}

export type IInventoryBrandRequest = z.infer<typeof InventoryBrandSchema>

export interface IInventoryBrandPaginated extends IPaginatedResult<IInventoryBrand> {}
