import { cn, formatNumber } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import AccountBadge from '@/modules/account/components/badges/account-badge'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'
import LoanLedgerTable from '@/modules/loan-ledger/components/loan-ledger-table'
import { TLoanModeOfPayment } from '@/modules/loan-transaction'
import LoanModeOfPaymentBadge from '@/modules/loan-transaction/components/loan-mode-of-payment-badge'
import { IMedia } from '@/modules/media'

import {
    CakeIcon,
    CalculatorIcon,
    CalendarNumberIcon,
    IdCardIcon,
    PhoneIcon,
    PrinterFillIcon,
    TicketIcon,
    TrashIcon,
    UndoIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import TextDisplay from '@/components/text-display'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IClassProps } from '@/types'

interface LoanLedgerViewProps extends IClassProps {}

const LoanView = ({ className }: LoanLedgerViewProps) => {
    return (
        <div className={cn('space-y-4 p-4 w-full ', className)}>
            <LoanLedgerHeader />
            <LoanDetails />
            {/* TODO: LOAN LEDGER */}
            <LoanLedgerTable className="h-[50vh] w-full rounded-lg" />
            <LoanQuickSummary />
        </div>
    )
}

// Header component
const LoanLedgerHeader = ({ className }: IClassProps) => {
    return (
        <div className={cn('', className)}>
            <div className="flex gap-2 w-full">
                <div className="space-y-2 shrink-0">
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            CV. <TicketIcon className="inline" />
                        </p>
                        <TextDisplay
                            withCopy
                            noValueText="no voucher number set"
                        >
                            {'VCH-0001'}
                        </TextDisplay>
                    </div>
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            Released <CalendarNumberIcon className="inline" />
                        </p>
                        <TextDisplay noValueText="no voucher number set">
                            {toReadableDate(new Date())}
                        </TextDisplay>
                    </div>
                </div>
                <div className="flex grow justify-between gap-4 bg-gradient-to-r from-primary/20 to-card/10 ring-2 ring-card dark:ring-primary/40 rounded-xl p-4">
                    <div className="flex-shrink-0">
                        <PreviewMediaWrapper
                            media={
                                {
                                    download_url:
                                        'https://images.steamusercontent.com/ugc/782997563734263013/37F53DD1BE90A35F44F6235C2841D75FB58E54B3/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
                                } as IMedia
                            }
                        >
                            <ImageDisplay
                                className="size-14 rounded-lg"
                                src={
                                    'https://images.steamusercontent.com/ugc/782997563734263013/37F53DD1BE90A35F44F6235C2841D75FB58E54B3/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
                                }
                                // fallback={memberProfile.first_name.charAt(0) ?? '-'}
                                fallback="S"
                            />
                        </PreviewMediaWrapper>
                    </div>
                    <div className="space-y-2 grow">
                        <div className="flex gap-x-2">
                            <p className="text-lg">Steve M Character</p>
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
                                        <CopyWrapper>+639123456789</CopyWrapper>
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
                                        <CopyWrapper>MBR-0001</CopyWrapper>
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
                                        {true ? (
                                            <CopyWrapper>Regular</CopyWrapper>
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
                                        {new Date() ? (
                                            <CopyWrapper>
                                                {toReadableDate(new Date())}
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

const mockLoanDetails = {
    account: {
        icon: 'Rocket',
        name: 'Kaban Ng Bayan',
    },
    entryDate: new Date(),
    dueDate: new Date(),
    terms: 12,
    amountApplied: 5000,
    amountGranted: 5000,
    amortization: 417,
    addOnAmount: 0,
    paymentStatus: {
        unpaidPrincipalCount: 0,
        unpaidPrincipalAmount: 0,
        unpaidInterestCount: 0,
        unpaidInterestAmount: 0,
        paidCount: 0,
    },
    deductions: {
        deductedInterest: 0,
        advancePayment: 0,
        usedDays: 0,
        unusedDays: 0,
    },
    penalties: {
        arrears: 0,
        interest: 0,
        fines: 0,
        mode: 'monthly',
    },
}

// Loan Details Component
const LoanDetails = ({ className }: IClassProps) => {
    const {
        entryDate,
        dueDate,
        terms,
        amountApplied,
        amountGranted,
        amortization,
        addOnAmount,
        paymentStatus,
        deductions,
        penalties,
    } = mockLoanDetails

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
                        <AccountBadge
                            size="sm"
                            variant="primary"
                            icon="Rocket"
                            name="Kaban Ng Bayan"
                        />
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Entry Date:{' '}
                        <span className="px-2 py-1 rounded-md bg-secondary border border-border">
                            {entryDate ? toReadableDate(entryDate) : '...'}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Due Date:
                        <span className="px-2 py-1 rounded-md bg-secondary border border-border">
                            {dueDate ? toReadableDate(dueDate) : '...'}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Terms:
                        <span className="px-2 py-1 bg-accent rounded-md border border-border">
                            <span className="text-accent-foreground">
                                {terms ?? '...'}
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
                <div className="space-y-2">
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amount Applied:
                        <span className="px-2 py-1 rounded-md bg-primary/40 border border-primary text-primary-foreground font-mono text-xs">
                            {formatNumber(amountApplied ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amount Granted:
                        <span className="px-2 py-1 rounded-md border border-green-400/40 bg-green-300/20 text-green-400 font-mono text-xs">
                            {formatNumber(amountGranted ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Amortization:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(amortization ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Add-On Amount:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(addOnAmount ?? 0, 2)}
                        </span>
                    </div>
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
                        {formatNumber(
                            paymentStatus.unpaidPrincipalCount ?? 0,
                            0
                        )}
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {formatNumber(
                            paymentStatus.unpaidInterestCount ?? 0,
                            0
                        )}
                    </span>

                    {/* Un-Paid Amount */}
                    <span className="text-xs text-muted-foreground">
                        Amount:
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {formatNumber(
                            paymentStatus.unpaidPrincipalAmount ?? 0,
                            2
                        )}
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center">
                        {formatNumber(
                            paymentStatus.unpaidInterestAmount ?? 0,
                            2
                        )}
                    </span>

                    {/* Paid Count Row */}
                    <span className="font-medium text-xs text-muted-foreground col-span-1">
                        Paid Count:
                    </span>
                    <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs text-center col-span-2">
                        {formatNumber(paymentStatus.paidCount ?? 0, 0)}
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
                            {formatNumber(deductions.deductedInterest ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Advance Payment:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(deductions.advancePayment ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Used Days:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs font-mono">
                            {formatNumber(deductions.usedDays ?? 0, 0)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Unused Days:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(deductions.unusedDays ?? 0, 0)}
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
                            {formatNumber(penalties.arrears ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Interest:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(penalties.interest ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Fines:
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs">
                            {formatNumber(penalties.fines ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex text-muted-foreground text-xs items-center gap-1">
                        Mode:
                        <LoanModeOfPaymentBadge
                            mode={
                                (penalties.mode as TLoanModeOfPayment) ?? '...'
                            }
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const quickSummaryMock = {
    principalPaid: 500,
    interestPaid: 0,
    prevInterestPaid: 0,
    prevFinesPaid: 0,
    finesPaid: 0,
    percentCollection: 0.1,
    intAmort: 0,
    totalAmort: 417,
    firstIRR: '',
    firstDQ: '',
}

const LoanQuickSummary = ({ className }: IClassProps) => {
    const {
        principalPaid,
        interestPaid,
        prevInterestPaid,
        prevFinesPaid,
        finesPaid,
        percentCollection,
        intAmort,
        totalAmort,
        firstIRR,
        firstDQ,
    } = quickSummaryMock

    return (
        <div
            className={cn(
                'w-full flex gap-4 bg-popover text-sm justify-between p-4 rounded-lg',
                className
            )}
        >
            {/* Grouped Summary */}
            <div className="flex justify-end gap-8 flex-1">
                {/* Paid Group */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Principal Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(principalPaid ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Prev. Int. Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(prevInterestPaid ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Prev. Fines Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(prevFinesPaid ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Interest Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(interestPaid ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Fines Paid:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(finesPaid ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            % Collection:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(percentCollection ?? 0, 2)}%
                        </span>
                    </div>
                </div>

                {/* Amortization Group */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Int. Amort:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(intAmort ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            Total Amort.:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary font-mono text-xs min-w-[80px] text-right">
                            {formatNumber(totalAmort ?? 0, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            First IRR:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs min-w-[80px] text-right">
                            {firstIRR || '...'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-semibold">
                            First DQ:
                        </span>
                        <span className="px-2 py-1 rounded-md border border-border bg-secondary text-xs min-w-[80px] text-right">
                            {firstDQ || '...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end justify-start min-w-[140px]">
                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full flex gap-2 items-center"
                >
                    <CalculatorIcon className="size-4" />
                    Add Interest
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full flex gap-2 items-center"
                >
                    <TrashIcon className="size-4" />
                    Change Line#
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full flex gap-2 items-center"
                >
                    <PrinterFillIcon className="size-4" />
                    Print Ledger
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full flex gap-2 items-center"
                >
                    <UndoIcon className="size-4" />
                    RePrint
                </Button>
            </div>
        </div>
    )
}

export default LoanView
