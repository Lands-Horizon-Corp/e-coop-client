import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { IDisbursementTransaction } from '../../disbursement-transaction.types'
import { IDisbursementTransactionTableActionComponentProp } from './columns'

interface UseDisbursementTransactionActionsProps {
    row: Row<IDisbursementTransaction>
    onDeleteSuccess?: () => void
}

const useDisbursementTransactionActions = ({
    row,
}: UseDisbursementTransactionActionsProps) => {
    const disbursementTransaction = row.original

    const handleEdit = () => {}

    const handleDelete = () => {}

    return {
        disbursementTransaction,
        handleEdit,
        handleDelete,
    }
}

interface IDisbursementTransactionTableActionProps
    extends IDisbursementTransactionTableActionComponentProp {
    onDisbursementTransactionUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const DisbursementTransactionAction = ({
    row,
    onDeleteSuccess,
}: IDisbursementTransactionTableActionProps) => {
    useDisbursementTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                otherActions={
                    <>
                        <p className="mx-auto text-center text-muted-foreground/70 text-xs p-4">
                            no action available
                        </p>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IDisbursementTransactionRowContextProps
    extends IDisbursementTransactionTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const DisbursementTransactionRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IDisbursementTransactionRowContextProps) => {
    useDisbursementTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext row={row}>{children}</DataTableRowContext>
        </>
    )
}

export default DisbursementTransactionAction
