import z from 'zod'

import { IBaseEntityMeta, ILongLat, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { InventorySupplierSchema } from './inventory-supplier.validation'

export interface IInventorySupplier extends IBaseEntityMeta, ILongLat {
    name: string
    description?: string
    address?: string
    contact_number?: string

    longitude?: number
    latitude?: number

    media_id?: TEntityId
    media?: IMedia
    icon?: string
}

export type IInventorySupplierRequest = z.infer<typeof InventorySupplierSchema>

export interface IInventorySupplierPaginated extends IPaginatedResult<IInventorySupplier> {}
