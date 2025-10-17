import { useCallback } from 'react'

import { toast } from 'sonner'

import { toReadableDate } from '@/helpers/date-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import {
    TTransactionBatchFullorMin,
    useCurrentTransactionBatch,
} from '@/modules/transaction-batch'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'

import { LayersIcon, LayersSharpDotIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IClassProps } from '@/types'

import { TransactionBatchCreateFormModal } from './forms/transaction-batch-create-form'
import TransactionBatch from './transaction-batch'

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

    const { data, error, isSuccess, isError } = useCurrentTransactionBatch()

    const handleSuccess = useCallback(
        (data: TTransactionBatchFullorMin) => {
            setData(data)
        },
        [setData]
    )

    useQeueryHookCallback({
        isSuccess,
        data,
        isError,
        error: error,
        onSuccess: handleSuccess,
    })

    useSubscribe<TTransactionBatchFullorMin>(
        `transaction_batch.create.${transactionBatch?.id}`,
        (transactionBatch) => {
            toast.info('Your current transaction batch has been created.')
            reset()
            setData(transactionBatch)
        }
    )

    useSubscribe<TTransactionBatchFullorMin>(
        `transaction_batch.update.${transactionBatch?.id}`,
        (transactionBatch) => {
            if (transactionBatch.is_closed) {
                toast.info('Your current transaction batch has been ended.')
                return reset()
            }

            toast.info('Your current transaction batch has been updated.')
            reset()
            setData(transactionBatch)
        }
    )

    useSubscribe<TTransactionBatchFullorMin>(
        `transaction_batch.delete.${transactionBatch?.id}`,
        () => {
            reset()

            toast.info('Your current transaction batch has been deleted.')
        }
    )

    if (!transactionBatch)
        return (
            <>
                <Button
                    className="group rounded-full text-foreground/70"
                    hoverVariant="primary"
                    onClick={() => modalState.onOpenChange((prev) => !prev)}
                    variant="secondary"
                >
                    <LayersIcon className="duration-300 group-hover:text-inherit" />
                    Start Batch
                </Button>
                <TransactionBatchCreateFormModal
                    {...modalState}
                    formProps={{
                        defaultValues: {
                            name: `${user.user_name}'s-batch-${toReadableDate(new Date(), 'MM-dd-yyyy')}`.toLowerCase(),
                            branch_id: user_organization.branch_id,
                            organization_id: user_organization.organization_id,
                            provided_by_user: user,
                            provided_by_user_id: user.id,
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
                    className="group rounded-full"
                    hoverVariant="primary"
                    size="sm"
                    variant="secondary"
                >
                    <LayersSharpDotIcon className="text-primary duration-300 group-hover:text-inherit" />
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
