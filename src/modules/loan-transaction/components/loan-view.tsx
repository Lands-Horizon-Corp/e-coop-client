import { cn, formatNumber } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import AccountBadge from '@/modules/account/components/badges/account-badge'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'
import LoanLedgerTable from '@/modules/loan-ledger/components/loan-ledger-table'
import {
    ILoanTransaction,
    TLoanModeOfPayment,
    useGetLoanTransactionById,
} from '@/modules/loan-transaction'
import LoanModeOfPaymentBadge from '@/modules/loan-transaction/components/loan-mode-of-payment-badge'
import { IMemberProfile } from '@/modules/member-profile'

import {
    CakeIcon,
    CalculatorIcon,
    CalendarNumberIcon,
    IdCardIcon,
    PhoneIcon,
    PlusIcon,
    PrinterFillIcon,
    TIcon,
    TicketIcon,
    UndoIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextDisplay from '@/components/text-display'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { LoanAddInterestFormModal } from './forms/loan-add-interest-form'
import { LoanInquireAdvanceInterestFinesModal } from './forms/loan-inquire-advance-interest-fines-form'
import { LoanAmortizationModal } from './loan-amortization'
import { LoanViewSkeleton } from './skeletons/loan-view-skeleton'

interface LoanLedgerViewProps extends IClassProps {
    loanTransactionId: TEntityId
    defaultLoanTransaction?: ILoanTransaction
}

const LoanView = ({
    className,
    loanTransactionId,
    defaultLoanTransaction,
}: LoanLedgerViewProps) => {
    const {
        data = defaultLoanTransaction,
        isPending,
        isEnabled,
        error,
    } = useGetLoanTransactionById({
        id: loanTransactionId,
        options: {
            enabled: !!loanTransactionId,
            initialData: defaultLoanTransaction,
        },
    })

    const errorMessage = !isEnabled
        ? 'No valid loan transaction selected'
        : serverRequestErrExtractor({ error })

    return (
        <div className={cn('space-y-4 p-4 w-full ', className)}>
            {(isPending || !data) && isEnabled && <LoanViewSkeleton />}
            {data && (
                <>
                    <LoanLedgerHeader loanTransaction={data} />
                    <LoanDetails loanTransaction={data} />
                    <LoanLedgerTable className="h-[50vh] w-full rounded-lg" />
                    <LoanQuickSummary loanTransaction={data} />
                </>
            )}
            {errorMessage && (
                <FormErrorMessage
                    className="w-fit mx-auto"
                    errorMessage={errorMessage}
                />
            )}
        </div>
    )
}

// Header component
const LoanLedgerHeader = ({
    className,
    loanTransaction,
}: IClassProps & { loanTransaction: ILoanTransaction }) => {
    return (
        <div className={cn('', className)}>
            <div className="flex gap-2 w-full">
                <div className="space-y-2 shrink-0">
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            CV. <TicketIcon className="inline" />
                        </p>
                        <TextDisplay
                            noValueText="no voucher number set"
                            withCopy
                        >
                            {loanTransaction.voucher}
                        </TextDisplay>
                    </div>
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            Released <CalendarNumberIcon className="inline" />
                        </p>
                        <TextDisplay noValueText="no voucher number set">
                            {loanTransaction.released_date
                                ? toReadableDate(loanTransaction.released_date)
                                : undefined}
                        </TextDisplay>
                    </div>
                </div>
                <div className="flex grow justify-between gap-4 bg-gradient-to-r from-primary/20 to-card/10 ring-2 ring-card dark:ring-primary/40 rounded-xl p-4">
                    <div className="flex-shrink-0">
                        <PreviewMediaWrapper
                            media={loanTransaction.member_profile?.media}
                        >
                            <ImageDisplay
                                className="size-14 rounded-lg"
                                // fallback={memberProfile.first_name.charAt(0) ?? '-'}
                                fallback="S"
                                src={
                                    loanTransaction.member_profile?.media
                                        ?.download_url
                                }
                            />
                        </PreviewMediaWrapper>
                    </div>
                    <div className="space-y-2 grow">
                        <div className="flex gap-x-2">
                            <p className="text-lg">
                                {loanTransaction.member_profile?.full_name ||
                                    '...'}
                            </p>
                            <GeneralStatusBadge generalStatus="verified" />
                        </div>
                        <Separator />
                        <div className="flex justify-between flex-wrap space-x-5 text-xs">
                            <div className="shrink-0">
                                <h3 className="font-medium text-muted-foreground">
                                    Contact Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="400 size-3" />
                                    <span>
                                        {loanTransaction.member_profile
                                            ?.contact_number ? (
                                            <CopyWrapper>
                                                {
                                                    loanTransaction
                                                        .member_profile
                                                        .contact_number
                                                }
                                            </CopyWrapper>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <h3 className="font-medium text-muted-foreground">
                                    Passbook Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <IdCardIcon className="size-3" />
                                    <span className="font-mono text-xs">
                                        {loanTransaction.member_profile
                                            ?.passbook ? (
                                            <CopyWrapper>
                                                {
                                                    loanTransaction
                                                        .member_profile.passbook
                                                }
                                            </CopyWrapper>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <h3 className="font-medium text-muted-foreground">
                                    Member Type
                                </h3>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="size-3" />
                                    <span>
                                        {loanTransaction.member_profile
                                            ?.member_type?.name ? (
                                            <CopyWrapper>
                                                {
                                                    loanTransaction
                                                        .member_profile
                                                        .member_type.name
                                                }
                                            </CopyWrapper>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <h3 className="font-medium text-muted-foreground">
                                    Birthday
                                </h3>
                                <div className="flex items-center gap-2">
                                    <CakeIcon className="size-3" />
                                    <span>
                                        {loanTransaction.member_profile
                                            ?.birthdate ? (
                                            <CopyWrapper>
                                                {toReadableDate(
                                                    loanTransaction
                                                        .member_profile
                                                        .birthdate
                                                )}
                                            </CopyWrapper>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Loan Details Component
const LoanDetails = ({
    className,
    loanTransaction,
}: IClassProps & { loanTransaction: ILoanTransaction }) => {
    const {
        account,
        created_at,
        terms,
        applied_1,
        due_date,
        amount_granted,
        amortization_amount,
        add_on_amount,

        deducted_interest,

        unpaid_interest_amount,
        unpaid_principal_amount,
        unpaid_interest_count,
        unpaid_principal_count,

        principal_paid_count,
        interest_paid_count,

        advance_payment,
        used_days,
        unused_days,

        interest,
        arrears,
        fines,

        mode_of_payment,
        mode_of_payment_fixed_days,
        mode_of_payment_monthly_exact_day,
        mode_of_payment_weekly,

        mode_of_payment_semi_monthly_pay_1,
        mode_of_payment_semi_monthly_pay_2,
    } = loanTransaction

    const loanAmortizationModalState = useModalState()

    return (
        <div
            className={cn(
                'w-full flex gap-1 bg-popover text-sm justify-between p-4 rounded-lg',
                className
            )}
        >
            {/* Account Info & Dates */}
            <div className="space-y-2 min-w-[180px] px-4 border-l first:border-l-0">
                <p className="text-xs font-bold text-muted-foreground">
                    Account Info & Dates
                </p>
                <div className="space-y-2">
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Account :{' '}
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
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Entry Date:{' '}
                        <span className="px-2 py-1 rounded-md bg-secondary border border-border">
                            {created_at ? (
                                toReadableDate(created_at)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Due Date:
                        <span className="px-2 py-1 rounded-md bg-secondary border border-border">
                            {due_date ? (
                                toReadableDate(due_date)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Terms:
                        <span className="px-2 py-1 bg-accent rounded-md border border-border">
                            <span className="text-accent-foreground">
                                {typeof terms === 'number' ? (
                                    terms
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </span>{' '}
                            Mos
                        </span>
                    </div>
                </div>
            </div>

            {/* Loan Summary */}
            <div className="space-y-2 min-w-[180px] px-4 border-l first:border-l-0">
                <p className="text-xs font-bold text-muted-foreground">
                    Loan Summary
                </p>
                <LoanAmortizationModal
                    {...loanAmortizationModalState}
                    loanTransactionId={loanTransaction.id}
                />
                <div className="space-y-2">
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amount Applied:
                        <span className="px-2 py-1 rounded-md bg-primary/40 border border-primary text-primary-foreground font-mono text-xs">
                            {typeof applied_1 === 'number' ? (
                                formatNumber(applied_1, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amount Granted:
                        <span className="px-2 py-1 rounded-md border border-green-400/40 bg-green-300/20 text-green-400 font-mono text-xs">
                            {typeof amount_granted === 'number' ? (
                                formatNumber(amount_granted, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amortization:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof amortization_amount === 'number' ? (
                                formatNumber(amortization_amount, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Add-On Amount:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof add_on_amount === 'number' ? (
                                formatNumber(add_on_amount, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <Button
                        className="text-xs h-fit px-2 py-1 items-center"
                        hoverVariant="primary"
                        onClick={() =>
                            loanAmortizationModalState.onOpenChange(true)
                        }
                        size="sm"
                        variant="outline"
                    >
                        <CalendarNumberIcon className="inline size-3" /> View
                        Amort. Schedule
                    </Button>
                </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-2 min-w-[260px] px-4 border-l first:border-l-0">
                <p className="text-xs font-bold text-muted-foreground">
                    Payment Status
                </p>
                <div className="grid grid-cols-3 gap-2 items-center">
                    {/* Header Row */}
                    <span className="font-medium text-xs text-muted-foreground col-span-1">
                        Un-Paid
                    </span>
                    <span className="font-medium text-xs text-muted-foreground text-center">
                        Principal
                    </span>
                    <span className="font-medium text-xs text-muted-foreground text-center">
                        Interest
                    </span>

                    {/* Un-Paid Count */}
                    <span className="text-xs text-muted-foreground">
                        Count:
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {typeof unpaid_principal_count === 'number' ? (
                            formatNumber(unpaid_principal_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {typeof unpaid_interest_count === 'number' ? (
                            formatNumber(unpaid_interest_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>

                    {/* Un-Paid Amount */}
                    <span className="text-xs text-muted-foreground">
                        Amount:
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {typeof unpaid_principal_amount === 'number' ? (
                            formatNumber(unpaid_principal_amount, 2)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {typeof unpaid_interest_amount === 'number' ? (
                            formatNumber(unpaid_interest_amount, 2)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>

                    {/* Paid Count Row */}
                    <span className="font-medium text-xs text-muted-foreground col-span-1">
                        Paid Count:
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center col-span-1">
                        {typeof principal_paid_count === 'number' ? (
                            formatNumber(principal_paid_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center col-span-1">
                        {typeof interest_paid_count === 'number' ? (
                            formatNumber(interest_paid_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Deductions & Adjustments */}
            <div className="space-y-2 min-w-[180px] px-4 border-l first:border-l-0">
                <p className="text-xs font-bold text-muted-foreground">
                    Deductions & Adjustments
                </p>
                <div className="space-y-2">
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Deducted Interest:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof deducted_interest === 'number' ? (
                                formatNumber(deducted_interest, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Advance Payment:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof advance_payment === 'number' ? (
                                formatNumber(advance_payment, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Used Days:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs font-mono">
                            {typeof used_days === 'number' ? (
                                formatNumber(used_days, 0)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Unused Days:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof unused_days === 'number' ? (
                                formatNumber(unused_days, 0)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Penalties & Mode */}
            <div className="space-y-2 min-w-[180px] px-4 border-l first:border-l-0">
                <p className="text-xs font-bold text-muted-foreground">
                    Penalties & Mode
                </p>
                <div className="space-y-2">
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Arrears:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof arrears === 'number' ? (
                                formatNumber(arrears, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Interest:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof interest === 'number' ? (
                                formatNumber(interest, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Fines:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {typeof fines === 'number' ? (
                                formatNumber(fines, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Mode:
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
                    </div>
                    {mode_of_payment === 'day' && (
                        <div className="flex items-center text-muted-foreground text-xs gap-1">
                            Fixed Days :
                            <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                                {typeof mode_of_payment_fixed_days ===
                                'number' ? (
                                    mode_of_payment_fixed_days
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                    {mode_of_payment === 'monthly' && (
                        <div className="flex items-center text-muted-foreground text-xs gap-1">
                            Payment :
                            <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                                {typeof mode_of_payment_monthly_exact_day ===
                                'boolean' ? (
                                    mode_of_payment_monthly_exact_day ? (
                                        'Exact Day'
                                    ) : (
                                        'Every 30 Days'
                                    )
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                    {mode_of_payment === 'weekly' && (
                        <div className="flex items-center text-muted-foreground text-xs gap-1">
                            Payment :
                            <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                                {typeof mode_of_payment_weekly === 'string' ? (
                                    mode_of_payment_weekly
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                    {mode_of_payment === 'semi-monthly' && (
                        <>
                            <div className="flex items-center text-muted-foreground text-xs gap-1">
                                Payment 1:
                                <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                                    {typeof mode_of_payment_semi_monthly_pay_1 ===
                                    'string' ? (
                                        `Day ${mode_of_payment_semi_monthly_pay_1}`
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            ...
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center text-muted-foreground text-xs gap-1">
                                Payment 2:
                                <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                                    {typeof mode_of_payment_semi_monthly_pay_2 ===
                                    'string' ? (
                                        `Day ${mode_of_payment_semi_monthly_pay_2}`
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            ...
                                        </span>
                                    )}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// Quick Summary & Actions
const LoanQuickSummary = ({
    className,
    loanTransaction,
}: IClassProps & { loanTransaction: ILoanTransaction }) => {
    const calculatorModalState = useModalState()
    const addInterestModalState = useModalState()

    const {
        principal_paid,
        interest_paid,
        previous_interest_paid,
        previous_fines_paid,
        fines_paid,
        collection_progress,
        interest_amortization,
        total_amortization,
        first_irr,
        first_dq,
    } = loanTransaction

    const members_amount: { member_profile: IMemberProfile; amount: number }[] =
        []

    return (
        <div
            className={cn(
                'w-full flex gap-4 bg-popover text-sm justify-between p-4 rounded-lg',
                className
            )}
        >
            <LoanInquireAdvanceInterestFinesModal {...calculatorModalState} />
            <LoanAddInterestFormModal
                {...addInterestModalState}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                }}
            />

            {/* Members & Amount Table */}
            <Table wrapperClassName="flex-1 max-h-[200px] bg-secondary rounded-lg ecoop-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/3">Member</TableHead>
                        <TableHead className="w-1/3 text-right">
                            Amount
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members_amount.length === 0 ? (
                        <TableRow>
                            <TableCell
                                className="text-center text-xs text-muted-foreground h-24"
                                colSpan={2}
                            >
                                No data to display
                            </TableCell>
                        </TableRow>
                    ) : (
                        members_amount.map(
                            ({ member_profile, amount }, idx) => (
                                <TableRow key={member_profile?.id ?? idx}>
                                    <TableCell className="w-2/3">
                                        <div className="flex items-center gap-2">
                                            <ImageDisplay
                                                className="size-6 rounded-full"
                                                fallback={
                                                    member_profile?.full_name?.charAt(
                                                        0
                                                    ) ?? '?'
                                                }
                                                src={
                                                    member_profile?.media
                                                        ?.download_url
                                                }
                                            />
                                            <span className="truncate">
                                                {member_profile?.full_name ? (
                                                    member_profile.full_name
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        ...
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/3 text-right font-mono">
                                        {typeof amount === 'number' ? (
                                            formatNumber(amount, 2)
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        )
                    )}
                </TableBody>
            </Table>

            {/* Grouped Summary */}
            <div className="flex w-fit gap-8 overflow-clip">
                {/* Paid Group */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Principal Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof principal_paid === 'number' ? (
                                formatNumber(principal_paid, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Prev. Int. Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof previous_interest_paid === 'number' ? (
                                formatNumber(previous_interest_paid, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Prev. Fines Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof previous_fines_paid === 'number' ? (
                                formatNumber(previous_fines_paid, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Interest Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof interest_paid === 'number' ? (
                                formatNumber(interest_paid, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Fines Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof fines_paid === 'number' ? (
                                formatNumber(fines_paid, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            % Collection:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof collection_progress === 'number' ? (
                                `${formatNumber(collection_progress, 2)}%`
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Amortization Group */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Int. Amort:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof interest_amortization === 'number' ? (
                                formatNumber(interest_amortization, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Total Amort.:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-right">
                            {typeof total_amortization === 'number' ? (
                                formatNumber(total_amortization, 2)
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            First IRR:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs text-right">
                            {first_irr ? (
                                first_irr
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            First DQ:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs text-right">
                            {first_dq ? (
                                first_dq
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end justify-start min-w-[140px]">
                <Button
                    className="w-full flex gap-2 items-center"
                    onClick={() => calculatorModalState.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    <CalculatorIcon className="size-4" />
                    Calc. Advance Interest/Fines
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    onClick={() => addInterestModalState.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    <PlusIcon className="size-4" />
                    Add Interest
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    size="sm"
                    variant="secondary"
                >
                    <PrinterFillIcon className="size-4" />
                    Print Ledger
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    size="sm"
                    variant="secondary"
                >
                    <UndoIcon className="size-4" />
                    RePrint
                </Button>
            </div>
        </div>
    )
}

export const LoanViewModal = ({
    title = 'Loan Transaction Details',
    description = 'View loan transaction details and ledger.',
    className,
    loanTransactionId,
    defaultLoanTransaction,
    ...props
}: IModalProps & {
    loanTransactionId: string
    defaultLoanTransaction?: ILoanTransaction
}) => {
    return (
        <Modal
            className={cn('!max-w-[95vw]', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanView
                className="p-0"
                defaultLoanTransaction={defaultLoanTransaction}
                loanTransactionId={loanTransactionId}
            />
        </Modal>
    )
}

export default LoanView
