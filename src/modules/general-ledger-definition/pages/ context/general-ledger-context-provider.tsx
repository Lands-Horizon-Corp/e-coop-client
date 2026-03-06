import { createContext, useContext } from 'react'

import {
    TGeneralLedgerController,
    useGeneralLedgerController,
} from './use-general-ledger-controller'

interface IGeneralLedgerProps {
    children: React.ReactNode
}
const GeneralLedgerFeatureContext =
    createContext<TGeneralLedgerController | null>(null)

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

export const useGeneralLedgerDefinitionContext = () => {
    const generalLedgerDefinitionContext = useContext(
        GeneralLedgerFeatureContext
    )
    if (!generalLedgerDefinitionContext)
        throw new Error(
            'useGeneralLedgerDefinitionContextContext must be used within GeneralLedgerDefinitionProvider'
        )
    return generalLedgerDefinitionContext
}
