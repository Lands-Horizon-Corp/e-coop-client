import { TEntityId } from '@/types'

// Aligned with Go TUnit consts
export const UNITS = [
    { value: 'microgram', label: 'Microgram' },
    { value: 'milligram', label: 'Milligram' },
    { value: 'gram', label: 'Gram' },
    { value: 'kilogram', label: 'Kilogram' },
    { value: 'metric_ton', label: 'Metric Ton' },
    { value: 'ounce', label: 'Ounce' },
    { value: 'pound', label: 'Pound' },
    { value: 'n/a', label: 'N/A' },
] as const

// Aligned with Go StatusIn consts
export const STATUS_IN = [
    'draft',
    'pending',
    'approved',
    'receiving',
    'received',
    'cancelled',
    'missing',
] as const

// Aligned with Go StatusOut consts
export const STATUS_OUT = [
    'draft',
    'pending',
    'approved',
    'picking',
    'out_for_delivery',
    'delivered',
    'cancelled',
] as const

export interface IInventoryUnifiedStockRequest {
    inventory_item_id?: TEntityId
    barcode?: string

    name?: string
    unit?: string

    category_id?: TEntityId
    brand_id?: TEntityId

    warehouse_id?: TEntityId
    supplier_id?: TEntityId

    quantity: number
    unit_cost?: number

    description?: string

    status_in?: string
    status_out?: string
}
