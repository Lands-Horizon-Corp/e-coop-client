import { payment_bg } from '@/assets/transactions'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { MoneyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

type actionItemsProps = {
    onClick?: () => void
    label?: string
    icon?: React.ReactNode
}

const ActionTransactionItem = ({ onClick, label, icon }: actionItemsProps) => {
    return (
        <GradientBackground gradientOnly className="w-full rounded-xl">
            <Button
                variant={'outline'}
                className="relative h-14 w-full overflow-hidden rounded-xl !border-primary/20 hover:bg-primary/10"
                onClick={onClick}
            >
                <span className="mr-2">{icon}</span>
                {label}
                <span
                    className="absolute -right-5 -top-16 size-52 -rotate-45"
                    style={{
                        backgroundImage: `url(${payment_bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2,
                    }}
                />
            </Button>
        </GradientBackground>
    )
}

type TransactionActionsProps = {
    withdrawOnClick?: () => void
    depositOnClick?: () => void
    paymentOnClick?: () => void
    widthdrawLabel?: string
    depositLabel?: string
    paymentLabel?: string
    disbursementOnClick?: () => void
    disbursementLabel?: string
}

const TransactionActions = ({
    paymentOnClick,
    depositOnClick,
    withdrawOnClick,
    widthdrawLabel = 'Withdraw',
    depositLabel = 'Deposit',
    paymentLabel = 'Add Transaction',
    disbursementLabel = 'Disbursement',
    disbursementOnClick,
}: TransactionActionsProps) => {
    return (
        <div className="flex w-full flex-col justify-evenly space-y-2 py-2 lg:flex-row lg:space-x-2 lg:space-y-0">
            <ActionTransactionItem
                onClick={paymentOnClick}
                label={paymentLabel}
                icon={<MoneyIcon />}
            />
            <ActionTransactionItem
                onClick={depositOnClick}
                label={depositLabel}
                icon={<MoneyIcon />}
            />
            <ActionTransactionItem
                onClick={withdrawOnClick}
                label={widthdrawLabel}
                icon={<MoneyIcon />}
            />
            <ActionTransactionItem
                onClick={disbursementOnClick}
                label={disbursementLabel}
                icon={<MoneyIcon />}
            />
        </div>
    )
}

export default TransactionActions
