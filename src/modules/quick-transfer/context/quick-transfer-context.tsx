import { createContext, useContext } from 'react'

import { TPaymentMode } from '../quick-transfer.types'
import {
    TUseQuickTransferReturn,
    useQuickTransferController,
} from './quick-transfer-form-controller'

interface IQuickTransferProvider {
    children: React.ReactNode
    mode: TPaymentMode
}

export const QuickTransferProvider = ({
    children,
    mode,
}: IQuickTransferProvider) => {
    const controller = useQuickTransferController({ mode })

    return (
        <QuickTransferFeature.Provider value={controller}>
            {children}
        </QuickTransferFeature.Provider>
    )
}

const QuickTransferFeature = createContext<TUseQuickTransferReturn | null>(null)

export const useQuickTransferContext = () => {
    const quickTransfer = useContext(QuickTransferFeature)
    if (!quickTransfer) {
        throw new Error(
            'useQuickTransferFeature must be used inside within QuickTransactionProvider'
        )
    }
    return quickTransfer
}
