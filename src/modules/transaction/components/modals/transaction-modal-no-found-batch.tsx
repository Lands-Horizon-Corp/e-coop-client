import { Link } from '@tanstack/react-router'

import { toReadableDate } from '@/helpers/date-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { ITransactionBatchMinimal } from '@/modules/transaction-batch'
import { TransactionBatchCreateFormModal } from '@/modules/transaction-batch/components/forms/transaction-batch-create-form'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

const TransactionNoFoundBatch = () => {
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
                title="No Transaction Batch Found"
                description="Please create a new transaction batch to proceed."
                titleClassName="text-center text-2xl font-bold"
                descriptionClassName="text-center text-sm"
                open={!hasTransactionBatch}
                // hideCloseButton
                footer={
                    <>
                        <Button
                            onClick={() => {
                                createBatchModalState.onOpenChange(true)
                            }}
                        >
                            Start Batch
                        </Button>
                        <Link
                            to={
                                '/org/$orgname/branch/$branchname/dashboard' as string
                            }
                            className="w-full"
                        >
                            <Button className="w-full" variant={'secondary'}>
                                Return to Dashboard
                            </Button>
                        </Link>
                    </>
                }
            ></Modal>
        </>
    )
}

export default TransactionNoFoundBatch
