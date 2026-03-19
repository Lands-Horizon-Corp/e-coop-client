import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IInventoryBrand } from '../inventory-brand'
import { IInventoryCategory } from '../inventory-category'
import { IInventoryHazard } from '../inventory-hazard'
import { IInventorySupplier } from '../inventory-supplier'
import { IInventoryTag } from '../inventory-tag'
import { IInventoryWarehouse } from '../inventory-warehouse'
import { IMedia } from '../media'
import { InventoryItemSchema } from './inventory-item.validation'

export interface IInventoryItem extends IBaseEntityMeta {
    // Core Fields
    name: string
    description?: string
    serial_number?: string
    unit?: string

    total_quantity: number
    total_price: number

    // Barcodes (multi-format)
    barcode_39?: string
    barcode_ean_8?: string
    barcode_ean_13?: string
    barcode_upc_a?: string
    barcode_upc_e?: string
    barcode_code_128?: string
    barcode_itf_14?: string
    barcode_qr_code?: string
    barcode_pdf_417?: string
    barcode_aztec?: string
    barcode_data_matrix?: string
    barcode_gs1_data_bar_expanded?: string
    barcode_gs1_data_matrix?: string

    // Optional relations (for populated API)

    media_id?: TEntityId
    media?: IMedia

    category_id?: TEntityId
    category?: IInventoryCategory

    brand_id?: TEntityId
    brand?: IInventoryBrand

    warehouse_id?: TEntityId
    warehouse?: IInventoryWarehouse

    supplier_id?: TEntityId
    supplier?: IInventorySupplier

    hazard_id?: TEntityId
    hazard?: IInventoryHazard

    tags?: IInventoryTag[]
}

export type IInventoryItemRequest = z.infer<typeof InventoryItemSchema>

export interface IInventoryItemPaginated extends IPaginatedResult<IInventoryItem> {}
