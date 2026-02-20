import { useCallback, useEffect, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import {
    TTransactionBatchFullorMin,
    useCurrentTransactionBatch,
} from '@/modules/transaction-batch'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'
import { useInfoModalStore } from '@/store/info-modal-store'
import { useHotkeys } from 'react-hotkeys-hook'

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
import TransactionBatchDayMismatchDisplay from './transaction-batch-date-mismatch-display'

interface Props extends IClassProps {}

const TransactionBatchNavButton = (_props: Props) => {
    const modalState = useModalState()
    const manageBatchModalState = useModalState(false)

    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrgBranch<IEmployee>()

    const {
        data: transactionBatch,
        setData,
        reset,
    } = useTransactionBatchStore()
    const { hasNoTransactionBatch } = useTransactionBatchStore()
    const { data, error, isSuccess, isError } = useCurrentTransactionBatch()
    const { onOpen } = useInfoModalStore()

    const handleSuccess = useCallback(
        (data: TTransactionBatchFullorMin) => {
            setData(data)
        },
        [setData]
    )

    const {
        branch: {
            branch_setting: { currency },
        },
    } = user_organization

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

    useHotkeys(
        'ctrl + m',
        (e) => {
            e.preventDefault()
            manageBatchModalState.onOpenChange(!manageBatchModalState.open)
            if (!hasNoTransactionBatch) modalState.onOpenChange(true)
        },
        [manageBatchModalState.open, hasNoTransactionBatch]
    )

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (!transactionBatch || mounted) return

        onOpen({
            hideSeparator: true,
            classNames: {
                footerActionClassName: 'justify-center',
                closeButtonClassName: 'w-full',
            },
            component: (
                <TransactionBatchDayMismatchDisplay
                    batchId={transactionBatch.id}
                    transactionBatchDate={transactionBatch.created_at}
                />
            ),
        })

        setMounted(true)
    }, [onOpen, transactionBatch, mounted])

    if (!transactionBatch)
        return (
            <>
                <Button
                    className="group rounded-lg border"
                    disabled={
                        !hasPermissionFromAuth({
                            action: 'Create',
                            resourceType: 'TransactionBatch',
                        })
                    }
                    hoverVariant="primary"
                    onClick={() => modalState.onOpenChange((prev) => !prev)}
                    shadow="none"
                    size="xs"
                    variant="outline-ghost"
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
                            provided_by_user: user_organization,
                            provided_by_user_id: user.id,
                            currency,
                            currency_id: currency.id,
                        },
                        onSuccess: setData,
                    }}
                />
            </>
        )

    return (
        <Popover
            modal
            onOpenChange={manageBatchModalState.onOpenChange}
            open={manageBatchModalState.open}
        >
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        'group rounded-lg border relative',
                        !transactionBatch.is_today &&
                            'animate-pulse border border-destructive'
                    )}
                    disabled={
                        !hasPermissionFromAuth({
                            action: ['Create'],
                            resourceType: 'TransactionBatch',
                        }) &&
                        !hasPermissionFromAuth({
                            action: ['Update', 'OwnUpdate'],
                            resourceType: 'TransactionBatch',
                            resource: transactionBatch,
                        })
                    }
                    hoverVariant={
                        transactionBatch.is_today ? 'default' : 'destructive'
                    }
                    shadow="none"
                    size="xs"
                    variant={
                        transactionBatch.is_today ? 'default' : 'destructive'
                    }
                >
                    <LayersSharpDotIcon className="duration-300 group-hover:text-inherit" />
                    {transactionBatch.is_today
                        ? 'Manage Batch'
                        : 'Batch Overdue'}
                    <div className="size-2 absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 bg-destructive animate-ping rounded-full ml-auto" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="h-fit w-fit border-none bg-transparent p-0 shadow-none"
                onEscapeKeyDown={(e) => {
                    e.stopPropagation()
                }}
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
