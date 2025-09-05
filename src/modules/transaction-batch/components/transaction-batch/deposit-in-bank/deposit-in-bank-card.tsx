import { useState } from 'react'

import { cn } from '@/helpers'
import { formatNumber } from '@/helpers/number-utils'

import { PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { IClassProps, TEntityId } from '@/types'

import DepositInBankCreateForm from './deposit-in-bank-edit-form'

interface Props extends IClassProps {
    transactionBatchId: TEntityId
    depositInBankAmount: number

    onUpdate?: () => void
}

const DepositInBankCard = ({
    className,
    depositInBankAmount,
    transactionBatchId,
    onUpdate,
}: Props) => {
    const [edit, setEdit] = useState(false)

    return (
        <div
            className={cn(
                'relative flex-1 rounded-xl bg-accent p-2',
                className
            )}
        >
            <p className="text-lg">{formatNumber(depositInBankAmount)}</p>
            <p className="text-sm text-muted-foreground/70">
                Total Deposit in Bank
            </p>
            <Popover modal open={edit} onOpenChange={setEdit}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        variant="default"
                        className="absolute right-2 top-1.5 size-fit p-1"
                    >
                        <PencilFillIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="rounded-xl">
                    <DepositInBankCreateForm
                        transactionBatchId={transactionBatchId}
                        defaultValues={{
                            deposit_in_bank: depositInBankAmount,
                        }}
                        onSuccess={() => {
                            setEdit(false)
                            onUpdate?.()
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DepositInBankCard
