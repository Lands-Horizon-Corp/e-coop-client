import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { HashIcon, PrinterFillIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { ILoanLedger } from '../../loan-ledger.types'
import { LoanLedgerChangeLineFormModal } from '../forms/loan-ledger-change-line-form'
import { LoanLedgerPrintFormModal } from '../forms/loan-ledger-print-form'

export type LoanLedgerActionType = 'change-line' | 'print'

export type LoanLedgerActionExtra = Record<string, never>

interface UseLoanLedgerActionsProps {
    row: Row<ILoanLedger>
}

const useLoanLedgerActions = ({ row }: UseLoanLedgerActionsProps) => {
    const ledger = row.original
    const { open } = useTableRowActionStore<
        ILoanLedger,
        LoanLedgerActionType,
        LoanLedgerActionExtra
    >()

    const handleChangeLine = () => {
        open('change-line', {
            id: ledger.id,
            defaultValues: ledger,
        })
    }

    const handlePrint = () => {
        open('print', {
            id: ledger.id,
            defaultValues: ledger,
        })
    }

    return {
        ledger,
        handleChangeLine,
        handlePrint,
    }
}

export interface ILoanLedgerTableActionComponentProp {
    row: Row<ILoanLedger>
    children?: ReactNode
}

export const LoanLedgerAction = ({
    row,
}: ILoanLedgerTableActionComponentProp) => {
    const { handleChangeLine, handlePrint } = useLoanLedgerActions({ row })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                otherActions={
                    <>
                        <DropdownMenuItem onClick={handleChangeLine}>
                            <HashIcon className="mr-1" /> Change Line#
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePrint}>
                            <PrinterFillIcon className="mr-1" /> Print Ledger
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

export interface ILoanLedgerRowContextProps
    extends ILoanLedgerTableActionComponentProp {}

export const LoanLedgerRowContext = ({
    row,
    children,
}: ILoanLedgerRowContextProps) => {
    const { handleChangeLine, handlePrint } = useLoanLedgerActions({ row })

    return (
        <>
            <DataTableRowContext
                otherActions={
                    <>
                        <ContextMenuItem onSelect={handleChangeLine}>
                            <HashIcon className="mr-2" strokeWidth={1.5} />
                            Change Line
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={handlePrint}>
                            <PrinterFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Print Ledger
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const LoanLedgerTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ILoanLedger,
        LoanLedgerActionType,
        LoanLedgerActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const ledger = state.defaultValues

    return (
        <>
            {state.action === 'change-line' && (
                <LoanLedgerChangeLineFormModal
                    formProps={{
                        loanLedgerId: ledger.id,
                        defaultValues: { line_number: ledger.line_number },
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'print' && (
                <LoanLedgerPrintFormModal
                    formProps={{
                        loanLedgerId: ledger.id,
                        defaultValues: { line_number: ledger.line_number },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default LoanLedgerAction
