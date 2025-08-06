import { ReactNode } from 'react'

import { GENERAL_LEDGER_SOURCES } from '@/constants'
import { formatNumber } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import { LedgerSourceBadge } from '@/components/badges/ledger-source-badge'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DataTableMultiSelectFilter from '@/components/data-table/data-table-filters/multi-select-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import CopyWrapper from '@/components/elements/copy-wrapper'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { PushPinSlashIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { IGeneralLedger, TGeneralLedgerSource } from '@/types'

import { createUpdateColumns } from '../../common-columns'

export const generalLedgerGlobalSearchTargets: IGlobalSearchTargets<IGeneralLedger>[] =
    [
        { field: 'reference_number', displayText: 'Reference Number' },
        {
            field: 'transaction_reference_number',
            displayText: 'Transaction Reference',
        },
        { field: 'source', displayText: 'Source' },
        { field: 'account.name', displayText: 'Account Name' },
        { field: 'account.code', displayText: 'Account Code' },
        { field: 'member_profile.full_name', displayText: 'Member Name' },
        { field: 'employee_user.full_name', displayText: 'Employee Name' },
    ]

export interface IGeneralLedgerTableActionComponentProp {
    row: Row<IGeneralLedger>
}

export interface IGeneralLedgerTableColumnProps {
    actionComponent?: (
        props: IGeneralLedgerTableActionComponentProp
    ) => ReactNode
}

const GeneralLedgerTableColumns = (
    opts?: IGeneralLedgerTableColumnProps
): ColumnDef<IGeneralLedger>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <HeaderToggleSelect table={table} />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            onClick={() => column.pin('left')}
                            className="mr-2 size-3.5 cursor-pointer"
                        />
                    )}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex w-fit items-center gap-x-1 px-0">
                    {opts?.actionComponent?.({ row })}
                    <Checkbox
                        aria-label="Select row"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: 80,
            minSize: 80,
        },
        {
            id: 'reference_number',
            accessorKey: 'reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Reference Number">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Reference Number"
                            field="reference_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { reference_number },
                },
            }) => (
                <CopyWrapper>
                    <span className="font-mono text-sm font-medium">
                        {reference_number || '-'}
                    </span>
                </CopyWrapper>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 160,
        },
        {
            id: 'transaction_reference_number',
            accessorKey: 'transaction_reference_number',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Transaction Ref">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Transaction Reference"
                            field="transaction_reference_number"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { transaction_reference_number },
                },
            }) => (
                <CopyWrapper>
                    <span className="font-mono text-sm">
                        {transaction_reference_number || '-'}
                    </span>
                </CopyWrapper>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 250,
            minSize: 250,
        },
        {
            id: 'account',
            accessorKey: 'account',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Account">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Account Name"
                            field="account.name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { account },
                },
            }) => (
                <div className="space-y-1">
                    <p className="font-medium">{account?.name || '-'}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                        {account?.alternative_code || '-'}
                    </p>
                </div>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 140,
        },
        {
            id: 'credit',
            accessorKey: 'credit',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Credit">
                    <ColumnActions {...props}>
                        <NumberFilter<IGeneralLedger>
                            displayText="Credit"
                            field="credit"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { credit },
                },
            }) => (
                <p className="text-right font-medium">
                    {credit ? formatNumber(credit, 2) : ''}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 120,
            minSize: 100,
        },
        {
            id: 'debit',
            accessorKey: 'debit',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Debit">
                    <ColumnActions {...props}>
                        <NumberFilter<IGeneralLedger>
                            displayText="Debit"
                            field="debit"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { debit },
                },
            }) => (
                <p className="text-right font-medium">
                    {debit ? formatNumber(debit, 2) : ''}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 120,
            minSize: 100,
        },
        {
            id: 'balance',
            accessorKey: 'balance',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Balance">
                    <ColumnActions {...props}>
                        <NumberFilter<IGeneralLedger>
                            displayText="Balance"
                            field="balance"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { balance },
                },
            }) => (
                <p className="text-right font-semibold">
                    {balance ? formatNumber(balance, 2) : ''}
                </p>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 120,
            minSize: 100,
        },
        {
            id: 'type',
            accessorKey: 'type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Type">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Type"
                            field="type"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { type },
                },
            }) => (
                <Badge variant="secondary" className="text-xs">
                    {type || '-'}
                </Badge>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 120,
            minSize: 100,
        },
        {
            id: 'member_profile',
            accessorKey: 'member_profile.full_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Member">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Member Name"
                            field="member_profile.full_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { member_profile },
                },
            }) => (
                <span>
                    {member_profile ? (
                        <ImageNameDisplay
                            name={member_profile.full_name}
                            src={member_profile.media?.download_url}
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 160,
            minSize: 120,
        },
        {
            id: 'employee_user',
            accessorKey: 'employee_user',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Employee/Teller">
                    <ColumnActions {...props}>
                        <TextFilter<IGeneralLedger>
                            displayText="Employee/Teller"
                            field="employee_user.full_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { employee_user },
                },
            }) => (
                <span className="relative">
                    {employee_user !== undefined ? (
                        <ImageNameDisplay
                            name={employee_user?.full_name}
                            src={employee_user?.media?.download_url}
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 160,
            minSize: 120,
        },
        {
            id: 'source',
            accessorKey: 'source',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Source">
                    <ColumnActions {...props}>
                        <DataTableMultiSelectFilter<
                            IGeneralLedger,
                            TGeneralLedgerSource
                        >
                            displayText="Source"
                            field="source"
                            dataType="text"
                            mode="contains"
                            multiSelectOptions={GENERAL_LEDGER_SOURCES.map(
                                (source) => ({
                                    label:
                                        source.charAt(0).toUpperCase() +
                                        source.slice(1),
                                    value: source,
                                })
                            )}
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { source },
                },
            }) => (
                <span>
                    {source ? (
                        <LedgerSourceBadge
                            size={'sm'}
                            variant={source}
                            source={source}
                        />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: true,
            size: 160,
            minSize: 120,
        },
        ...createUpdateColumns<IGeneralLedger>(),
    ]
}

export default GeneralLedgerTableColumns
