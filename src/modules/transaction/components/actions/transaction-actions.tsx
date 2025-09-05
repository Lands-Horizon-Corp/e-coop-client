import { payment_bg } from '@/assets/transactions'
import { withdraw_bg } from '@/assets/transactions'
import { deposit_bg } from '@/assets/transactions'

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
    backgroundImage?: string
    className?: string
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | 'link'
        | 'secondary'
        | 'nostyle'
}

const ActionTransactionItem = ({
    onClick,
    label,
    icon,
    buttonProps,
    backgroundImage,
    className,
    variant = 'default',
}: actionItemsProps) => {
    return (
        <GradientBackground
            opacity={0.0}
            gradientOnly
            className="w-full rounded-xl "
        >
            <Button
                variant={variant}
                className={`relative h-14 w-full overflow-hidden rounded-xl dark!border-blue-400/20 dark:border-0  ' ${className}`}
                {...buttonProps}
                onClick={onClick}
            >
                <span className="mr-2">{icon}</span>
                {label}
                <span
                    className="absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 size-25"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.1,
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
                backgroundImage={payment_bg}
            />
            <ActionTransactionItem
                onClick={depositOnClick}
                label={depositLabel}
                icon={<PiHandDepositIcon />}
                buttonProps={DepositButtonProps}
                backgroundImage={deposit_bg}
                variant="secondary"
            />
            <ActionTransactionItem
                onClick={withdrawOnClick}
                label={widthdrawLabel}
                icon={<PiHandWithdrawIcon />}
                backgroundImage={withdraw_bg}
                buttonProps={withdrawButtonProps}
                variant="destructive"
                className="opacity-80 hover:opacity-100"
            />
        </div>
    )
}

export default TransactionActions
