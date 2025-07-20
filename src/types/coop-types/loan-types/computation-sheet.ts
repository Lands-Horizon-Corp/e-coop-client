import { IBaseEntityMeta, TEntityId } from '@/types/common'

export interface IComputationSheet extends IBaseEntityMeta {
    name: string
    description?: string

    deliquent_account: boolean
    fines_account: boolean
    interest_account_id: boolean
    comaker_account: number
    exist_account: boolean

    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface IComputationSheetRequest {
    id?: TEntityId

    name: string
    description?: string

    organization_id?: TEntityId
    branch_id?: TEntityId

    deliquent_account: boolean
    fines_account: boolean
    interest_account_id: boolean
    comaker_account: number
    exist_account: boolean
}
