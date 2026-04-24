import { cn } from '@/helpers'
import {
    ArrowLeftRight,
    BadgeDollarSign,
    BarChart3,
    BookOpen,
    Calculator,
    ClipboardList,
    Clock,
    Coins,
    CreditCard,
    DollarSign,
    FileBarChart,
    FileClock,
    FileText,
    FileX,
    Hash,
    Layers,
    ListChecks,
    Monitor,
    Percent,
    Receipt,
    ReceiptText,
    Scale,
    ScrollText,
    Shield,
    ShoppingCart,
    TrendingDown,
    UserCheck,
    Vote,
    Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AccountBalanceCreateReportFormModal } from './forms/account-balance-create-report-form'
import { AccountHoldOutCreateReportFormModal } from './forms/account-holdout-create-report-form'
import { AdjustmentCreateReportFormModal } from './forms/adjustment-create-report-form'
import { CashCheckDisbursementCreateReportFormModal } from './forms/cash-check-disbursement-create-report-form'
import { CloseAccountCreateReportFormModal } from './forms/close-account-create-report-form'
import { ComakerCreateReportFormModal } from './forms/comaker-create-report-form'
import { DailyCashCollectionReceiptJournalCreateReportFormModal } from './forms/daily-cash-receipt-create-report-form'
import { DailyCollectionDetailCreateReportFormModal } from './forms/daily-collection-detail-create-report-form'
import { DailyCollectionSummaryCreateReportFormModal } from './forms/daily-collection-summary-create-report-fom'
import { DailyWithdrawalCreateReportFormModal } from './forms/daily-withdrawal-create-report-form'
import { DepositBalancesCreateReportFormModal } from './forms/deposit-balances-create-report-form'
import { DirectAdjustmentCreateReportFormModal } from './forms/direct-adjustment-create-report-form'
import { EarnedUnearnedCreateReportFormModal } from './forms/earned-unearned-create-report-form'
import { GroceryLoanReleaseCreateReportFormModal } from './forms/grocery-loan-release-create-report-form'
import { ICPRCreateReportFormModal } from './forms/icpr-create-report-form'
import { InterestOnShareCapitalCreateReportFormModal } from './forms/interest-share-capital-create-report-form'
import { JournalVoucherCreateReportFormModal } from './forms/journal-voucher-create-report-form'
import { LedgerCreateReportFormModal } from './forms/ledger-create-report-form'
import { LoanBalancesCreateReportFormModal } from './forms/loan-balances-create-report-form'
import { LoanCollectionDetailCreateReportFormModal } from './forms/loan-collection-detail-create-report-form'
import { LoanCollectionDueCreateReportFormModal } from './forms/loan-collection-due-create-report-form'
import { LoanCollectionSummaryCreateReportFormModal } from './forms/loan-collection-summary-create-report-form'
import { LoanMaturityCreateReportFormModal } from './forms/loan-maturity-create-report-form'
import { LoanProtectionPlanCreateReportFormModal } from './forms/loan-protection-place-create-report-form'
import { LoanReceivableCreateReportFormModal } from './forms/loan-receivable-create-report-form'
import { LoanReleaseDetailCreateReportFormModal } from './forms/loan-release-detail-create-report-form'
import { LoanReleaseSummaryCreateReportFormModal } from './forms/loan-release-summary-create-report-form'
import { LoanReleaseCreateReportFormModal } from './forms/loan-release-tabulated-create-report-form'
import { LoanStatementCreateReportFormModal } from './forms/loan-statement-create-report-form'
import { MemberListingCreateReportFormModal } from './forms/member-listing-create-report-form'
import { PrintNumberTagCreateReportFormModal } from './forms/number-tag-create-report-form'
import { OtherFundsEntryCreateReportFormModal } from './forms/other-funds-entry-create-report-form'
import { PastDueOnInstallmentCreateReportFormModal } from './forms/past-due-on-installment-create-report-form'
import { PortfolioAtRiskCreateReportFormModal } from './forms/portfolio-at-risk-create-report-form'
import { ProofOfPurchaseCreateReportFormModal } from './forms/proof-of-purchase-create-report-form'
import { RebateCreateReportFormModal } from './forms/rebate-create-report-form'
import { ShareCapitalWithdrawalCreateReportFormModal } from './forms/share-capital-withdrawal-create-report-form'
import { StatementOfDepositsCreateReportFormModal } from './forms/statement-of-account-create-report-form'
import { SubscriptionFeeCreateReportFormModal } from './forms/subscription-fee-create-report-form'
import { SupposedActualCollectionCreateReportFormModal } from './forms/supposed-actual-collection-create-report-form'
import { TellerMonitoringCreateReportFormModal } from './forms/teller-monitoring-create-report-form'
import { TimeDepositAccruedInterestCreateReportFormModal } from './forms/time-deposit-accrued-interest-create-report-form'
import { TimeDepositBalanceCreateReportFormModal } from './forms/time-deposit-balance-create-report-form'
import { TimeDepositBalanceYTDCreateReportFormModal } from './forms/time-deposit-balance-ytd-create-report-form'
import { TimeDepositCreateReportFormModal } from './forms/time-deposit-create-report-form'
import { TransactionBatchCreateReportFormModal } from './forms/transaction-batch-create-report-form'

