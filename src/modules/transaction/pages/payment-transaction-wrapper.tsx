import PageContainer from '@/components/containers/page-container'

import { TransactionCurrentPaymentEntry } from '../components'
import PaymentWithTransactionForm from '../components/forms/create-payment-with-transaction-form'
import TransactionReverseRequestFormModal from '../components/modals/transaction-modal-request-reverse'
import TransactionAccountMemberLedger from '../components/tables/transaction-account-member-ledger'
import TransactionMemberScanner from '../components/transaction-member-scanner'
import { useTransactionContext } from '../context/transaction-context'

const PaymentTransactionWrapper = () => {
    const { selectedMemberId, form, ledger, modalTransactionReverseState } =
        useTransactionContext()
    const { modalData, isOpen, onClose } = modalTransactionReverseState
    return (
        <>
            <TransactionReverseRequestFormModal
                formProps={{
                    onSuccess: () => {
                        modalData?.onSuccess?.()
                    },
                }}
                onOpenChange={onClose}
                open={isOpen}
                title={modalData?.title || 'Request Reverse Transaction'}
            />
            <PageContainer className="flex h-fit lg:h-[90vh] w-full overflow-hidden!">
                <div className="flex h-full flex-col lg:flex-row w-full gap-2 overflow-hidden ">
                    <aside className="w-full ecoop-scroll lg:w-[40%] flex flex-col  overflow-y-auto">
                        <TransactionCurrentPaymentEntry />
                        {/* <ResetCurrentTransactionButton /> */}
                    </aside>

                    {/* Right: Scanner & Ledger */}
                    <main className="flex-1 flex flex-col p-2 bg-background overflow-y-auto overflow-hidden!">
                        <TransactionMemberScanner />
                        <TransactionAccountMemberLedger
                            generalLedger={ledger}
                            memberProfileId={selectedMemberId}
                            onRowClick={(data) => {
                                form.setValue('account', data.account)
                                form.setValue('account_id', data.account_id)
                            }}
                        />
                    </main>
                </div>
            </PageContainer>

            <PaymentWithTransactionForm />
        </>
    )
}

export default PaymentTransactionWrapper
