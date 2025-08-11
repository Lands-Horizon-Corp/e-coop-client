import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { ICashCount } from '@/types'

import { ICashCountTableActionComponentProp } from './columns'

interface UseCashCountActionsProps {
    row: Row<ICashCount>
    onDeleteSuccess?: () => void
}

const useCashCountActions = ({ row }: UseCashCountActionsProps) => {
    const cashCount = row.original

    const handleEdit = () => {}

    const handleDelete = () => {}

    return {
        cashCount,
        handleEdit,
        handleDelete,
    }
}

interface ICashCountTableActionProps
    extends ICashCountTableActionComponentProp {
    onCashCountUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const CashCountAction = (opts: ICashCountTableActionProps) => {
    useCashCountActions(opts)
    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                row={opts.row}
                otherActions={
                    <>
                        <p className="mx-auto text-center text-muted-foreground/70 text-xs p-4">
                            no action available
                        </p>
                    </>
                }
            />
        </>
    )
}

interface ICashCountRowContextProps extends ICashCountTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CashCountRowContext = ({
    row,
    children,
}: ICashCountRowContextProps) => {
    return (
        <>
            <DataTableRowContext row={row}>{children}</DataTableRowContext>
        </>
    )
}

export default CashCountAction