interface ReportItem {
    label: string
    icon: React.ElementType
    component?: React.ElementType<{
        trigger: React.ReactNode
        formProps?: object
    }>
    persistKey?: string
}

const COLLECTION_GROUP: ReportItem[] = [
    {
        label: 'Daily Collection Detail',
        icon: FileText,
        component: DailyCollectionDetailCreateReportFormModal,
        persistKey: 'form-report-collections-daily-coll-detail',
    },
    {
        label: 'Daily Collection Summary',
        icon: ClipboardList,
        component: DailyCollectionSummaryCreateReportFormModal,
        persistKey: 'form-report-collections-daily-coll-summary',
    },
    {
        label: 'Cash Receipt Journal',
        icon: Receipt,
        component: DailyCashCollectionReceiptJournalCreateReportFormModal,
        persistKey: 'form-report-accounting-cash-receipt-journal',
    },
]

const DISBURSEMENT_GROUP: ReportItem[] = [
    {
        label: 'Daily Withdrawal',
        icon: ArrowLeftRight,
        component: DailyWithdrawalCreateReportFormModal,
        persistKey: 'form-report-deposits-daily-withdrawal',
    },
    {
        label: 'Time Deposit',
        icon: Clock,
        component: TimeDepositCreateReportFormModal,
        persistKey: 'form-report-deposits-time-deposit',
    },
]

const CASH_CHECK_VOUCHER_GROUP: ReportItem[] = [
    {
        label: 'Cash Disbursement',
        icon: CreditCard,
        component: CashCheckDisbursementCreateReportFormModal,
        persistKey: 'form-report-accounting-cash-disbursement',
    },
]

const LOAN_RELEASES_GROUP: ReportItem[] = [
    {
        label: 'Loan Release Tabulated',
        icon: BarChart3,
        component: LoanReleaseCreateReportFormModal,
        persistKey: 'form-report-loans-loan-release-tabulated',
    },
    {
        label: 'Loan Release Detail',
        icon: ScrollText,
        component: LoanReleaseDetailCreateReportFormModal,
        persistKey: 'form-report-loans-loan-release-detail',
    },
    {
        label: 'Loan Release Summary',
        icon: FileText,
        component: LoanReleaseSummaryCreateReportFormModal,
        persistKey: 'form-report-loans-loan-release-summary',
    },
    {
        label: 'Grocery Loan Release',
        icon: ShoppingCart,
        component: GroceryLoanReleaseCreateReportFormModal,
        persistKey: 'form-report-loans-grocery-loan-release',
    },
]

const JOURNAL_GROUP: ReportItem[] = [
    {
        label: 'Journal Voucher',
        icon: FileText,
        component: JournalVoucherCreateReportFormModal,
        persistKey: 'form-report-accounting-journal-voucher',
    },
    {
        label: 'Adjustment',
        icon: Calculator,
        component: AdjustmentCreateReportFormModal,
        persistKey: 'form-report-accounting-adjustment',
    },
    {
        label: 'Rebates',
        icon: DollarSign,
        component: RebateCreateReportFormModal,
        persistKey: 'form-report-other-rebates',
    },
    {
        label: 'ICPR',
        icon: ReceiptText,
        component: ICPRCreateReportFormModal,
        persistKey: 'form-report-accounting-icpr',
    },
]

