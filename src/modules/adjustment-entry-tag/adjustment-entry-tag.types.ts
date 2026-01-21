import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAdjustmentEntry } from '../adjustment-entry'

export interface IAdjustmentEntryTag extends IBaseEntityMeta {
    adjustment_entry_id: TEntityId
    adjustment_entry: IAdjustmentEntry

    name: string
    description?: string
    category: string
    color: string
    icon: string
}

export interface IAdjustmentEntryTagRequest {
    adjustment_entry_id: TEntityId
    name: string
    description?: string
    category: string
    color: string
    icon: string
}

export interface IAdjustmentEntryTagPaginated
    extends IPaginatedResult<IAdjustmentEntryTag> {}
