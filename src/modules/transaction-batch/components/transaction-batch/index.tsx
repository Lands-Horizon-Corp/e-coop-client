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
import TimeMachineCancelFormModal from '@/modules/time-machine-log/components/cancel-time-machine-modal'
import TimeMachineFormModal from '@/modules/time-machine-log/components/time-machine-modal'

import {
    ClockIcon,
    DotMediumIcon,
    ErrorExclamationIcon,
    EyeIcon,
    LayersSharpDotIcon,
    RefreshIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { useTransactionBatchCurrentRefresh } from '../../transaction-batch.service'
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

    const timeMachineCancel = useModalState()
    const timeMachineForm = useModalState()

    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrg()

    const { mutate: refreshCurrentTransactionBatch } =
        useTransactionBatchCurrentRefresh()

    const invalidateTransactionBatch = () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', transactionBatch.id],
        })

        // queryClient.invalidateQueries({
        //     queryKey: ['transaction-batch', 'current'],
        // })
    }

    const hasCurrentTimeMachineSession = !!user_organization?.time_machine_time

    const notToday = !transactionBatch.created_at
        ? false
        : toReadableDate(transactionBatch.created_at, 'yyyy-MM-dd') !==
          toReadableDate(new Date(), 'yyyy-MM-dd')

    // will show cancel time machine button if the transaction batch is not from today,
    // or if the transaction batch is from today but the current date is not today (time machine is active)
    //  and it will not show if no current time machine session is active
    const showCancelTimeMachine =
        (!transactionBatch.is_today || notToday) && hasCurrentTimeMachineSession

    //show time machine only if not exisiting time machine session,
    const showTimeMachineButton = notToday && !showCancelTimeMachine

    const showButtonRed =
        notToday && hasCurrentTimeMachineSession && !transactionBatch.is_today

    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] w-full flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-secondary p-4 ring-offset-0 dark:bg-popover',
                'shadow-xl',
                className,
                !transactionBatch.is_today && 'ring-destructive! ring'
            )}
        >
            <TimeMachineCancelFormModal {...timeMachineCancel} />
            {user_organization.id && (
                <TimeMachineFormModal
                    userOrganizationId={user_organization.id}
                    {...timeMachineForm}
                    formProps={{
                        frozenAt: transactionBatch.created_at,
                        reason: 'Blotter balancing verification is in progress',
                        description:
                            'Unabalanced blotter detected during review, requiring time machine to verify transactions under current batch date',
                    }}
                />
            )}
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
                            {user_organization?.time_machine_time &&
                            !transactionBatch.is_today
                                ? `${toReadableDateTime(
                                      user_organization.time_machine_time,
                                      "MMM, dd yyyy 'at' h:mm a "
                                  )}`
                                : toReadableDate(
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
                    {showTimeMachineButton && (
                        <Button
                            onClick={() => timeMachineForm.openModal()}
                            size={'sm'}
                        >
                            <ClockIcon className="inline" /> Time Machine
                        </Button>
                    )}
                    <Button
                        hoverVariant="primary"
                        onClick={() => {
                            refreshCurrentTransactionBatch()
                            invalidateTransactionBatch()
                        }}
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
                    {showCancelTimeMachine && (
                        <Button
                            className={cn('', showButtonRed && 'animate-pulse')}
                            onClick={(e) => {
                                e.preventDefault()
                                timeMachineCancel.openModal()
                            }}
                            variant={showButtonRed ? 'destructive' : 'default'}
                        >
                            Cancel Time Machine
                            <ClockIcon />
                        </Button>
                    )}
                </div>
            </div>
            {showButtonRed && (
                <Kbd className=" self-end italic text-xs text-destructive">
                    To proceed with this blotter date, please cancel the active
                    Time Machine session first.
                </Kbd>
            )}
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