const FUNDS_GROUP: ReportItem[] = [
    {
        label: 'Transaction Batch',
        icon: ClipboardList,
        component: TransactionBatchCreateReportFormModal,
        persistKey: 'form-report-accounting-transaction-batch',
    },
    {
        label: 'Cash Position Report',
        icon: ClipboardList,
    },
    {
        label: 'Revolving Fund',
        icon: ClipboardList,
    },
    {
        label: 'Other Funds Entry / Petty Cash',
        icon: Coins,
        component: OtherFundsEntryCreateReportFormModal,
        persistKey: 'form-report-other-funds-entry',
    },
]

const MEMBERS_GROUP: ReportItem[] = [
    {
        label: 'Member Listing',
        icon: ListChecks,
        component: MemberListingCreateReportFormModal,
        persistKey: 'form-report-member-listing',
    },
    {
        label: 'Statement of Account',
        icon: ReceiptText,
        component: StatementOfDepositsCreateReportFormModal,
        persistKey: 'form-report-statement-of-account',
    },
    {
        label: 'Ledger',
        icon: BookOpen,
        component: LedgerCreateReportFormModal,
        persistKey: 'form-report-accounting-ledger',
    },
    {
        label: 'Voters List',
        icon: Vote,
        persistKey: 'form-report-voters-list',
    },
    {
        label: 'Close Account',
        icon: FileX,
        component: CloseAccountCreateReportFormModal,
        persistKey: 'form-report-close-account',
    },
]

const LOAN_COLLECTION_GROUP: ReportItem[] = [
    {
        label: 'Loan Collection Detail',
        icon: ScrollText,
        component: LoanCollectionDetailCreateReportFormModal,
        persistKey: 'form-report-collections-loan-collection-detail',
    },
    {
        label: 'Loan Collection Summary',
        icon: FileBarChart,
        component: LoanCollectionSummaryCreateReportFormModal,
        persistKey: 'form-report-collections-loan-collection-summary',
    },
    {
        label: 'Loan Collection Due',
        icon: Clock,
        component: LoanCollectionDueCreateReportFormModal,
        persistKey: 'form-report-collections-loan-collection-due',
    },
]

const TIME_DEPOSIT_GROUP: ReportItem[] = [
    {
        label: 'TD Balance',
        icon: DollarSign,
        component: TimeDepositBalanceCreateReportFormModal,
        persistKey: 'form-report-deposits-td-balance',
    },
    {
        label: 'TD Bal / YTD',
        icon: BarChart3,
        component: TimeDepositBalanceYTDCreateReportFormModal,
        persistKey: 'form-report-deposits-td-bal-ytd',
    },
    {
        label: 'TD Accrued',
        icon: Percent,
        component: TimeDepositAccruedInterestCreateReportFormModal,
        persistKey: 'form-report-deposits-td-accrued',
    },
]

