import { ReactNode } from 'react'

import { toast } from 'sonner'

import { cn, formatNumber } from '@/helpers'
import {
    dateAgo,
    toReadableDate,
    toReadableDateTime,
} from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import AccountBadge from '@/modules/account/components/badges/account-badge'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'
import { currencyFormat } from '@/modules/currency'
import {
    ILoanTransaction,
    TLoanModeOfPayment,
    useGetLoanTransactionById,
    useProcessLoanTransactionById,
} from '@/modules/loan-transaction'
import { IMemberProfile } from '@/modules/member-profile'

import {
    CakeIcon,
    CalculatorIcon,
    CalendarNumberIcon,
    FileFillIcon,
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
import LoadingSpinner from '@/components/spinners/loading-spinner'
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
import LoanLedgerTableView from './loan-ledger-table/loan-ledger-table'
import LoanModeOfPaymentBadge from './loan-mode-of-payment-badge'
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

    const { isPending: isProcessing, mutateAsync: processLoanTransaction } =
        useProcessLoanTransactionById()

    return (
        <div className={cn('space-y-4 p-4 w-full', className)}>
            {errorMessage && (
                <FormErrorMessage
                    className="mx-auto"
                    errorMessage={errorMessage}
                />
            )}
            {(isPending || !data) && isEnabled && <LoanViewSkeleton />}
            {data && (
                <>
                    <LoanLedgerHeader loanTransaction={data} />
                    <div className="flex justify-end items-center">
                        <Button
                            className=""
                            disabled={isProcessing}
                            onClick={() =>
                                toast.promise(processLoanTransaction(data.id), {
                                    loading: 'Processing loan...',
                                    error: 'Failed to process loan.',
                                    success: 'Loan has been processed.',
                                })
                            }
                            size="sm"
                        >
                            {isProcessing ? (
                                <LoadingSpinner />
                            ) : (
                                <FileFillIcon />
                            )}{' '}
                            Process Loan
                        </Button>
                    </div>
                    <LoanDetails loanTransaction={data} />
                    <LoanLedgerTableView
                        className="h-[50vh] w-full rounded-lg"
                        loanTransactionId={loanTransactionId}
                    />
                    <LoanQuickSummary loanTransaction={data} />
                </>
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
                            <TicketIcon className="inline mr-1" />
                            Check Voucher
                        </p>
                        <TextDisplay
                            noValueText="no voucher number set"
                            withCopy
                        >
                            {loanTransaction.check_number}
                        </TextDisplay>
                    </div>
                    <div className="bg-secondary  px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            Released <CalendarNumberIcon className="inline" />
                        </p>
                        <TextDisplay noValueText="no voucher number set">
                            {loanTransaction.released_date
                                ? `${toReadableDateTime(loanTransaction.released_date)}`
                                : undefined}
                        </TextDisplay>
                        <span className="text-xs text-muted-foreground block">
                            {loanTransaction.released_date
                                ? `${dateAgo(loanTransaction.released_date)}`
                                : undefined}
                        </span>
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
        amortization,
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
                'w-full flex gap-1 bg-popover border border-border overflow-x-auto ecoop-scroll justify-between text-sm p-4 rounded-lg',
                className
            )}
        >
            {/* Account Info & Dates */}
            <LoanInfoSection
                className="min-w-[250px]"
                title="Account Info & Dates"
            >
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
                    <InfoValue>
                        {created_at ? (
                            toReadableDate(created_at)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Due Date:</InfoLabel>
                    <InfoValue>
                        {due_date ? (
                            toReadableDate(due_date)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Terms:</InfoLabel>
                    <InfoValue className="bg-accent">
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
                    </InfoValue>
                </LoanInfoItem>
            </LoanInfoSection>

            {/* Loan Summary */}
            <LoanInfoSection title="Loan Summary">
                <LoanAmortizationModal
                    {...loanAmortizationModalState}
                    loanTransactionId={loanTransaction.id}
                />

                <LoanInfoItem>
                    <InfoLabel>Amount Applied:</InfoLabel>
                    <InfoValue className="bg-primary/80 border-primary text-primary-foreground font-mono">
                        {typeof applied_1 === 'number' ? (
                            currencyFormat(applied_1, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Amount Granted:</InfoLabel>
                    <InfoValue className="border-green-400/40 bg-green-300/20 text-green-400 font-mono">
                        {typeof amount_granted === 'number' ? (
                            currencyFormat(amount_granted, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Amortization:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof amortization === 'number' ? (
                            currencyFormat(amortization, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Add-On Amount:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof add_on_amount === 'number' ? (
                            currencyFormat(add_on_amount, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <Button
                    className="text-xs h-fit px-2 py-1 items-center"
                    hoverVariant="primary"
                    onClick={() =>
                        loanAmortizationModalState.onOpenChange(true)
                    }
                    size="sm"
                    variant="outline"
                >
                    <CalendarNumberIcon className="inline size-3" /> View Amort.
                    Schedule
                </Button>
            </LoanInfoSection>

            {/* Payment Status */}
            <LoanInfoSection className="min-w-[260px]" title="Payment Status">
                <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="font-medium text-xs text-muted-foreground col-span-1">
                        Un-Paid
                    </span>
                    <span className="font-medium text-xs text-muted-foreground text-center">
                        Principal
                    </span>
                    <span className="font-medium text-xs text-muted-foreground text-center">
                        Interest
                    </span>

                    <InfoLabel>Count:</InfoLabel>
                    <InfoValue className="font-mono text-center">
                        {typeof unpaid_principal_count === 'number' ? (
                            formatNumber(unpaid_principal_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                    <InfoValue className="font-mono text-center">
                        {typeof unpaid_interest_count === 'number' ? (
                            formatNumber(unpaid_interest_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>

                    <InfoLabel>Amount:</InfoLabel>
                    <InfoValue className="font-mono text-center">
                        {typeof unpaid_principal_amount === 'number' ? (
                            currencyFormat(unpaid_principal_amount, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                    <InfoValue className="font-mono text-center">
                        {typeof unpaid_interest_amount === 'number' ? (
                            currencyFormat(unpaid_interest_amount, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>

                    <span className="font-medium text-xs text-muted-foreground col-span-1">
                        Paid Count:
                    </span>
                    <InfoValue className="font-mono text-center col-span-1">
                        {typeof principal_paid_count === 'number' ? (
                            formatNumber(principal_paid_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                    <InfoValue className="font-mono text-center col-span-1">
                        {typeof interest_paid_count === 'number' ? (
                            formatNumber(interest_paid_count, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </div>
            </LoanInfoSection>

            {/* Deductions & Adjustments */}
            <LoanInfoSection
                className="min-w-[200px]"
                title="Deductions & Adjustments"
            >
                <LoanInfoItem>
                    <InfoLabel>Deducted Interest:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof deducted_interest === 'number' ? (
                            currencyFormat(deducted_interest, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Advance Payment:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof advance_payment === 'number' ? (
                            currencyFormat(advance_payment, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Used Days:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof used_days === 'number' ? (
                            formatNumber(used_days, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Unused Days:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof unused_days === 'number' ? (
                            formatNumber(unused_days, 0)
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>
            </LoanInfoSection>

            {/* Penalties & Mode */}
            <LoanInfoSection className="min-w-[200px]" title="Penalties & Mode">
                <LoanInfoItem>
                    <InfoLabel>Arrears:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof arrears === 'number' ? (
                            currencyFormat(arrears, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Interest:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof interest === 'number' ? (
                            currencyFormat(interest, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

                <LoanInfoItem>
                    <InfoLabel>Fines:</InfoLabel>
                    <InfoValue className="font-mono">
                        {typeof fines === 'number' ? (
                            currencyFormat(fines, {
                                currency: loanTransaction.account?.currency,
                                showSymbol: !!loanTransaction.account?.currency,
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                ...
                            </span>
                        )}
                    </InfoValue>
                </LoanInfoItem>

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
                        <InfoValue className="font-mono">
                            {typeof mode_of_payment_fixed_days === 'number' ? (
                                mode_of_payment_fixed_days
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </InfoValue>
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'monthly' && (
                    <LoanInfoItem>
                        <InfoLabel>Payment:</InfoLabel>
                        <InfoValue className="font-mono">
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
                        </InfoValue>
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'weekly' && (
                    <LoanInfoItem>
                        <InfoLabel>Payment:</InfoLabel>
                        <InfoValue className="font-mono">
                            {typeof mode_of_payment_weekly === 'string' ? (
                                mode_of_payment_weekly
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </InfoValue>
                    </LoanInfoItem>
                )}

                {mode_of_payment === 'semi-monthly' && (
                    <>
                        <LoanInfoItem>
                            <InfoLabel>Payment 1:</InfoLabel>
                            <InfoValue className="font-mono">
                                {typeof mode_of_payment_semi_monthly_pay_1 ===
                                'string' ? (
                                    `Day ${mode_of_payment_semi_monthly_pay_1}`
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </InfoValue>
                        </LoanInfoItem>
                        <LoanInfoItem>
                            <InfoLabel>Payment 2:</InfoLabel>
                            <InfoValue className="font-mono">
                                {typeof mode_of_payment_semi_monthly_pay_2 ===
                                'string' ? (
                                    `Day ${mode_of_payment_semi_monthly_pay_2}`
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        ...
                                    </span>
                                )}
                            </InfoValue>
                        </LoanInfoItem>
                    </>
                )}
            </LoanInfoSection>
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
        amortization,
        first_irr,
        first_dq,
    } = loanTransaction

    const members_amount: { member_profile: IMemberProfile; amount: number }[] =
        []

    return (
        <div
            className={cn(
                'w-full flex gap-4 border border-border bg-popover text-sm justify-between p-4 rounded-lg',
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
                                            currencyFormat(amount, {
                                                currency:
                                                    loanTransaction.account
                                                        ?.currency,
                                                showSymbol:
                                                    !!loanTransaction.account
                                                        ?.currency,
                                            })
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
                                currencyFormat(principal_paid, {
                                    currency: loanTransaction.account?.currency,
                                    showSymbol:
                                        !!loanTransaction.account?.currency,
                                })
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
                                currencyFormat(previous_interest_paid, {
                                    currency: loanTransaction.account?.currency,
                                    showSymbol:
                                        !!loanTransaction.account?.currency,
                                })
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
                                currencyFormat(previous_fines_paid, {
                                    currency: loanTransaction.account?.currency,
                                    showSymbol:
                                        !!loanTransaction.account?.currency,
                                })
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
                                currencyFormat(interest_paid, {
                                    currency: loanTransaction.account?.currency,
                                    showSymbol:
                                        !!loanTransaction.account?.currency,
                                })
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
                                currencyFormat(fines_paid, {
                                    currency: loanTransaction.account?.currency,
                                    showSymbol:
                                        !!loanTransaction.account?.currency,
                                })
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
                            {typeof amortization === 'number' ? (
                                formatNumber(amortization, 2)
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
            closeButtonClassName="top-1 right-1"
            description={description}
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <LoanView
                className="p-0 max-w-full min-w-0"
                defaultLoanTransaction={defaultLoanTransaction}
                loanTransactionId={loanTransactionId}
            />
        </Modal>
    )
}

export default LoanView

const LoanInfoItem = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return (
        <div
            className={cn(
                'flex text-muted-foreground text-xs items-center gap-1',
                className
            )}
        >
            {children}
        </div>
    )
}

const InfoLabel = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return <span className={cn('text-nowrap', className)}>{children}</span>
}

const InfoValue = ({
    className,
    children,
}: IClassProps & {
    children: ReactNode
}) => {
    return (
        <span
            className={cn(
                'px-2 py-1 rounded-md bg-secondary border border-border',
                className
            )}
        >
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
                'space-y-2 px-4 border-l first:border-l-0',
                className
            )}
        >
            {title && (
                <p
                    className={cn(
                        'text-xs font-bold text-nowrap text-muted-foreground',
                        titleClassName
                    )}
                >
                    {title}
                </p>
            )}
            <div className="space-y-2">{children}</div>
        </div>
    )
}
