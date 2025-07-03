import { ReactNode } from 'react'

import { formatNumber } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import ImageNameDisplay from '@/components/elements/image-name-display'
import ImageDisplay from '@/components/image-display'
import { createUpdateColumns } from '@/components/tables/common-columns'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IBatchFunding } from '@/types'

export const batchFundingGlobalSearchTargets: IGlobalSearchTargets<IBatchFunding>[] =
    [
        { field: 'name', displayText: 'Name' },
        { field: 'provided_by_user.username', displayText: 'Provided By' },
    ]

export interface IBatchFundingTableActionComponentProp {
    row: Row<IBatchFunding>
}

export interface IBatchFundingTableColumnProps {
    actionComponent?: (
        props: IBatchFundingTableActionComponentProp
    ) => ReactNode
}

const BatchFundingTableColumns = (
    _opts?: IBatchFundingTableColumnProps
): ColumnDef<IBatchFunding>[] => [
    {
        id: 'name',
        accessorKey: 'name',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Name">
                <ColumnActions {...props}>
                    <TextFilter<IBatchFunding>
                        displayText="Name"
                        field="name"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => <span>{row.original.name}</span>,
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 180,
        minSize: 120,
    },
    {
        id: 'amount',
        accessorKey: 'amount',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Amount">
                <ColumnActions {...props}>
                    <NumberFilter<IBatchFunding>
                        displayText="Amount"
                        field="amount"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({ row }) => (
            <p className="text-right">{formatNumber(row.original.amount, 2)}</p>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 120,
        minSize: 100,
    },
    {
        id: 'provided_by_user',
        accessorKey: 'provided_by_user.username',
        header: (props) => (
            <DataTableColumnHeader {...props} title="Provided By">
                <ColumnActions {...props}>
                    <TextFilter<IBatchFunding>
                        displayText="Provided By"
                        field="provided_by_user.username"
                    />
                </ColumnActions>
            </DataTableColumnHeader>
        ),
        cell: ({
            row: {
                original: { provided_by_user, signature_media },
            },
        }) => (
            <span className="inline-flex gap-x-2">
                {signature_media && (
                    <>
                        <PreviewMediaWrapper media={signature_media}>
                            <ImageDisplay
                                className="size-8 rounded-lg"
                                src={signature_media?.download_url}
                            />
                        </PreviewMediaWrapper>
                    </>
                )}
                {provided_by_user ? (
                    <PreviewMediaWrapper media={provided_by_user.media}>
                        <ImageNameDisplay
                            imageClassName="size-8 rounded-lg"
                            name={provided_by_user.full_name}
                            src={provided_by_user.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                ) : (
                    '-'
                )}
            </span>
        ),
        enableMultiSort: true,
        enableSorting: true,
        enableResizing: true,
        enableHiding: false,
        size: 140,
        minSize: 100,
    },

    ...createUpdateColumns<IBatchFunding>(),
]

export default BatchFundingTableColumns
