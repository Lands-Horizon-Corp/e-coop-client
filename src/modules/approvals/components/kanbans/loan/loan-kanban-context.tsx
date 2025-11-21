import { ReactNode, createContext, useContext, useState } from 'react'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

interface ILoanKanbanContext {
    // Print Modal State
    showPrintModal: ReturnType<typeof useModalState>

    // Loan Transaction URL
    loanTransactionUrl: string | null
    setLoanTransactionUrl: (url: string | null) => void

    // Loan Transaction ID (for building the URL)
    selectedLoanId: TEntityId | null
    setSelectedLoanId: (id: TEntityId | null) => void

    // Helper to open print modal with loan data
    openPrintModalForLoan: (loanId: TEntityId) => void
}

const LoanKanbanContext = createContext<ILoanKanbanContext | undefined>(
    undefined
)

export const useLoanKanbanContext = () => {
    const context = useContext(LoanKanbanContext)
    if (!context) {
        throw new Error(
            'useLoanKanbanContext must be used within LoanKanbanProvider'
        )
    }
    return context
}

interface ILoanKanbanProviderProps {
    children: ReactNode
}

export const LoanKanbanProvider = ({ children }: ILoanKanbanProviderProps) => {
    const showPrintModal = useModalState()
    const [loanTransactionUrl, setLoanTransactionUrl] = useState<string | null>(
        null
    )
    const [selectedLoanId, setSelectedLoanId] = useState<TEntityId | null>(null)

    const openPrintModalForLoan = (loanId: TEntityId) => {
        setSelectedLoanId(loanId)
        setLoanTransactionUrl(`/api/v1/loan-transaction/${loanId}`)
        showPrintModal.onOpenChange(true)
    }

    return (
        <LoanKanbanContext.Provider
            value={{
                showPrintModal,
                loanTransactionUrl,
                setLoanTransactionUrl,
                selectedLoanId,
                setSelectedLoanId,
                openPrintModalForLoan,
            }}
        >
            {children}
        </LoanKanbanContext.Provider>
    )
}
