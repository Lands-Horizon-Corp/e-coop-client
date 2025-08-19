import {
    IBaseEntityMeta,
    IPaginatedResult,
    TEntityId,
    TTagCategory,
} from '@/types/common'

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
