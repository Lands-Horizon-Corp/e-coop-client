import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { InventoryItemSchema } from './inventory-item.validation'

export interface IInventoryItem extends IBaseEntityMeta {
    //add here
}

export type IInventoryItemRequest = z.infer<typeof InventoryItemSchema>

export interface IInventoryItemPaginated extends IPaginatedResult<IInventoryItem> {}
