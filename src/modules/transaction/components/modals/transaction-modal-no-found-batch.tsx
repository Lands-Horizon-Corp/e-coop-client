import { Link } from '@tanstack/react-router'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { ITransactionBatchMinimal } from '@/modules/transaction-batch'
import { TransactionBatchCreateFormModal } from '@/modules/transaction-batch/components/forms/transaction-batch-create-form'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { IEmployee } from '@/modules/user'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

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

    if (hasNoTransactionBatch) return null

    return (
        <>
            <TransactionBatchCreateFormModal
                {...createBatchModalState}
                formProps={{
                    defaultValues: {
                        name: `${user.user_name}'s-batch-${toReadableDate(
                            new Date(),
                            'MM-dd-yyyy'
                        )}`.toLowerCase(),
                        branch_id: user_organization.branch_id,
                        organization_id: user_organization.organization_id,
                    },
                    onSuccess: handleSuccess,
                }}
            />
            <Card
                className={cn(
                    mode === 'payment'
                        ? 'z-50 w-full bg-sidebar/95 absolute !p-0 h-full rounded-sm'
                        : 'absolute bottom-0 z-50 bg-sidebar/95 left-0 w-full'
                )}
            >
                <CardHeader
                    className={cn(
                        mode === 'payment' ? 'text-center !p-1' : 'text-center'
                    )}
                >
                    <CardTitle className="text-lg font-bold">
                        No Transaction Batch Found
                    </CardTitle>
                    <CardDescription>
                        Please create a new transaction batch to proceed.
                    </CardDescription>
                </CardHeader>
                <CardContent
                    className={cn(
                        mode === 'payment' ? 'w-full p-0 ' : 'p-2 mt-2'
                    )}
                >
                    <div
                        className={cn(
                            'w-full !flex !justify-between',
                            mode === 'payment' ? 'px-2 ' : 'p-2'
                        )}
                    >
                        <Button size={'sm'} variant={'secondary'}>
                            <Link
                                to={
                                    '/org/$orgname/branch/$branchname/dashboard' as string
                                }
                                className="w-full"
                            >
                                Return to Dashboard
                            </Link>
                        </Button>
                        <Button
                            size={'sm'}
                            onClick={(e) => {
                                e.preventDefault()
                                createBatchModalState.onOpenChange(true)
                            }}
                        >
                            Start Transaction Batch
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TransactionNoFoundBatch
