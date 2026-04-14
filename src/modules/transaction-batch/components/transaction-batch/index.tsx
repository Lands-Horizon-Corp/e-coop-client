import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { toReadableDate, toReadableDateTime } from '@/helpers/date-utils'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrg,
} from '@/modules/authentication/authgentication.store'
import { ICurrency } from '@/modules/currency'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'
import { ChangeORFormModal } from '@/modules/general-ledger/components/change-or-form'

// import { useTimeMachine } from '@/modules/user-organization'
// import useActionSecurityStore from '@/store/action-security-store'

import {
    DotMediumIcon,
    ErrorExclamationIcon,
    EyeIcon,
    LayersSharpDotIcon,
    RefreshIcon,
} from '@/components/icons'
// import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    ITransactionBatch,
    TTransactionBatchFullorMin,
} from '../../transaction-batch.types'
import { TransactionBatchEndFormModal } from '../forms/transaction-batch-end-form'
import BatchBlotter from './batch-blotter'
import DepositInBankCard from './deposit-in-bank/deposit-in-bank-card'
import BatchCheckRemitance from './remittance/check-remittance'
import BatchOnlineRemittance from './remittance/online-remittance'
import TransactionBatchCashCount from './transaction-batch-cash-count'
import TransactionBatchDisbursementTransaction from './transaction-batch-disbursements'
import BeginningBalanceCard from './transaction-batch-funding-card'
import { TransactionBatchHistoriesModal } from './transaction-batch-histories'

interface Props extends IClassProps {
    transactionBatch: TTransactionBatchFullorMin
    onBatchEnded?: () => void
}

