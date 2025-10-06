import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { HashIcon, PrinterFillIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { ILoanLedger } from '../../loan-ledger.types'
import { LoanLedgerChangeLineFormModal } from '../forms/loan-ledger-change-line-form'
import { LoanLedgerPrintFormModal } from '../forms/loan-ledger-print-form'

interface UseLoanLedgerActionsProps {
    row: Row<ILoanLedger>
}

const useLoanLedgerActions = ({ row }: UseLoanLedgerActionsProps) => {
    const editLineModal = useModalState()
    const printModal = useModalState()
    const ledger = row.original

    return {
        ledger,
        editLineModal,
        printModal,
    }
}

export interface ILoanLedgerTableActionComponentProp {
    row: Row<ILoanLedger>
    children?: ReactNode
}

export const LoanLedgerAction = ({
    row,
}: ILoanLedgerTableActionComponentProp) => {
    const { ledger, editLineModal, printModal } = useLoanLedgerActions({
        row,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanLedgerChangeLineFormModal
                    {...editLineModal}
                    formProps={{
                        loanLedgerId: ledger.id,
                        defaultValues: { line_number: ledger.line_number },
                        onSuccess: () => editLineModal.onOpenChange(false),
                    }}
                />
                <LoanLedgerPrintFormModal
                    {...printModal}
                    formProps={{
                        loanLedgerId: row.original?.id,
                        defaultValues: { line_number: ledger.line_number },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => editLineModal.onOpenChange(true)}
                        >
                            <HashIcon className="mr-1" /> Change Line#
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => printModal.onOpenChange(true)}
                        >
                            <PrinterFillIcon className="mr-1" /> Print Ledger
                        </DropdownMenuItem>
                    </>
                }
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
    const { ledger, editLineModal, printModal } = useLoanLedgerActions({
        row,
    })

    return (
        <>
            <LoanLedgerChangeLineFormModal
                {...editLineModal}
                formProps={{
                    loanLedgerId: ledger.id,
                    defaultValues: { line_number: ledger.line_number },
                    onSuccess: () => editLineModal.onOpenChange(false),
                }}
            />
            <LoanLedgerPrintFormModal
                {...printModal}
                formProps={{
                    loanLedgerId: row.original?.id,
                    defaultValues: { line_number: ledger.line_number },
                }}
            />
            <DataTableRowContext
                row={row}
                otherActions={
                    <>
                        <ContextMenuItem
                            onSelect={() => editLineModal.onOpenChange(true)}
                        >
                            <HashIcon className="mr-2" strokeWidth={1.5} />
                            Change Line
                        </ContextMenuItem>
                        <ContextMenuItem
                            onSelect={() => printModal.onOpenChange(true)}
                        >
                            <PrinterFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Print Ledger
                        </ContextMenuItem>
                    </>
                }
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default LoanLedgerAction
