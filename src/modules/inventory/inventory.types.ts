import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

// import { IInventoryHazard } from '../inventory-hazard'
import { IInventoryTag } from '../inventory-tag'
import { InventorySchema } from './inventory.validation'

export interface IInventory extends IBaseEntityMeta {
    name: string
    description?: string

    sku?: string
    barcode?: string

    category_id?: TEntityId
    brand_id?: TEntityId
    supplier_id?: TEntityId

    warehouse_id?: TEntityId

    hazards?: IInventoryHazard[]
    tags?: IInventoryTag[]
}

export type IInventoryRequest = z.infer<typeof InventorySchema>

export interface IInventoryPaginated extends IPaginatedResult<IInventory> {}

//dummy types
// Units matching Go TUnit type
export type TUnit =
    | 'microgram'
    | 'milligram'
    | 'centigram'
    | 'decigram'
    | 'gram'
    | 'dekagram'
    | 'hectogram'
    | 'kilogram'
    | 'metric_ton'
    | 'grain'
    | 'dram'
    | 'ounce'
    | 'pound'
    | 'stone'
    | 'quarter'
    | 'hundredweight'
    | 'long_hundredweight'
    | 'short_ton'
    | 'long_ton'
    | 'atomic_mass_unit'
    | 'dalton'
    | 'n/a'

// Status types matching Go StatusIn / StatusOut
export type StatusIn =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'receiving'
    | 'received'
    | 'cancelled'
    | 'missing'
export type StatusOut =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'picking'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'

export const STATUS_IN_ORDER: StatusIn[] = [
    'draft',
    'pending',
    'approved',
    'receiving',
    'received',
]
export const STATUS_OUT_ORDER: StatusOut[] = [
    'draft',
    'pending',
    'approved',
    'picking',
    'out_for_delivery',
    'delivered',
]

export const UNITS: TUnit[] = [
    'kilogram',
    'gram',
    'milligram',
    'pound',
    'ounce',
    'metric_ton',
    'short_ton',
    'long_ton',
    'stone',
    'n/a',
]

export interface IInventoryWarehouse {
    id: string
    name: string
    zone: string
}

export interface IAccount {
    id: string
    code: string
    name: string
}

export interface IInventorySupplier {
    id: string
    name: string
    rating: number
}

export interface IInventoryHazard {
    id: string
    code: string
    label: string
    color: string
}

export interface IInventoryItem {
    id: string
    name: string
    sku: string
}

// Matches Go InventoryItemEntryResponse
export interface InventoryItemEntryResponse {
    id: string
    created_at: string
    inventory_item?: IInventoryItem
    warehouse?: IInventoryWarehouse
    supplier?: IInventorySupplier
    debit: number
    credit: number
    quantity: number
    status_in: StatusIn
    status_out: StatusOut
    unit: TUnit
    dimensions_width?: number
    dimensions_length?: number
    dimensions_height?: number
    weight?: number
    description: string
    longitude: number
    latitude: number
    current_location: string
}

// Matches Go InventoryItemEntryRequest
export interface InventoryItemEntryRequest {
    inventory_item_id: string
    warehouse_id?: string
    supplier_id?: string
    debit_account_id?: string
    credit_account_id?: string
    quantity: number
    debit: number
    credit: number
    status_in: StatusIn
    status_out: StatusOut
    unit: TUnit
    dimensions_width?: number
    dimensions_length?: number
    dimensions_height?: number
    weight?: number
    description?: string
    longitude?: number
    latitude?: number
}

export interface ScannedItem {
    sku: string
    name: string
    currentStock: number
    unit: TUnit
    barcodeType: string
}
