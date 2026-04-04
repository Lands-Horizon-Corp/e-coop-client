import { IInventoryItem } from '@/modules/inventory-item'

export interface IInventoryItemComputed {
    average_cost: number
    is_low_stock: boolean
    is_out_of_stock: boolean
}

export function computeInventory(item: IInventoryItem): IInventoryItemComputed {
    const quantity = item.total_quantity ?? 0
    const totalPrice = item.total_price ?? 0

    const averageCost = quantity > 0 ? totalPrice / quantity : 0

    return {
        average_cost: averageCost,
        is_out_of_stock: quantity === 0,
        is_low_stock: quantity > 0 && quantity < 10, // you can tweak threshold
    }
}
