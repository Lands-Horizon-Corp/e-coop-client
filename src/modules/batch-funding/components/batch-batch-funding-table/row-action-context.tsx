import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { IBatchFunding } from '../../batch-funding.types'
import { IBatchFundingTableActionComponentProp } from './columns'

interface UseBatchFundingActionsProps {
    row: Row<IBatchFunding>
    onDeleteSuccess?: () => void
}

const useBatchFundingActions = ({ row }: UseBatchFundingActionsProps) => {
    const batchFunding = row.original

    // No edit/delete for batch funding currently, but actions can be added here if needed

    return {
        batchFunding,
    }
}

interface IBatchFundingTableActionProps
    extends IBatchFundingTableActionComponentProp {
    onBatchFundingUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const BatchFundingAction = ({
    row,
    onDeleteSuccess,
}: IBatchFundingTableActionProps) => {
    useBatchFundingActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                row={row}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

interface IBatchFundingRowContextProps
    extends IBatchFundingTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const BatchFundingRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IBatchFundingRowContextProps) => {
    useBatchFundingActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                row={row}
                otherActions={<>{/* Additional actions can be added here */}</>}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default BatchFundingAction
