import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IAccount } from '../account'
import { IInventoryHazard } from '../inventory-hazard'
import { TInventoryUnit } from '../inventory-stock'
import { IInventorySupplier } from '../inventory-supplier'
import { IInventoryWarehouse } from '../inventory-warehouse'
import { InventoryEntrySchema } from './inventory-entry.validation'

export const InventoryEntryStatus = [
    'draft',
    'pending',
    'approved',
    'receiving',
    'received',
    'cancelled',
    'missing',
] as const

export type TInventoryEntryStatus = (typeof InventoryEntryStatus)[number]

export interface IInventoryEntry extends IBaseEntityMeta {
    inventory_internal: IInventoryWarehouse

    quantity: number
    debit: number
    debit_account: IAccount
    credit: number
    creadit_account: IAccount

    //    inventory_item:InventoryItem
    supplier: IInventorySupplier
    status_in: TInventoryEntryStatus
    status_out: TInventoryEntryStatus

    weight: number
    unit: TInventoryUnit

    dimension_width?: number
    dimension_length?: number
    dimension_height?: number

    inventory_hazard: IInventoryHazard

    description?: string
    longitude?: number
    latitude: number

    current_location: string
}

export type IInventoryEntryRequest = z.infer<typeof InventoryEntrySchema>

export interface IInventoryEntryPaginated extends IPaginatedResult<IInventoryEntry> {}
