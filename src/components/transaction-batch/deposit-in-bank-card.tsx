import { cn } from '@/lib'
import { Button } from '../ui/button'

import { IClassProps } from '@/types'
import { PencilFillIcon } from '../icons'

interface Props extends IClassProps {}

const DepositInBankCard = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'relative flex-1 rounded-xl bg-accent p-2',
                className
            )}
        >
            <p className="text-lg">8000.00</p>
            <p className="text-sm text-muted-foreground/70">
                Total Deposit in Bank
            </p>
            <Button
                size="icon"
                variant="default"
                className="absolute right-2 top-1.5 size-fit p-1"
            >
                <PencilFillIcon />
            </Button>
        </div>
    )
}

export default DepositInBankCard
