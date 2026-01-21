import { ReactNode } from 'react'

import { IGeneralLedger } from '@/modules/general-ledger/general-ledger.types'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { EyeIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { GeneralLedgerViewSheet } from '../../ledger-detail'
import { IGeneralLedgerTableActionComponentProp } from './columns'

// ===== TYPE DEFINITIONS =====
export type GeneralLedgerActionType = 'view-details'

export interface GeneralLedgerActionExtra {
    onDeleteSuccess?: () => void
}

interface UseGeneralLedgerActionsProps {
    row: Row<IGeneralLedger>
    onDeleteSuccess?: () => void
}

const useGeneralLedgerActions = ({
    row,
    onDeleteSuccess,
}: UseGeneralLedgerActionsProps) => {
    const ledgerEntry = row.original
    const { open } = useTableRowActionStore<
        IGeneralLedger,
        GeneralLedgerActionType,
        GeneralLedgerActionExtra
    >()

    const handleViewDetails = () => {
        open('view-details', {
            id: ledgerEntry.id,
            defaultValues: ledgerEntry,
            extra: { onDeleteSuccess },
        })
    }

    return {
        ledgerEntry,
        handleViewDetails,
    }
}

interface IGeneralLedgerTableActionProps extends IGeneralLedgerTableActionComponentProp {
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
        <RowActionsGroup
            canSelect
            otherActions={
                <>
                    <DropdownMenuItem onClick={handleViewDetails}>
                        <EyeIcon className="mr-2" strokeWidth={1.5} />
                        View Details
                    </DropdownMenuItem>
                </>
            }
            row={row}
        />
    )
}

interface IGeneralLedgerRowContextProps extends IGeneralLedgerTableActionComponentProp {
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
        <DataTableRowContext
            otherActions={
                <>
                    <ContextMenuItem onClick={handleViewDetails}>
                        <EyeIcon className="mr-2" strokeWidth={1.5} />
                        View Details
                    </ContextMenuItem>
                </>
            }
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const GeneralLedgerTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IGeneralLedger,
        GeneralLedgerActionType,
        GeneralLedgerActionExtra
    >()

    const ledgerEntry = state.defaultValues

    return (
        <>
            {state.action === 'view-details' && ledgerEntry && (
                <GeneralLedgerViewSheet
                    defaultLedgerValue={ledgerEntry}
                    ledgerId={ledgerEntry.id}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

// Default export for backward compatibility
export default GeneralLedgerAction
