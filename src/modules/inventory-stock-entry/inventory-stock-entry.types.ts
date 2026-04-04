import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { InventoryStockEntrySchema } from './inventory-stock-entry.validation'

export interface IInventoryStockEntry extends IBaseEntityMeta {
    //add here
}

export type IInventoryStockEntryRequest = z.infer<
    typeof InventoryStockEntrySchema
>

export interface IInventoryStockEntryPaginated extends IPaginatedResult<IInventoryStockEntry> {}
