import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IGeneralLedgerDefinition } from '../general-ledger-definition/general-ledger-definition.types'

export type TAccountingPrincipleType = 'positive' | 'negative'

export interface IGeneralLedgerAccountGrouping extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    debit: number
    credit: number
    name: string
    description: string
    general_ledger_definition: IGeneralLedgerDefinition[]

    from_code?: number
    to_code?: number
}

export interface IGeneralLedgerAccountGroupingRequest {
    name: string
    description?: string

    debit?: number
    credit?: number

    from_code?: number
    to_code?: number
}

export interface IPaginatedGeneralLedgerAccountGroupingRequest
    extends IPaginatedResult<IGeneralLedgerAccountGrouping> {}
