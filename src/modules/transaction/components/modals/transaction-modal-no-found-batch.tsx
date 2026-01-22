import { Link } from '@tanstack/react-router'

// Modern icons

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { ITransactionBatchMinimal } from '@/modules/transaction-batch'
import { TransactionBatchCreateFormModal } from '@/modules/transaction-batch/components/forms/transaction-batch-create-form'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'
import { LayoutDashboard, PlusCircle } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { EmptyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

type TransactionNoFoundBatchProps = {
    mode: 'deposit-withdrawal' | 'payment'
}

const TransactionNoFoundBatch = ({ mode }: TransactionNoFoundBatchProps) => {
    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrgBranch<IEmployee>()

    const createBatchModalState = useModalState()
    const { setData, hasNoTransactionBatch } = useTransactionBatchStore()

    const handleSuccess = (newBatchData: ITransactionBatchMinimal) => {
        createBatchModalState.onOpenChange(false)
        return setData(newBatchData)
    }

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        if (hasNoTransactionBatch) return
        createBatchModalState.onOpenChange(true)
    })

    // Logic Check: Usually you'd return null if a batch EXISTS.
    // Assuming your store logic 'hasNoTransactionBatch' means "there is no batch currently active"
    if (hasNoTransactionBatch) return null

    return (
        <>
            <TransactionBatchCreateFormModal
                {...createBatchModalState}
                formProps={{
                    defaultValues: {
                        name: `${user.user_name}-batch-${toReadableDate(new Date(), 'MM-dd-yyyy')}`.toLowerCase(),
                        branch_id: user_organization.branch_id,
                        organization_id: user_organization.organization_id,
                        provided_by_user: user_organization,
                        provided_by_user_id: user.id,
                        currency:
                            user_organization.branch.branch_setting.currency,
                        currency_id:
                            user_organization.branch.branch_setting.currency.id,
                    },
                    onSuccess: handleSuccess,
                }}
            />

            <div
                className={cn(
                    'flex flex-col items-center py-5 p-2 justify-center text-center animate-in fade-in zoom-in-95 duration-300',
                    mode === 'payment'
                        ? 'inset-0 absolute z-50 border rounded-lg bg-background/30 backdrop-blur-sm'
                        : 'inset-0 absolute top-[70%] h-fit z-50 backdrop-blur-sm w-full border rounded-xl bg-muted/30 my-4'
                )}
            >
                {/* Icon Circle */}
                <div
                    className={cn(
                        'flex size-15 items-center justify-center rounded-full bg-muted mb-3',
                        mode === 'payment' ? 'hidden' : ''
                    )}
                >
                    <EmptyIcon className=" size-7 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="max-w-[420px]  space-y-2 mb-4">
                    <h3 className=" text-[max(15px,.9vw)] font-semibold tracking-tight">
                        No Transaction Batch Found
                    </h3>
                    <p className="text-[max(13px,.6vw)] text-muted-foreground">
                        You need an active batch to process{' '}
                        {mode === 'payment' ? 'payments' : 'deposits'}. Create a
                        new one to get started.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button asChild size={'sm'} variant="outline">
                        <Link
                            to={
                                '/org/$orgname/branch/$branchname/dashboard' as string
                            }
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>

                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            createBatchModalState.onOpenChange(true)
                        }}
                        size={'sm'}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Start Transaction Batch
                    </Button>
                </div>
            </div>
        </>
    )
}

export default TransactionNoFoundBatch
