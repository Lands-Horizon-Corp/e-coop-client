import { ReactNode } from 'react'

import { IGeneralLedger } from '@/modules/general-ledger/general-ledger.types'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { EyeIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IGeneralLedgerTableActionComponentProp } from './columns'

interface UseGeneralLedgerActionsProps {
    row: Row<IGeneralLedger>
    onDeleteSuccess?: () => void
}

const useGeneralLedgerActions = ({ row }: UseGeneralLedgerActionsProps) => {
    const ledgerEntry = row.original
    const detailsModal = useModalState()

    const handleViewDetails = () => detailsModal.onOpenChange(true)

    return {
        ledgerEntry,
        detailsModal,
        handleViewDetails,
    }
}

interface IGeneralLedgerTableActionProps
    extends IGeneralLedgerTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const GeneralLedgerAction = ({
    row,
    onDeleteSuccess,
}: IGeneralLedgerTableActionProps) => {
    const { handleViewDetails } = useGeneralLedgerActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                row={row}
                otherActions={
                    <>
                        <DropdownMenuItem onClick={handleViewDetails}>
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Details
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

interface IGeneralLedgerRowContextProps
    extends IGeneralLedgerTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const GeneralLedgerRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IGeneralLedgerRowContextProps) => {
    const { handleViewDetails } = useGeneralLedgerActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <DataTableRowContext
                row={row}
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleViewDetails}>
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Details
                        </ContextMenuItem>
                    </>
                }
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default GeneralLedgerAction
