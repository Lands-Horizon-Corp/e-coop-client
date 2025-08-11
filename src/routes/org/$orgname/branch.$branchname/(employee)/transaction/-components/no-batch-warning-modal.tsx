import { useTransactionBatchStore } from '@/store/transaction-batch-store'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { toReadableDate } from '@/utils'

import { TransactionBatchCreateFormModal } from '@/components/forms/transaction-batch-forms/transaction-batch-create-form'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { ITransactionBatchMinimal } from '@/types'
import { IEmployee } from '@/types'

const NoBatchWarningModal = () => {
    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrgBranch<IEmployee>()

    const createBatchModalState = useModalState()
    const { data: transactionBatch, setData } = useTransactionBatchStore()

    const hasTransactionBatch = !!transactionBatch

    const handleSuccess = (newBatchData: ITransactionBatchMinimal) => {
        createBatchModalState.onOpenChange(false)
        return setData(newBatchData)
    }

    return (
        <>
            <TransactionBatchCreateFormModal
                {...createBatchModalState}
                formProps={{
                    defaultValues: {
                        name: `${user.user_name}'s-batch-${toReadableDate(new Date(), 'MM-dd-yyyy')}`.toLowerCase(),
                        branch_id: user_organization.branch_id,
                        organization_id: user_organization.organization_id,
                    },
                    onSuccess: handleSuccess,
                }}
            />
            <Modal
                className="max-w-3xl"
                title="No Transaction Batch Found"
                description="Please create a new transaction batch to proceed."
                titleClassName="text-center text-2xl font-bold"
                descriptionClassName="text-center text-sm"
                open={!hasTransactionBatch}
                hideCloseButton
                footer={
                    <>
                        <Button
                            onClick={() => {
                                createBatchModalState.onOpenChange(true)
                            }}
                        >
                            Start Batch
                        </Button>
                    </>
                }
            ></Modal>
        </>
    )
}

export default NoBatchWarningModal
