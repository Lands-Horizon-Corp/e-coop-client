import z from 'zod'

import { IBaseEntityMeta, ILongLat, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { InventoryWarehouseSchema } from './inventory-warehouse.validation'

export const WAREHOUSE_TYPE = ['Bonded', 'Private', 'Public'] as const

export type TWarehouseType = (typeof WAREHOUSE_TYPE)[number]

export interface IInventoryInternalWarehouse extends IBaseEntityMeta, ILongLat {
    name: string
    description?: string
    type: TWarehouseType
    code?: string

    address?: string
    location?: string
    longitude?: number
    latitude?: number
    icon?: string

    media_id?: TEntityId
    media: IMedia
}

export type IInventoryInternalWarehouseRequest = z.infer<
    typeof InventoryWarehouseSchema
>

export interface IInventoryInternalWarehousePaginated extends IPaginatedResult<IInventoryInternalWarehouse> {}
