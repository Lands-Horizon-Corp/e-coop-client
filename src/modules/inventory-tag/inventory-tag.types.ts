import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IInventoryItem } from '../inventory-item'
import { TTagCategory } from '../tag-template'
import { InventoryTagSchema } from './inventory-tag.validation'

export interface IInventoryTag extends IBaseEntityMeta {
    inventory_item_id: TEntityId
    inventory_id: IInventoryItem

    name: string
    description?: string
    category?: TTagCategory

    color?: string
    icon?: string
}

export type IInventoryTagRequest = z.infer<typeof InventoryTagSchema>

export interface IInventoryTagPaginated extends IPaginatedResult<IInventoryTag> {}
