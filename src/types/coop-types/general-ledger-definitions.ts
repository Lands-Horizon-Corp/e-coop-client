import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IGeneralLedgerAccountsGrouping } from './general-ledger-accounts-grouping'
import { IPaginatedResult } from './paginated-result'

export enum GeneralLedgerTypeEnum {
    Assets = 'Assets',
    LiabilitiesEquityAndReserves = 'Liabilities, Equity & Reserves',
    Income = 'Income',
    Expenses = 'Expenses',
}

export interface IGeneralLedgerDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    general_ledger_definition_entries_id?: TEntityId

    parent_id?: TEntityId
    parent?: IGeneralLedgerAccountsGrouping
    general_ledger_accounts: IGeneralLedgerDefinition[]

    name: string
    description?: string
    index?: number

    name_in_total?: string
    is_posting?: boolean
    general_ledger_type: GeneralLedgerTypeEnum

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number
}

export interface IGeneralLedgerDefinitionRequest {
    name: string
    general_ledger_type: GeneralLedgerTypeEnum

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number

    organization_id?: TEntityId
    branch_id?: TEntityId
    general_ledger_definition_entries_id?: TEntityId
}

export interface IPaginatedGeneralLedgerDefinition
    extends IPaginatedResult<IGeneralLedgerDefinition> {}

export const generalLedgerDefinitionSample: IGeneralLedgerDefinition[] = [
    {
        id: 'gl-001',
        organization_id: 'org-123',
        branch_id: 'branch-001',
        name: 'General Ledger for 2025 - Assets',
        description: 'Top-level ledger for asset accounts',
        general_ledger_type: GeneralLedgerTypeEnum.Assets,
        beginning_balance_of_the_year_credit: 5000,
        beginning_balance_of_the_year_debit: 10000,
        created_at: '2025-06-06T08:00:00Z',
        updated_at: '2025-06-06T08:05:00Z',
        general_ledger_accounts: [
            {
                id: 'gl-001-1',
                organization_id: 'org-123',
                branch_id: 'branch-001',
                name: 'Assets',
                general_ledger_type: GeneralLedgerTypeEnum.Assets,
                parent_id: 'group-001',
                parent: {
                    id: 'group-001',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Asset Group',
                    description: 'Group for all asset-related GL accounts',
                    debit: 'positive',
                    credit: 'negative',
                    from_code: 1000,
                    to_code: 1999,
                    created_at: '2025-06-06T08:00:00Z',
                    updated_at: '2025-06-06T08:00:00Z',
                },
                beginning_balance_of_the_year_debit: 8000,
                created_at: '2025-06-06T08:01:00Z',
                updated_at: '2025-06-06T08:01:00Z',
                general_ledger_accounts: [
                    {
                        id: 'gl-001-1-1',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Current Assets',
                        general_ledger_type: GeneralLedgerTypeEnum.Assets,
                        parent_id: 'group-001',
                        parent: {
                            id: 'group-001',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Asset Group',
                            description:
                                'Group for all asset-related GL accounts',
                            debit: 'positive',
                            credit: 'negative',
                            from_code: 1000,
                            to_code: 1999,
                            created_at: '2025-06-06T08:00:00Z',
                            updated_at: '2025-06-06T08:00:00Z',
                        },
                        beginning_balance_of_the_year_debit: 6000,
                        created_at: '2025-06-06T08:02:00Z',
                        updated_at: '2025-06-06T08:02:00Z',
                        general_ledger_accounts: [
                            {
                                id: 'gl-001-1-1-1',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Cash and Cash Equivalents',
                                general_ledger_type:
                                    GeneralLedgerTypeEnum.Assets,
                                parent_id: 'group-001',
                                parent: {
                                    id: 'group-001',
                                    organization_id: 'org-123',
                                    branch_id: 'branch-001',
                                    name: 'Asset Group',
                                    description:
                                        'Group for all asset-related GL accounts',
                                    debit: 'positive',
                                    credit: 'negative',
                                    from_code: 1000,
                                    to_code: 1999,
                                    created_at: '2025-06-06T08:00:00Z',
                                    updated_at: '2025-06-06T08:00:00Z',
                                },
                                beginning_balance_of_the_year_debit: 2500,
                                created_at: '2025-06-06T08:03:00Z',
                                updated_at: '2025-06-06T08:03:00Z',
                                general_ledger_accounts: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'gl-002',
        organization_id: 'org-123',
        branch_id: 'branch-001',
        name: 'General Ledger for 2025 - Liabilities',
        description: 'Top-level ledger for liability accounts',
        general_ledger_type: GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves,
        beginning_balance_of_the_year_credit: 20000,
        beginning_balance_of_the_year_debit: 0,
        created_at: '2025-06-06T08:10:00Z',
        updated_at: '2025-06-06T08:15:00Z',
        general_ledger_accounts: [
            {
                id: 'gl-002-1',
                organization_id: 'org-123',
                branch_id: 'branch-001',
                name: 'Liabilities',
                general_ledger_type:
                    GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves,
                parent_id: 'group-002',
                parent: {
                    id: 'group-002',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Liability Group',
                    description: 'Group for all liability-related GL accounts',
                    debit: 'negative',
                    credit: 'positive',
                    from_code: 2000,
                    to_code: 2999,
                    created_at: '2025-06-06T08:10:00Z',
                    updated_at: '2025-06-06T08:10:00Z',
                },
                beginning_balance_of_the_year_credit: 15000,
                created_at: '2025-06-06T08:11:00Z',
                updated_at: '2025-06-06T08:11:00Z',
                general_ledger_accounts: [
                    {
                        id: 'gl-002-1-1',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Current Liabilities',
                        general_ledger_type:
                            GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves,
                        parent_id: 'group-002',
                        parent: {
                            id: 'group-002',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Liability Group',
                            description:
                                'Group for all liability-related GL accounts',
                            debit: 'negative',
                            credit: 'positive',
                            from_code: 2000,
                            to_code: 2999,
                            created_at: '2025-06-06T08:10:00Z',
                            updated_at: '2025-06-06T08:10:00Z',
                        },
                        beginning_balance_of_the_year_credit: 12000,
                        created_at: '2025-06-06T08:12:00Z',
                        updated_at: '2025-06-06T08:12:00Z',
                        general_ledger_accounts: [
                            {
                                id: 'gl-002-1-1-1',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Accounts Payable',
                                general_ledger_type:
                                    GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves,
                                parent_id: 'group-002',
                                parent: {
                                    id: 'group-002',
                                    organization_id: 'org-123',
                                    branch_id: 'branch-001',
                                    name: 'Liability Group',
                                    description:
                                        'Group for all liability-related GL accounts',
                                    debit: 'negative',
                                    credit: 'positive',
                                    from_code: 2000,
                                    to_code: 2999,
                                    created_at: '2025-06-06T08:10:00Z',
                                    updated_at: '2025-06-06T08:10:00Z',
                                },
                                beginning_balance_of_the_year_credit: 7000,
                                created_at: '2025-06-06T08:13:00Z',
                                updated_at: '2025-06-06T08:13:00Z',
                                general_ledger_accounts: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]
