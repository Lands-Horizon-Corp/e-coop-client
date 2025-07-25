import { useTransactionBatchStore } from '@/store/transaction-batch-store'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
// import { useAuthUser } from '@/store/user-auth-store'

import { toReadableDate } from '@/utils'

import { TransactionBatchCreateFormModal } from '@/components/forms/transaction-batch-forms/transaction-batch-create-form'

import { useCurrentTransactionBatch } from '@/hooks/api-hooks/use-transaction-batch'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, IEmployee, TTransactionBatchFullorMin } from '@/types'

import { LayersSharpDotIcon } from '../../icons'
import TransactionBatch from '../../transaction-batch'
import { Button } from '../../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

interface Props extends IClassProps {}

const TransactionBatchNavButton = (_props: Props) => {
    const modalState = useModalState()
    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrgBranch<IEmployee>()

    const {
        data: transactionBatch,
        setData,
        reset,
    } = useTransactionBatchStore()

    useCurrentTransactionBatch({
        onSuccess(data) {
            setData(data)
        },
        showMessage: false,
    })

    useSubscribe<TTransactionBatchFullorMin>(
        `transaction_batch.update.${transactionBatch?.id}`,
        (transactionBatch) => {
            reset()
            setData(transactionBatch)
        }
    )

    if (!transactionBatch)
        return (
            <>
                <Button
                    variant="secondary"
                    hoverVariant="primary"
                    className="group rounded-full text-foreground/70"
                    onClick={() => modalState.onOpenChange((prev) => !prev)}
                >
                    <LayersSharpDotIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
                    Start Batch
                </Button>
                <TransactionBatchCreateFormModal
                    {...modalState}
                    formProps={{
                        defaultValues: {
                            name: `${user.user_name}'s-batch-${toReadableDate(new Date(), 'MM-dd-yyyy')}`.toLowerCase(),
                            branch_id: user_organization.branch_id,
                            organization_id: user_organization.organization_id,
                        },
                        onSuccess: setData,
                    }}
                />
            </>
        )

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="secondary"
                    hoverVariant="primary"
                    className="group rounded-full text-foreground/70"
                >
                    <LayersSharpDotIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
                    Manage Batch
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="h-fit w-fit border-none bg-transparent p-0 shadow-none"
            >
                <TransactionBatch
                    onBatchEnded={() => setData(null)}
                    transactionBatch={
                        transactionBatch as TTransactionBatchFullorMin
                    }
                />
            </PopoverContent>
        </Popover>
    )
}

export default TransactionBatchNavButton
