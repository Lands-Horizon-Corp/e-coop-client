import { createContext, useContext } from 'react'

import {
    TGeneralLedgerController,
    useGeneralLedgerController,
} from './use-general-ledger-controller'

interface IGeneralLedgerProps {
    children: React.ReactNode
}
export const GeneralLedgerContextProvider = ({
    children,
}: IGeneralLedgerProps) => {
    const controller = useGeneralLedgerController()
    return (
        <GeneralLedgerFeatureContext.Provider value={controller}>
            {children}
        </GeneralLedgerFeatureContext.Provider>
    )
}

const GeneralLedgerFeatureContext =
    createContext<TGeneralLedgerController | null>(null)

export const useGeneralLedgerDefinition = () => {
    const accountContext = useContext(GeneralLedgerFeatureContext)
    if (!accountContext)
        throw new Error('useAccountContext must be used within AccountProvider')
    return accountContext
}
