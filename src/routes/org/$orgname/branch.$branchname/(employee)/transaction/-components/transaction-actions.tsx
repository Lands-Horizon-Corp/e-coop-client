import { payment_bg } from '@/assets/transactions'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    OutlinePaymentIcon,
    PiHandDepositIcon,
    PiHandWithdrawIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

interface actionItemsProps {
    onClick?: () => void
    label?: string
    icon?: React.ReactNode
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

const ActionTransactionItem = ({
    onClick,
    label,
    icon,
    buttonProps,
}: actionItemsProps) => {
    return (
        <GradientBackground gradientOnly className="w-full rounded-xl">
            <Button
                variant={'outline'}
                className="relative h-14 w-full overflow-hidden rounded-xl !border-primary/20 hover:bg-primary/10"
                {...buttonProps}
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
    PaymentButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    DepositButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    withdrawButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

const TransactionActions = ({
    paymentOnClick,
    depositOnClick,
    withdrawOnClick,
    widthdrawLabel = 'Withdraw',
    depositLabel = 'Deposit',
    paymentLabel = 'Add Transaction',
    PaymentButtonProps,
    DepositButtonProps,
    withdrawButtonProps,
}: TransactionActionsProps) => {
    return (
        <div className="flex w-full flex-col justify-evenly space-y-2 py-2 lg:flex-row lg:space-x-2 lg:space-y-0">
            <ActionTransactionItem
                onClick={paymentOnClick}
                label={paymentLabel}
                icon={<OutlinePaymentIcon />}
                buttonProps={PaymentButtonProps}
            />
            <ActionTransactionItem
                onClick={depositOnClick}
                label={depositLabel}
                icon={<PiHandDepositIcon />}
                buttonProps={DepositButtonProps}
            />
            <ActionTransactionItem
                onClick={withdrawOnClick}
                label={widthdrawLabel}
                icon={<PiHandWithdrawIcon />}
                buttonProps={withdrawButtonProps}
            />
        </div>
    )
}

export default TransactionActions
