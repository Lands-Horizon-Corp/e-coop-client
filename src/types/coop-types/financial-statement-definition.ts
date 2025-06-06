import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IFinancialStatementAccountsGrouping } from './financial-statement-accounts-grouping'
import { IPaginatedResult } from './paginated-result'

export enum FinancialStatementTypeEnum {
    Assets = 'Assets',
    Liabilities = 'Liabilities',
    Equity = 'Equity',
    Revenue = 'Revenue',
    Expenses = 'Expenses',
}

export interface IFinancialStatementDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    financial_statement_definition_id?: TEntityId

    name: string
    description?: string
    index?: number
    exclude?: boolean

    parent_id?: TEntityId
    parent?: IFinancialStatementAccountsGrouping
    financial_statement_accounts: IFinancialStatementDefinition[]

    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: FinancialStatementTypeEnum
}

export interface IFinancialStatementDefinitionRequest {
    name: string

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: FinancialStatementTypeEnum
    exclude: boolean

    organization_id?: TEntityId
    branch_id?: TEntityId
    financial_statement_definition_id?: TEntityId
}

export interface IPaginatedFinancialStatementDefinitionResource
    extends IPaginatedResult<IFinancialStatementDefinition> {}

export interface IFinancialStatementDefinitionNode
    extends IFinancialStatementDefinition {
    children?: IFinancialStatementDefinitionNode[]
}

export type FinancialStatementTree = IFinancialStatementDefinitionNode[]

export const financialStatementDefinitionSample: IFinancialStatementDefinition[] =
    [
        {
            id: 'fsd-001',
            organization_id: 'org-123',
            branch_id: 'branch-001',
            name: 'Balance Sheet',
            created_at: '2025-06-06T08:00:00Z',
            financial_statement_accounts: [
                {
                    id: 'fsd-001-1',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Assets',
                    parent_id: 'group-001',
                    parent: {
                        id: 'group-001',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Asset Group',
                        description: 'Group for all asset-related accounts',
                        debit: 'positive',
                        credit: 'negative',
                        code: 1000,
                        created_at: '2025-06-06T08:00:00Z',
                    },
                    financial_statement_accounts: [
                        {
                            id: 'fsd-001-1-1',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Current Assets',
                            parent_id: 'group-001',
                            created_at: '2025-06-06T08:00:00Z',
                            parent: {
                                id: 'group-001',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Asset Group',
                                description:
                                    'Group for all asset-related accounts',
                                debit: 'positive',
                                credit: 'negative',
                                code: 1000,
                                created_at: '2025-06-06T08:00:00Z',
                            },
                            financial_statement_accounts: [
                                {
                                    id: 'fsd-001-1-1-1',
                                    organization_id: 'org-123',
                                    branch_id: 'branch-001',
                                    name: 'Cash and Cash Equivalents',
                                    parent_id: 'group-001',
                                    created_at: '2025-06-06T08:00:00Z',
                                    parent: {
                                        id: 'group-001',
                                        organization_id: 'org-123',
                                        branch_id: 'branch-001',
                                        name: 'Asset Group',
                                        description:
                                            'Group for all asset-related accounts',
                                        debit: 'positive',
                                        credit: 'negative',
                                        code: 1000,
                                        created_at: '2025-06-06T08:00:00Z',
                                    },
                                    financial_statement_accounts: [],
                                },
                            ],
                        },
                    ],
                    created_at: '2025-06-06T08:00:00Z',
                },
                {
                    id: 'fsd-001-2',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Liabilities',
                    parent_id: 'group-002',
                    created_at: '2025-06-06T08:05:00Z',
                    parent: {
                        id: 'group-002',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Liability Group',
                        description: 'Group for all liability-related accounts',
                        debit: 'negative',
                        credit: 'positive',
                        code: 2000,
                        created_at: '2025-06-06T08:05:00Z',
                    },
                    financial_statement_accounts: [
                        {
                            id: 'fsd-001-2-1',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Current Liabilities',
                            parent_id: 'group-002',
                            created_at: '2025-06-06T08:05:00Z',
                            parent: {
                                id: 'group-002',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Liability Group',
                                description:
                                    'Group for all liability-related accounts',
                                debit: 'negative',
                                credit: 'positive',
                                code: 2000,
                                created_at: '2025-06-06T08:05:00Z',
                            },
                            financial_statement_accounts: [
                                {
                                    id: 'fsd-001-2-1-1',
                                    organization_id: 'org-123',
                                    branch_id: 'branch-001',
                                    name: 'Accounts Payable',
                                    parent_id: 'group-002',
                                    created_at: '2025-06-06T08:05:00Z',
                                    parent: {
                                        id: 'group-002',
                                        organization_id: 'org-123',
                                        branch_id: 'branch-001',
                                        name: 'Liability Group',
                                        description:
                                            'Group for all liability-related accounts',
                                        debit: 'negative',
                                        credit: 'positive',
                                        code: 2000,
                                        created_at: '2025-06-06T08:05:00Z',
                                    },
                                    financial_statement_accounts: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'fsd-002',
            organization_id: 'org-123',
            branch_id: 'branch-001',
            name: 'Income Statement',
            created_at: '2025-06-06T08:10:00Z',
            financial_statement_accounts: [
                {
                    id: 'fsd-002-1',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Revenue',
                    parent_id: 'group-003',
                    created_at: '2025-06-06T08:10:00Z',
                    parent: {
                        id: 'group-003',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Revenue Group',
                        description: 'Group for all revenue accounts',
                        debit: 'negative',
                        credit: 'positive',
                        code: 3000,
                        created_at: '2025-06-06T08:10:00Z',
                    },
                    financial_statement_accounts: [
                        {
                            id: 'fsd-002-1-1',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Sales Revenue',
                            parent_id: 'group-003',
                            created_at: '2025-06-06T08:10:00Z',
                            parent: {
                                id: 'group-003',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Revenue Group',
                                description: 'Group for all revenue accounts',
                                debit: 'negative',
                                credit: 'positive',
                                code: 3000,
                                created_at: '2025-06-06T08:10:00Z',
                            },
                            financial_statement_accounts: [],
                        },
                    ],
                },
                {
                    id: 'fsd-002-2',
                    organization_id: 'org-123',
                    branch_id: 'branch-001',
                    name: 'Expenses',
                    parent_id: 'group-004',
                    created_at: '2025-06-06T08:15:00Z',
                    parent: {
                        id: 'group-004',
                        organization_id: 'org-123',
                        branch_id: 'branch-001',
                        name: 'Expense Group',
                        description: 'Group for all expense accounts',
                        debit: 'positive',
                        credit: 'negative',
                        code: 4000,
                        created_at: '2025-06-06T08:15:00Z',
                    },
                    financial_statement_accounts: [
                        {
                            id: 'fsd-002-2-1',
                            organization_id: 'org-123',
                            branch_id: 'branch-001',
                            name: 'Operating Expenses',
                            parent_id: 'group-004',
                            created_at: '2025-06-06T08:15:00Z',
                            parent: {
                                id: 'group-004',
                                organization_id: 'org-123',
                                branch_id: 'branch-001',
                                name: 'Expense Group',
                                description: 'Group for all expense accounts',
                                debit: 'positive',
                                credit: 'negative',
                                code: 4000,
                                created_at: '2025-06-06T08:15:00Z',
                            },
                            financial_statement_accounts: [],
                        },
                    ],
                },
            ],
        },
    ]