const TransactionBatch = ({
    className,
    transactionBatch,
    onBatchEnded,
}: Props) => {
    const queryClient = useQueryClient()
    const historyModal = useModalState()
    const endModal = useModalState()

    // const { onOpenSecurityAction } = useActionSecurityStore()

    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrg()

    const invalidateTransactionBatch = () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', transactionBatch.id],
        })

        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'current'],
        })
    }

    // const { mutate: timeMachine, isPending: isPendingTimeMachine } =
    //     useTimeMachine({
    //         options: {
    //             onSuccess: () => {
    //                 toast.success(
    //                     `Successfully Changed to  ${toReadableDate(transactionBatch.created_at)}`
    //                 )
    //             },
    //             onError: () => {
    //                 toast.error(
    //                     `Something went wrong with time machine ${toReadableDate(transactionBatch.created_at)}`
    //                 )
    //             },
    //         },
    //     })

    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] w-full flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-secondary p-4 ring-offset-0 dark:bg-popover',
                'shadow-xl',
                className,
                !transactionBatch.is_today && 'ring-destructive! ring'
            )}
        >
            <TransactionBatchHistoriesModal
                {...historyModal}
                title={`${transactionBatch?.batch_name ?? 'Transaction Batch'} History`}
                transactionBatchHistoryProps={{
                    transactionBatchId: transactionBatch?.id,
                }}
            />
            <TransactionBatchEndFormModal
                {...endModal}
                formProps={{
                    onSuccess: onBatchEnded,
                    defaultValues: {
                        employee_by_name: user.full_name,
                        employee_by_position: user_organization.permission_name,
                    },
                }}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-x-2">
                    <LayersSharpDotIcon
                        className={cn(
                            'mt-1 inline text-primary',
                            !transactionBatch.is_today &&
                                'text-destructive animate-pulse'
                        )}
                    />{' '}
                    <div>
                        <div className="flex items-center gap-x-2">
                            <span
                                className={cn(
                                    '',
                                    !transactionBatch.is_today &&
                                        'text-destructive'
                                )}
                            >
                                Transaction Batch
                            </span>{' '}
                            <CurrencyBadge
                                currency={transactionBatch.currency}
                                displayFormat="symbol-code"
                                size="sm"
                            />
                            {!transactionBatch.is_today && (
                                <Badge
                                    className="animate-pulse"
                                    variant="destructive"
                                >
                                    Date Mismatch
                                </Badge>
                            )}
                        </div>
                        <p
                            className={cn(
                                'text-xs text-muted-foreground',
                                !transactionBatch.is_today && 'text-destructive'
                            )}
                        >
                            {toReadableDate(
                                transactionBatch?.created_at,
                                "MMM, dd yyyy 'at' h:mm a "
                            )}
                        </p>

                        <div className="text-xs text-muted-foreground/70 font-semibold">
                            Batch ID{' '}
                            <CopyWrapper className="text-muted-foreground/50">
                                {transactionBatch?.id}
                            </CopyWrapper>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <Button
                        hoverVariant="primary"
                        onClick={() => invalidateTransactionBatch()}
                        size="icon-sm"
                        variant="secondary"
                    >
                        <RefreshIcon className="inline" />
                    </Button>
                    <Button
                        className="py-1"
                        disabled={
                            !hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'TransactionBatchHistory',
                            })
                        }
                        hoverVariant="primary"
                        onClick={() => historyModal.onOpenChange(true)}
                        size="sm"
                        variant="secondary"
                    >
                        <EyeIcon className="mr-2 inline" /> Blotter
                    </Button>

                    <DotMediumIcon className="text-primary animate-pulse" />
                    <ChangeORFormModal
                        buttonProps={{
                            variant: 'secondary',
                            size: 'sm',
                        }}
                    />
                    {/* {!transactionBatch.is_today && (
                        <Button
                            disabled={isPendingTimeMachine}
                            onClick={(e) => {
                                e.preventDefault()
                                onOpenSecurityAction({
                                    title: 'Time Machine Confirmation',
                                    description:
                                        'Type password to implement time machine.',
                                    onSuccess: () =>
                                        timeMachine({
                                            time_machine_time: new Date(
                                                transactionBatch.created_at
                                            ),
                                        }),
                                })
                            }}
                        >
                            {isPendingTimeMachine ? (
                                <LoadingSpinner />
                            ) : (
                                'Time Machine'
                            )}
                            <ClockIcon />
                        </Button>
                    )} */}
                </div>
            </div>
            <div className="flex min-h-[40vh] w-full max-w-7xl shrink-0 gap-x-2">
                <div className="flex-1 space-y-2 rounded-2xl border bg-background p-4">
                    <div className="flex gap-x-2">
                        <BeginningBalanceCard
                            currency={transactionBatch.currency}
                            onAdd={() => invalidateTransactionBatch()}
                            transactionBatch={transactionBatch}
                        />
                        <DepositInBankCard
                            currency={transactionBatch?.currency as ICurrency}
                            currency_id={
                                transactionBatch?.currency_id as TEntityId
                            }
                            depositInBankAmount={
                                transactionBatch?.deposit_in_bank ?? 0
                            }
                            onUpdate={() => invalidateTransactionBatch()}
                            transactionBatchId={transactionBatch?.id}
                        />
                    </div>
                    <TransactionBatchCashCount
                        onCashCountUpdate={() => invalidateTransactionBatch()}
                        transactionBatch={transactionBatch}
                    />
                    <BatchCheckRemitance
                        currency={transactionBatch?.currency}
                        onCheckRemittanceUpdate={() =>
                            invalidateTransactionBatch()
                        }
                        transactionBatchId={transactionBatch?.id}
                    />
                    <BatchOnlineRemittance
                        currency={transactionBatch?.currency}
                        onOnlineRemittanceUpdate={() =>
                            invalidateTransactionBatch()
                        }
                        transactionBatchId={transactionBatch?.id}
                    />
                    <TransactionBatchDisbursementTransaction
                        currency={transactionBatch.currency}
                        onDisbursementUpdate={() =>
                            invalidateTransactionBatch()
                        }
                        transactionBatchId={transactionBatch?.id}
                    />
                </div>
                <BatchBlotter
                    transactionBatch={transactionBatch as ITransactionBatch}
                />
            </div>
            <div className="sticky bottom-0 w-full space-y-2">
                {!transactionBatch.is_today && (
                    <div className="bg-popover rounded-xl overflow-clip border-destructive/60 border">
                        <div className="flex items-center gap-2 bg-destructive/10 px-3 py-2 text-sm">
                            <ErrorExclamationIcon className="size-4 animate-pulse shrink-0 text-destructive" />
                            <p className="">
                                Your current transaction batch dated{' '}
                                <span className="font-medium text-foreground">
                                    {toReadableDateTime(
                                        transactionBatch.created_at,
                                        'MMM dd, yyyy'
                                    )}
                                </span>{' '}
                                does not match today&apos;s date — please close
                                before continuing.
                            </p>
                            <div className="size-2 bg-destructive animate-ping rounded-full ml-auto" />
                        </div>
                    </div>
                )}
                <Button
                    className="shrink-0 w-full rounded-xl dark:bg-secondary dark:text-secondary-foreground"
                    disabled={
                        !hasPermissionFromAuth({
                            action: ['Update', 'OwnUpdate'],
                            resourceType: 'TransactionBatch',
                            resource: transactionBatch,
                        })
                    }
                    hoverVariant="primary"
                    onClick={() => endModal.onOpenChange(true)}
                    size="sm"
                >
                    End Batch
                </Button>
            </div>
        </div>
    )
}

export default TransactionBatch
