import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { ILoanLedger } from '../../loan-ledger.types'

export interface ILoanLedgerTableActionComponentProp {
    row: Row<ILoanLedger>
}

export const LoanLedgerAction = ({
    row: _row,
}: ILoanLedgerTableActionComponentProp) => {
    // No edit/delete actions for loan ledger
    return <></>
}

export interface ILoanLedgerRowContextProps
    extends ILoanLedgerTableActionComponentProp {
    children?: ReactNode
}

export const LoanLedgerRowContext = ({
    row,
    children,
}: ILoanLedgerRowContextProps) => {
    // No edit/delete actions for loan ledger
    return <DataTableRowContext row={row}>{children}</DataTableRowContext>
}

export default LoanLedgerAction
