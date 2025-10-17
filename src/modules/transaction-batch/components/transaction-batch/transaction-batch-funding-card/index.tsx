import { useState } from 'react'

import { cn } from '@/helpers'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'
import { BatchFundingCreateFormModal } from '@/modules/batch-funding/components/batch-funding-create-form'
import { currencyFormat } from '@/modules/currency'
import { TTransactionBatchFullorMin } from '@/modules/transaction-batch/transaction-batch.types'

import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    transactionBatch: TTransactionBatchFullorMin
    onAdd?: () => void
}

const BeginningBalanceCard = ({
    className,
    transactionBatch,
    onAdd,
}: Props) => {
    const {
        currentAuth: { user },
    } = useAuthUserWithOrg()

    const [addModal, setAddModal] = useState(false)

    return (
        <div
            className={cn(
                'relative flex-1 rounded-xl bg-accent p-2',
                className
            )}
        >
            <BatchFundingCreateFormModal
                formProps={{
                    transactionBatchId: transactionBatch?.id,
                    defaultValues: {
                        provided_by_user: user,
                        provided_by_user_id: user.id,
                    },
                    onSuccess() {
                        setAddModal(false)
                        onAdd?.()
                    },
                }}
                onOpenChange={setAddModal}
                open={addModal}
            />
            <p className="text-lg">
                {currencyFormat(transactionBatch.beginning_balance, {
                    showSymbol: false,
                })}
            </p>
            <p className="text-sm text-muted-foreground/70">
                Beginning Balance
            </p>
            <Button
                className="absolute right-2 top-1.5 size-fit p-1"
                onClick={() => setAddModal(true)}
                size="icon"
                variant="default"
            >
                <PlusIcon />
            </Button>
        </div>
    )
}

export default BeginningBalanceCard
