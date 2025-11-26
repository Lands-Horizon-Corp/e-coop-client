import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import AccountBadge from '@/modules/account/components/badges/account-badge'
import { currencyFormat } from '@/modules/currency'

import { TIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import {
    ILoanTransaction,
    ILoanTransactionSummary,
    TLoanModeOfPayment,
} from '../../loan-transaction.types'
import LoanModeOfPaymentBadge from '../loan-mode-of-payment-badge'

// Loan Details Component
export const LoanDetails = ({
    className,
    loanTransaction,
    loanTransactionSummary,
}: IClassProps & {
    loanTransaction: ILoanTransaction
    loanTransactionSummary?: ILoanTransactionSummary
}) => {
    const {
        account,
        created_at,
        terms,
        applied_1,
        amortization,
        total_add_on,
        mode_of_payment,
        mode_of_payment_fixed_days,
        mode_of_payment_monthly_exact_day,
        mode_of_payment_weekly,

        mode_of_payment_semi_monthly_pay_1,
        mode_of_payment_semi_monthly_pay_2,
    } = loanTransaction

    const {
        amount_granted,
        arrears,
        first_deliquency_date,
        first_irregularity_date,
        last_payment,
    } = loanTransactionSummary || {}

    return (
        <div
            className={cn(
                'grid grid-cols-3 gap-4 flex-1 ecoop-scroll justify-between',
                className
            )}
        >
            {/* Account Info & Dates */}
            <LoanInfoSection title="Account Info & Dates">
                <LoanInfoItem>
                    <InfoLabel>Account:</InfoLabel>
                    {account?.icon && account?.name ? (
                        <AccountBadge
                            icon={account.icon as TIcon}
                            name={account.name}
                            size="sm"
                            variant="primary"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem className="text-nowrap">
                    <InfoLabel>Entry Date:</InfoLabel>
                    {created_at ? (
                        <InfoValue>
                            {toReadableDate(created_at)}
                            <span className="block text-xs font-normal text-muted-foreground">
                                {dateAgo(created_at)}
                            </span>
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Terms:</InfoLabel>
                    {typeof terms === 'number' ? (
                        <InfoValue className="font-medium">
                            {terms}
                            <span className="font-bold text-xs">Mos</span>
                        </InfoValue>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Last Payment:</InfoLabel>
                    {last_payment ? (
                        <InfoValue className="font-mono">
                            {toReadableDate(last_payment)}
                            <span className="block text-xs font-normal text-muted-foreground">
                                {dateAgo(last_payment)}
                            </span>
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>
            </LoanInfoSection>

            {/* Loan Summary */}
            <LoanInfoSection title="Loan Summary">
                <LoanInfoItem>
                    <InfoLabel>Amount Applied:</InfoLabel>
                    {typeof applied_1 === 'number' ? (
                        <InfoValue className="text-primary font-mono">
                            {currencyFormat(applied_1, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })}
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Amount Granted:</InfoLabel>
                    {typeof amount_granted === 'number' ? (
                        <InfoValue className="text-primary font-mono">
                            {currencyFormat(amount_granted, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })}
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Amortization:</InfoLabel>
                    {typeof amortization === 'number' ? (
                        <InfoValue className="font-mono">
                            {currencyFormat(amortization, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })}
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Total Add-On:</InfoLabel>
                    {typeof total_add_on === 'number' ? (
                        <InfoValue className="font-mono">
                            {currencyFormat(total_add_on, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })}
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>
            </LoanInfoSection>

            {/* Penalties & Mode */}
            <LoanInfoSection title="Penalties & Mode">
                <LoanInfoItem>
                    <InfoLabel>Mode:</InfoLabel>
                    {mode_of_payment ? (
                        <LoanModeOfPaymentBadge
                            mode={mode_of_payment as TLoanModeOfPayment}
                            size="sm"
                        />
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                {mode_of_payment === 'day' && (
                    <LoanInfoItem>
                        <InfoLabel>Fixed Days:</InfoLabel>
                        {typeof mode_of_payment_fixed_days === 'number' ? (
                            <InfoValue className="font-mono">
                                {mode_of_payment_fixed_days}
                            </InfoValue>
                        ) : (
                            <span className="text-base text-muted-foreground">
                                ...
                            </span>
                        )}
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'monthly' && (
                    <LoanInfoItem>
                        <InfoLabel>Payment:</InfoLabel>
                        {typeof mode_of_payment_monthly_exact_day ===
                        'boolean' ? (
                            <InfoValue className="font-mono">
                                {mode_of_payment_monthly_exact_day
                                    ? 'Exact Day'
                                    : 'Every 30 Days'}
                            </InfoValue>
                        ) : (
                            <span className="text-base text-muted-foreground">
                                ...
                            </span>
                        )}
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'weekly' && (
                    <LoanInfoItem>
                        <InfoLabel>Payment:</InfoLabel>
                        {typeof mode_of_payment_weekly === 'string' ? (
                            <InfoValue className="font-mono">
                                {mode_of_payment_weekly}
                            </InfoValue>
                        ) : (
                            <span className="text-base text-muted-foreground">
                                ...
                            </span>
                        )}
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'semi-monthly' && (
                    <>
                        <LoanInfoItem>
                            <InfoLabel>Payment 1:</InfoLabel>
                            {typeof mode_of_payment_semi_monthly_pay_1 ===
                            'string' ? (
                                <InfoValue className="font-mono">
                                    {`Day ${mode_of_payment_semi_monthly_pay_1}`}
                                </InfoValue>
                            ) : (
                                <span className="text-base text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </LoanInfoItem>
                        <LoanInfoItem>
                            <InfoLabel>Payment 2:</InfoLabel>
                            {typeof mode_of_payment_semi_monthly_pay_2 ===
                            'string' ? (
                                <InfoValue className="font-mono">
                                    {`Day ${mode_of_payment_semi_monthly_pay_2}`}
                                </InfoValue>
                            ) : (
                                <span className="text-base text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </LoanInfoItem>
                    </>
                )}

                <LoanInfoItem>
                    <InfoLabel>Arrears:</InfoLabel>
                    {typeof arrears === 'number' ? (
                        <InfoValue className="font-mono text-red-600 dark:text-red-500">
                            {currencyFormat(arrears, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })}
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>First DQ Date:</InfoLabel>
                    {first_deliquency_date ? (
                        <InfoValue className="font-mono">
                            {toReadableDate(first_deliquency_date)}

                            <span className="block text-xs font-normal text-muted-foreground">
                                {dateAgo(first_deliquency_date)}
                            </span>
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>First Irregular Date:</InfoLabel>
                    {first_irregularity_date ? (
                        <InfoValue className="font-mono">
                            {toReadableDate(first_irregularity_date)}
                            <span className="block text-xs font-normal text-muted-foreground">
                                {dateAgo(first_irregularity_date)}
                            </span>
                        </InfoValue>
                    ) : (
                        <span className="text-base text-muted-foreground">
                            ...
                        </span>
                    )}
                </LoanInfoItem>
            </LoanInfoSection>
        </div>
    )
}

const LoanInfoItem = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return <div className={cn('text-sm space-y-2', className)}>{children}</div>
}

const InfoLabel = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return (
        <p
            className={cn(
                'text-nowrap font-medium text-muted-foreground text-xs',
                className
            )}
        >
            {children}
        </p>
    )
}

const InfoValue = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return (
        <span className={cn('py-1 font-bold rounded-md ', className)}>
            {children}
        </span>
    )
}

const LoanInfoSection = ({
    title,
    titleClassName,
    className,
    children,
}: IClassProps & {
    title?: string
    titleClassName?: string
    children: ReactNode
}) => {
    return (
        <div
            className={cn(
                'space-y-4 px-4 bg-popover p-4 rounded-xl border border-input dark:border-input/50',
                className
            )}
        >
            {title && (
                <p
                    className={cn(
                        'text-sm font-bold text-nowrap text-muted-foreground',
                        titleClassName
                    )}
                >
                    {title}
                </p>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    )
}
