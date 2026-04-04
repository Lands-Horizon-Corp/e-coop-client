import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { InventoryCategorySchema } from './inventory-category.validation'

export interface IInventoryCategory extends IBaseEntityMeta {
    name: string
    description?: string
    icon?: string
}
export type IInventoryCategoryRequest = z.infer<typeof InventoryCategorySchema>

export interface IInventoryCategoryPaginated extends IPaginatedResult<IInventoryCategory> {}