const SCHEDULE_BALANCES_GROUP: ReportItem[] = [
    {
        label: 'Account Balance',
        icon: Wallet,
        component: AccountBalanceCreateReportFormModal,
        persistKey: 'form-report-account-balance',
    },
    {
        label: 'Deposit Balances',
        icon: Coins,
        component: DepositBalancesCreateReportFormModal,
        persistKey: 'form-report-deposits-deposit-balances',
    },
    {
        label: 'Subscription Fee',
        icon: BadgeDollarSign,
        component: SubscriptionFeeCreateReportFormModal,
        persistKey: 'form-report-share-capital-subscription-fee',
    },
    {
        label: 'Share Capital Withdrawal',
        icon: ArrowLeftRight,
        component: ShareCapitalWithdrawalCreateReportFormModal,
        persistKey: 'form-report-share-capital-withdrawal',
    },
    {
        label: 'Loan Balances',
        icon: Scale,
        component: LoanBalancesCreateReportFormModal,
        persistKey: 'form-report-loans-loan-balances',
    },
    {
        label: 'Loan Statement',
        icon: FileBarChart,
        component: LoanStatementCreateReportFormModal,
        persistKey: 'form-report-loans-loan-statement',
    },
    {
        label: 'Loan Maturity',
        icon: FileClock,
        component: LoanMaturityCreateReportFormModal,
        persistKey: 'form-report-loans-loan-maturity',
    },
    {
        label: 'Portfolio at Risk',
        icon: Shield,
        component: PortfolioAtRiskCreateReportFormModal,
        persistKey: 'form-report-loans-portfolio-at-risk',
    },
    {
        label: 'Past Due on Installment',
        icon: TrendingDown,
        component: PastDueOnInstallmentCreateReportFormModal,
        persistKey: 'form-report-loans-past-due-installment',
    },
    {
        label: 'Loan Receivable',
        icon: Receipt,
        component: LoanReceivableCreateReportFormModal,
        persistKey: 'form-report-loans-loan-receivable',
    },
    {
        label: 'Supposed / Actual',
        icon: Scale,
        component: SupposedActualCollectionCreateReportFormModal,
        persistKey: 'form-report-other-supposed-actual',
    },
    {
        label: 'Earned / Unearned',
        icon: Layers,
        component: EarnedUnearnedCreateReportFormModal,
        persistKey: 'form-report-share-capital-earned-unearned',
    },
    {
        label: 'Comaker',
        icon: UserCheck,
        component: ComakerCreateReportFormModal,
        persistKey: 'form-report-loans-comaker',
    },
    {
        label: 'CLPP',
        icon: FileText,
        component: LoanProtectionPlanCreateReportFormModal,
        persistKey: 'form-report-loans-loan-protection-plan',
    },
    {
        label: 'Grocery Loan',
        icon: ShoppingCart,
        component: GroceryLoanReleaseCreateReportFormModal,
        persistKey: 'form-report-loans-grocery-loan-release',
    },
    {
        label: 'Proof of Purchase',
        icon: ShoppingCart,
        component: ProofOfPurchaseCreateReportFormModal,
        persistKey: 'form-report-other-proof-of-purchase',
    },
    {
        label: 'Interest on Share Capital',
        icon: Percent,
        component: InterestOnShareCapitalCreateReportFormModal,
        persistKey: 'form-report-share-capital-interest',
    },
]

const OTHER_REPORTS_GROUP: ReportItem[] = [
    {
        label: 'Direct Adjustment',
        icon: Calculator,
        component: DirectAdjustmentCreateReportFormModal,
        persistKey: 'form-report-accounting-direct-adjustment',
    },
    {
        label: 'Account Hold Out',
        icon: FileX,
        component: AccountHoldOutCreateReportFormModal,
        persistKey: 'form-report-account-hold-out',
    },
    {
        label: 'Teller Monitor',
        icon: Monitor,
        component: TellerMonitoringCreateReportFormModal,
        persistKey: 'form-report-other-teller-monitor',
    },
    {
        label: 'Print Number Tag',
        icon: Hash,
        component: PrintNumberTagCreateReportFormModal,
        persistKey: 'form-report-number-tag',
    },
]

