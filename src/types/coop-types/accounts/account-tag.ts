import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IPaginatedResult } from '../paginated-result'
import { TTagCategory } from '../tag-template'

export interface IAccountTag extends IBaseEntityMeta {
    account_id: TEntityId

    name: string
    description: string
    category: TTagCategory
    color: string
    icon: string
}

export interface IAccounTagRequest {
    account_id: TEntityId
    name: string
    description?: string
    category: TTagCategory
    color?: string
    icon?: string
}

export interface IAccountTagPaginated extends IPaginatedResult<IAccountTag> {}
