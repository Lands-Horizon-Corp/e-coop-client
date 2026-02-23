import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PaymentWithTransactionForm from './create-payment-with-transaction-form'

const PaymentWrapper = () => {
    const { hasNoTransactionBatch } = useTransactionBatchStore()
    return <PaymentWithTransactionForm readOnly={!hasNoTransactionBatch} />
}

export default PaymentWrapper
