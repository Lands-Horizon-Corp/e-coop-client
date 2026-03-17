import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IInventoryCategory } from '../inventory-category'
import { IInventoryInternalWarehouse } from '../inventory-warehouse'
import { InventoryStockSchema } from './inventory-stock.validation'

export const UNITS = [
    'microgram',
    'milligram',
    'centigram',
    'decigram',
    'gram',
    'dekagram',
    'hectogram',
    'kilogram',
    'metric_ton',
    'grain',
    'dram',
    'ounce',
    'pound',
    'stone',
    'quarter',
    'hundredweight',
    'long_hundredweight',
    'short_ton',
    'long_ton',
    'atomic_mass_unit',
    'dalton',
] as const

export type TInventoryUnit = (typeof UNITS)[number]

export interface IInventoryStock extends IBaseEntityMeta {
    name: string
    description: string

    media_id: TEntityId
    total_quantity: number
    total_price: number

    inventory_category: IInventoryCategory[]
    brands: IInventoryCategory

    barcode_39: string
    barcode_ean_13: string
    barcode_qr_code: string
    barcode_datqa_matrix: string
    barcode_gs1_data_bar_expanded: string
    barcode_gs1_data_matrix: string

    unit: TInventoryUnit
    serial_number: string
    internal_warehouse: IInventoryInternalWarehouse
}

export type IInventoryStockRequest = z.infer<typeof InventoryStockSchema>

export interface IInventoryStockPaginated extends IPaginatedResult<IInventoryStock> {}
