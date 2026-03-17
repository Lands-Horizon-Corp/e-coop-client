import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { InventoryHazardSchema } from './inventory-hazard.validation'

export interface IInventoryHazard extends IBaseEntityMeta {
    name: string
    description?: string
    icon?: string
}

export type IInventoryHazardRequest = z.infer<typeof InventoryHazardSchema>

export interface IInventoryHazardPaginated extends IPaginatedResult<IInventoryHazard> {}
