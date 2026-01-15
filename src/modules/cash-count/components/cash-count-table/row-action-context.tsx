import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { ICashCount } from '../../cash-count.types'
import { ICashCountTableActionComponentProp } from './columns'

export type CashCountActionType = 'edit' | 'delete'

export type CashCountActionExtra = Record<string, never>

interface UseCashCountActionsProps {
    row: Row<ICashCount>
    onDeleteSuccess?: () => void
}

const useCashCountActions = ({ row }: UseCashCountActionsProps) => {
    const cashCount = row.original
    const { open } = useTableRowActionStore<
        ICashCount,
        CashCountActionType,
        CashCountActionExtra
    >()

    const handleEdit = () => {
        open('edit', {
            id: cashCount.id,
            defaultValues: cashCount,
        })
    }

    const handleDelete = () => {
        open('delete', {
            id: cashCount.id,
            defaultValues: cashCount,
        })
    }

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
                otherActions={
                    <>
                        <p className="mx-auto text-center text-muted-foreground/70 text-xs p-4">
                            no action available
                        </p>
                    </>
                }
                row={opts.row}
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

export const CashCountTableActionManager = () => {
    return null
}

export default CashCountAction
