import { createContext, useContext } from 'react'

import {
    TAccountControllerReturn,
    useAccountController,
} from '../hooks/use-account-controller'

interface IAccountProviderProps {
    children: React.ReactNode
}
export const AccountProvider = ({ children }: IAccountProviderProps) => {
    const controller = useAccountController()
    return (
        <AccountFeatureContext.Provider value={controller}>
            {children}
        </AccountFeatureContext.Provider>
    )
}
const AccountFeatureContext = createContext<TAccountControllerReturn | null>(
    null
)

export const useAccountContext = () => {
    const accountContext = useContext(AccountFeatureContext)
    if (!accountContext)
        throw new Error('useAccountContext must be used within AccountProvider')
    return accountContext
}
