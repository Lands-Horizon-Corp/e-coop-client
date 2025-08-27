import {
    IAuditable,
    IPaginatedResult,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IGeneralLedgerDefinition } from '../general-ledger-definition/general-ledger-definition.types'

export type AccountingPrincipleType = 'positive' | 'negative'

export interface IGeneralLedgerAccountGrouping extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType
    name: string
    description: string
    general_ledger_definition: IGeneralLedgerDefinition[]

    from_code?: number
    to_code?: number
}

export interface IGeneralLedgerAccountGroupingRequest {
    name: string
    description?: string

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType

    from_code?: number
    to_code?: number
}

export interface IPaginatedGeneralLedgerAccountsGroupingRequest
    extends IPaginatedResult<IGeneralLedgerAccountGrouping> {}
