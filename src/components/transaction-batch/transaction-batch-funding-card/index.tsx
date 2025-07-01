import { useState } from 'react'
import { PlusIcon } from '../../icons'
import { Button } from '../../ui/button'
import { BatchFundingCreateFormModal } from '../../forms/batch-funding-create-form'

import { cn } from '@/lib'

import { IClassProps, TTransactionBatchFullorMin } from '@/types'
import { formatNumber } from '@/utils'

interface Props extends IClassProps {
    transactionBatch: TTransactionBatchFullorMin
    onAdd?: () => void
}

const BeginningBalanceCard = ({
    className,
    transactionBatch,
    onAdd,
}: Props) => {
    const [addModal, setAddModal] = useState(false)

    return (
        <div
            className={cn(
                'relative flex-1 rounded-xl bg-accent p-2',
                className
            )}
        >
            <BatchFundingCreateFormModal
                open={addModal}
                onOpenChange={setAddModal}
                formProps={{
                    transactionBatchId: transactionBatch?.id,
                    onSuccess() {
                        setAddModal(false)
                        onAdd?.()
                    },
                }}
            />
            <p className="text-lg">
                {formatNumber(transactionBatch.beginning_balance, 2)}
            </p>
            <p className="text-sm text-muted-foreground/70">
                Beginning Balance
            </p>
            <Button
                size="icon"
                variant="default"
                className="absolute right-2 top-1.5 size-fit p-1"
                onClick={() => setAddModal(true)}
            >
                <PlusIcon />
            </Button>
        </div>
    )
}

export default BeginningBalanceCard
