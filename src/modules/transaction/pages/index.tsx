import PermissionGuard from '@/modules/permission/components/permission-guard'

import { TEntityId } from '@/types'

import { TransactionProvider } from '../context/transaction-context'
import PaymentTransactionWrapper from './payment-transaction-wrapper'

type TTransactionProps = {
    transactionId?: TEntityId
    fullPath: string
}

const Transaction = ({ transactionId, fullPath }: TTransactionProps) => {
    return (
        <PermissionGuard
            action={['Read', 'Create', 'Update']}
            resourceType="Transaction"
        >
            <TransactionProvider
                fullPath={fullPath}
                transactionId={transactionId}
            >
                <PaymentTransactionWrapper />
            </TransactionProvider>
        </PermissionGuard>
    )
}

export default Transaction