const ReportGroupContainer = ({
    title,
    description,
    className,
    children,
    containerClassName,
    titleClassName,
    titleAccentClassName,
    descriptionClassName,
}: {
    title: string
    description?: string
    className?: string
    titleAccentClassName?: string
    titleClassName?: string
    descriptionClassName?: string
    children?: React.ReactNode
    containerClassName?: string
}) => {
    return (
        <div
            className={cn(
                'space-y-3 break-inside-avoid border border-muted bg-popover/40 shadow-2xs rounded-xl p-4',
                className
            )}
        >
            <header className="mb-5 flex items-stretch gap-3">
                <div
                    className={cn(
                        'w-1.5 self-stretch rounded-full bg-primary/70',
                        titleAccentClassName
                    )}
                />

                <div className="space-y-0.5">
                    <h3
                        className={cn(
                            'text-sm font-semibold tracking-wide text-foreground',
                            titleClassName
                        )}
                    >
                        {title}
                    </h3>

                    {description && (
                        <p
                            className={cn(
                                'text-xs text-muted-foreground',
                                descriptionClassName
                            )}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </header>
            <div className={cn('space-3 gap-3', containerClassName)}>
                {children}
            </div>
        </div>
    )
}

const ReportItemButton = ({
    report,
    variant = 'ghost',
}: {
    report: ReportItem
    variant?: 'ghost' | 'secondary'
}) => {
    const Component = report.component

    if (!Component) {
        return (
            <Button
                className="group relative flex w-full bg-muted items-center justify-start gap-3 rounded-xl border border-muted-foreground/80 p-3 h-fit text-left cursor-not-allowed shadow-[var(--shadow-sm)]"
                disabled
                size="nostyle"
                variant="ghost"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted border border-muted-foreground/30 text-muted-foreground">
                    <report.icon className="size-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium tracking-tight text-muted-foreground line-through">
                        {report.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Coming soon
                    </span>
                </span>
            </Button>
        )
    }

    return (
        <Component
            formProps={{
                persistKey: report.persistKey,
            }}
            trigger={
                <Button
                    className="group justify-start cursor-pointer border border-muted-foreground/40 rounded-xl gap-3 px-3 h-fit py-3"
                    size="nostyle"
                    variant={variant}
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-popover/60 dark:text-primary/70 transition-colors duration-200 group-hover:bg-popover group-hover:text-primary">
                        <report.icon className="size-4" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-medium truncate tracking-tight">
                        {report.label}
                    </span>
                </Button>
            }
        />
    )
}

const ReportList = ({
    reports,
    variant = 'secondary',
}: {
    reports: ReportItem[]
    variant?: 'ghost' | 'secondary'
}) => {
    return (
        <>
            {reports.map((report) => (
                <ReportItemButton
                    key={report.label}
                    report={report}
                    variant={variant}
                />
            ))}
        </>
    )
}

function ReportsMenu() {
    // const [search, setSearch] = useState('')
    // const inputRef = useRef<HTMLInputElement>(null)

    // useEffect(() => { inputRef.current?.focus() }, [])

    return (
        <div className="min-h-screen w-full">
            <div className="border-b border-border bg-background/40/95 backdrop-blur p-4 supports-[backdrop-filter]:bg-background/60">
                <p className="text-xl font-medium mx-auto text-center">
                    REPORT MENU
                </p>
                {/* <div className="mx-auto max-w-7xl px-7 py-4 flex items-center justify-center gap-6">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9 h-9 text-sm"
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reports..."
                            ref={inputRef}
                            value={search}
                        />
                    </div>
                </div> */}
            </div>

            <div className="mx-auto px-6 py-6 grid grid-cols-1 gap-6">
                <ReportGroupContainer
                    className="rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent shadow-md border border-emerald-500/15"
                    containerClassName="space-y-6"
                    description="Core financial operations covering daily transactions, cash flow processing, and accounting summaries."
                    descriptionClassName="text-sm text-muted-foreground"
                    title="Transactions"
                    titleAccentClassName="bg-emerald-500/50"
                >
                    <ReportGroupContainer
                        className="rounded-xl bg-popover/70 ring-2 ring-muted-foreground/20"
                        containerClassName="grid grid-cols-3 gap-4"
                        // titleClassName="uppercase"
                        description="Daily collection records, summaries, and cash receipt journal entries for reconciliation."
                        title="Collections"
                        titleAccentClassName="bg-teal-500/40"
                    >
                        <ReportList reports={COLLECTION_GROUP} />
                    </ReportGroupContainer>

                    <ReportGroupContainer
                        className="rounded-xl  bg-popover/70  ring-2 ring-muted-foreground/20"
                        containerClassName="grid grid-cols-2 gap-4 space-y-2"
                        description="Disbursements, loan releases, vouchers, journal entries, and fund tracking."
                        // titleClassName="uppercase"
                        title="Disbursements"
                        titleAccentClassName="bg-indigo-500/50"
                    >
                        <ReportList reports={DISBURSEMENT_GROUP} />

                        <ReportGroupContainer
                            className="rounded-lg bg-popover/70 ring-2 ring-muted-foreground/20"
                            containerClassName="grid grid-cols-3"
                            title="Loan Releases"
                            titleAccentClassName="bg-violet-500/50"
                            // description="Loan release tracking including tabulated, detailed, and summary reports."
                            titleClassName="uppercase"
                        >
                            <ReportList reports={LOAN_RELEASES_GROUP} />
                        </ReportGroupContainer>

                        <ReportGroupContainer
                            className="rounded-lg from-violet-500/10 via-violet-500/5 to-transparent ring-2 ring-muted-foreground/20"
                            containerClassName="grid grid-cols-3"
                            // description="Journal entries for accounting adjustments and balancing."
                            title="Journal Entries"
                            titleAccentClassName="bg-sky-500/50"
                            titleClassName="uppercase"
                        >
                            <ReportList reports={JOURNAL_GROUP} />
                        </ReportGroupContainer>

                        <div className="col-span-full flex gap-x-4">
                            <ReportGroupContainer
                                className="rounded-lg bg-popover/70 ring-2 ring-muted-foreground/20"
                                containerClassName="grid grid-cols-4"
                                // description="Internal fund tracking including batches and petty cash."
                                title="Funds Reports"
                                titleAccentClassName="bg-rose-400/50"
                                titleClassName="uppercase"
                            >
                                <ReportList reports={FUNDS_GROUP} />
                            </ReportGroupContainer>

                            <ReportGroupContainer
                                className="rounded-lg flex-1 bg-popover/70 ring-2 ring-muted-foreground/20"
                                containerClassName="grid grid-cols-1"
                                title="Cash Check Vouchers"
                                titleAccentClassName="bg-orange-500/60"
                                // description="Cash disbursement and voucher processing."
                                titleClassName="uppercase"
                            >
                                <ReportList
                                    reports={CASH_CHECK_VOUCHER_GROUP}
                                />
                            </ReportGroupContainer>
                        </div>
                    </ReportGroupContainer>
                </ReportGroupContainer>

                <ReportGroupContainer
                    className="rounded-2xl bg-gradient-to-br from-blue-400/10 to-transparent shadow-md border border-blue-500/10"
                    containerClassName="grid grid-cols-3 space-y-2"
                    description="Member data, loan tracking, deposits, capital movements, and schedules."
                    descriptionClassName="text-sm text-muted-foreground"
                    title="Schedule & Listing"
                    titleAccentClassName="bg-blue-500/30"
                >
                    <ReportGroupContainer
                        className="col-span-full rounded-xl bg-popover/70 ring-2 ring-muted-foreground/20"
                        containerClassName="grid grid-cols-5 gap-4"
                        // description="Member profiles, listings, ledger records, and account closure tracking."
                        title="Member"
                        titleAccentClassName="bg-cyan-500/30"
                        titleClassName="uppercase"
                    >
                        <ReportList reports={MEMBERS_GROUP} />
                    </ReportGroupContainer>
                    <ReportGroupContainer
                        className="rounded-xl col-span-full bg-popover/70 ring-2 ring-muted-foreground/20"
                        containerClassName="grid grid-cols-3 gap-4"
                        // description="Time deposit balances, accruals, and year-to-date tracking."
                        title="Time Deposits"
                        titleAccentClassName="bg-slate-500/30"
                        titleClassName="uppercase"
                    >
                        <ReportList reports={TIME_DEPOSIT_GROUP} />
                    </ReportGroupContainer>

                    <ReportGroupContainer
                        className="col-span-full rounded-xl bg-popover/70 ring-2 ring-muted-foreground/20"
                        containerClassName="grid grid-cols-5 gap-4"
                        // description="Balances across loans, deposits, capital shares, and interest."
                        title="Schedule of Balances"
                        titleAccentClassName="bg-fuchsia-500/70"
                        titleClassName="uppercase"
                    >
                        <ReportList reports={SCHEDULE_BALANCES_GROUP} />
                    </ReportGroupContainer>

                    <div className="flex col-span-full gap-x-4">
                        <ReportGroupContainer
                            className="rounded-xl bg-popover/70 ring-2 ring-muted-foreground/20"
                            containerClassName="grid grid-cols-3 gap-4"
                            // description="Loan lifecycle monitoring including risk, maturity, and receivables."
                            title="Loan Monitoring"
                            titleAccentClassName="bg-lime-500/30"
                            titleClassName="uppercase"
                        >
                            <ReportList reports={LOAN_COLLECTION_GROUP} />
                        </ReportGroupContainer>

                        <ReportGroupContainer
                            className="flex-1 rounded-xl bg-popover/70 ring-2 ring-muted-foreground/20"
                            containerClassName="grid grid-cols-4 gap-4"
                            // description="System utilities, adjustments, monitoring tools, and operational reports."
                            title="Other Reports"
                            titleAccentClassName="bg-amber-500/30"
                            titleClassName="uppercase"
                        >
                            <ReportList reports={OTHER_REPORTS_GROUP} />
                        </ReportGroupContainer>
                    </div>
                </ReportGroupContainer>
            </div>
        </div>
    )
}

export default ReportsMenu
