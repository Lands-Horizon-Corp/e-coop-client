import { useCallback, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import {
    TTransactionBatchFullorMin,
    transactionBatchQueryKey,
    useCurrentTransactionBatch,
    useUnclosedTransactionBatches,
} from '@/modules/transaction-batch'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'
import { useInfoModalStore } from '@/store/info-modal-store'
import { useHotkeys } from 'react-hotkeys-hook'

import { LayersIcon, LayersSharpDotIcon, PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import UnclosedTransactionBatchesList from './unclosed-transaction-batch/unclosed-transaction-batch'

interface Props extends IClassProps {}

const TransactionBatchNavButton = (_props: Props) => {
    const modalState = useModalState()
    const manageBatchModalState = useModalState(false)
    const queryClient = useQueryClient()

    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrgBranch<IEmployee>()

    const {
        data: transactionBatch,
        setData,
        reset,
        hasNoTransactionBatch,
    } = useTransactionBatchStore()

    const {
        data: currentBatchData,
        isSuccess,
        isError,
        error,
    } = useCurrentTransactionBatch()

    const { onOpen } = useInfoModalStore()

    const handleSuccess = useCallback(
        (data: TTransactionBatchFullorMin) => setData(data),
        [setData]
    )

    useQeueryHookCallback({
        isSuccess,
        data: currentBatchData,
        isError,
        error,
        onSuccess: handleSuccess,
    })

    useSubscribe('transaction_batch', `create.${transactionBatch?.id}`, () => {
        toast.info('Your current transaction batch has been created.')
        queryClient.invalidateQueries({ queryKey: [transactionBatchQueryKey] })
    })

    useSubscribe('transaction_batch', `update.${transactionBatch?.id}`, () => {
        queryClient.invalidateQueries({ queryKey: [transactionBatchQueryKey] })
    })

    useSubscribe('transaction_batch', `end.${transactionBatch?.id}`, () => {
        toast.info('Your current transaction batch has been ended.')
        reset()
    })

    useSubscribe<TTransactionBatchFullorMin>(
        'transaction_batch',
        `delete.${transactionBatch?.id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: [transactionBatchQueryKey],
            })
            reset()
            toast.info('Your current transaction batch has been deleted.')
        }
    )

    useHotkeys(
        'ctrl+alt+k',
        (e) => {
            e.preventDefault()
            manageBatchModalState.onOpenChange(!manageBatchModalState.open)
            if (!hasNoTransactionBatch) modalState.onOpenChange(true)
        },
        [manageBatchModalState.open, hasNoTransactionBatch]
    )

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (!transactionBatch || transactionBatch.is_today || mounted) return

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

    const {
        branch_setting: { currency },
    } = user_organization.branch

    const unclosedTransactionBatchesList = useUnclosedTransactionBatches()

    const hasNotToday = unclosedTransactionBatchesList?.data?.some(
        (item) => !item.is_today
    )

    return (
        <div className="flex gap-2 items-center">
            <TransactionBatchCreateFormModal
                {...modalState}
                formProps={{
                    defaultValues: {
                        name: `${user.last_name}-batch-${toReadableDateTime(
                            new Date(),
                            'mmddyyyy-hhmmss'
                        )}`.toLowerCase(),
                        branch_id: user_organization.branch_id,
                        organization_id: user_organization.organization_id,
                        provided_by_user: user_organization,
                        provided_by_user_id: user.id,
                        currency,
                        currency_id: currency.id,
                    },
                    onSuccess: (data) => {
                        setData(data)
                        console.log({ data })
                        queryClient.invalidateQueries({
                            queryKey: ['transaction-batch', 'unclosed', 'me'],
                        })
                    },
                }}
            />
            <ButtonGroup>
                <ButtonGroup className="hidden sm:flex">
                    <Button
                        className="group rounded-lg cursor-pointer border"
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
                        <PlusIcon className="duration-300 group-hover:text-inherit" />
                        {!transactionBatch && 'Start Transaction Batch'}
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    {transactionBatch && (
                        <>
                            <Popover
                                modal
                                onOpenChange={
                                    manageBatchModalState.onOpenChange
                                }
                                open={manageBatchModalState.open}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        className={cn(
                                            'group relative cursor-pointer',
                                            !transactionBatch.is_today &&
                                                'animate-pulse border-destructive'
                                        )}
                                        disabled={
                                            !hasPermissionFromAuth({
                                                action: ['Create'],
                                                resourceType:
                                                    'TransactionBatch',
                                            }) &&
                                            !hasPermissionFromAuth({
                                                action: ['Update', 'OwnUpdate'],
                                                resourceType:
                                                    'TransactionBatch',
                                                resource: transactionBatch,
                                            })
                                        }
                                        hoverVariant={
                                            transactionBatch.is_today
                                                ? 'default'
                                                : 'destructive'
                                        }
                                        size="xs"
                                        variant={
                                            transactionBatch.is_today
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        <LayersSharpDotIcon className="duration-300 group-hover:text-inherit" />
                                        {transactionBatch.is_today
                                            ? 'Manage Batch'
                                            : 'Batch Overdue'}
                                        {!transactionBatch.is_today && (
                                            <div className="size-2 absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 bg-destructive animate-ping rounded-full ml-auto" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    className="h-fit w-fit border-none bg-transparent p-0 shadow-none"
                                    onEscapeKeyDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    <TransactionBatch
                                        onBatchEnded={() => setData(null)}
                                        transactionBatch={
                                            transactionBatch as TTransactionBatchFullorMin
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                            <TransactionBatchCreateFormModal
                                {...modalState}
                                formProps={{
                                    defaultValues: {
                                        name: `${user.last_name}-batch-${toReadableDateTime(
                                            new Date(),
                                            'mmddyyyy-hhmmss'
                                        )}`.toLowerCase(),
                                        branch_id: user_organization.branch_id,
                                        organization_id:
                                            user_organization.organization_id,
                                        provided_by_user: user_organization,
                                        provided_by_user_id: user.id,
                                        currency,
                                        currency_id: currency.id,
                                    },
                                    onSuccess: (data) => {
                                        setData(data)
                                        console.log({ data })
                                        queryClient.invalidateQueries({
                                            queryKey: [
                                                'transaction-batch',
                                                'unclosed',
                                                'me',
                                            ],
                                        })
                                    },
                                }}
                            />
                        </>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className={cn(
                                    'relative group  cursor-pointer rounded-lg border gap-1.5 border-warning-foreground/40  text-warning-foreground/90 hover:bg-warning/10 hover:text-warning-foreground',
                                    hasNotToday
                                        ? 'border-destructive! bg-destructive/20!'
                                        : 'dark:border-warning/80  bg-warning'
                                )}
                                shadow="none"
                                size="xs"
                                variant="outline"
                            >
                                <LayersIcon className="size-3 opacity-60" />
                                {hasNotToday && (
                                    <span className=" text-destructive text-2xl absolute -top-4 -right-1 animate-pulse  ">
                                        •
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="h-fit min-w-[360px] p-0 border border-none bg-transparent shadow-none"
                            sideOffset={8}
                        >
                            <UnclosedTransactionBatchesList
                                uncloseBatchQuery={
                                    unclosedTransactionBatchesList
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </ButtonGroup>
            </ButtonGroup>
        </div>
    )
}

export default TransactionBatchNavButton
