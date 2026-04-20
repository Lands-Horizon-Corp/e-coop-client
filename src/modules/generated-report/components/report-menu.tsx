import { useEffect, useMemo, useRef, useState } from 'react'

import Fuse from 'fuse.js'

import {
    ArrowLeftRight,
    BadgeDollarSign,
    Banknote,
    BarChart3,
    BookOpen,
    Calculator,
    CircleDollarSign,
    ClipboardList,
    Clock,
    Coins,
    CreditCard,
    DollarSign,
    FileBarChart,
    FileClock,
    FileText,
    FileX,
    FolderOpen,
    HandCoins,
    Hash,
    Landmark,
    Layers,
    ListChecks,
    Monitor,
    Percent,
    PiggyBank,
    Receipt,
    ReceiptText,
    Scale,
    ScrollText,
    Search,
    Shield,
    ShoppingCart,
    TrendingDown,
    UserCheck,
    UserSearch,
    Users,
    Vote,
    Wallet,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
import { SupposedActualCollectionCreateReportFormModal } from './forms/supposed-actual-colleaction-create-report-form'
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

interface ReportGroup {
    title: string
    icon: React.ElementType
    reports: ReportItem[]
}

const reportGroups: ReportGroup[] = [
    {
        title: 'Collections',
        icon: HandCoins,
        reports: [
            {
                label: 'Daily Coll. Detail',
                icon: FileText,
                component: DailyCollectionDetailCreateReportFormModal,
                persistKey: 'form-report-collections-daily-coll-detail',
            },
            {
                label: 'Daily Coll. Summary',
                icon: ClipboardList,
                component: DailyCollectionSummaryCreateReportFormModal,
                persistKey: 'form-report-collections-daily-coll-summary',
            },
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
        ],
    },
    {
        title: 'Loans',
        icon: Banknote,
        reports: [
            {
                label: 'Loan Release Tabulated',
                icon: BarChart3,
                component: LoanReleaseCreateReportFormModal,
                persistKey: 'form-report-loans-loan-release-tabulated',
            },
            {
                label: 'Loan Release Summary',
                icon: FileText,
                component: LoanReleaseSummaryCreateReportFormModal,
                persistKey: 'form-report-loans-loan-release-summary',
            },
            {
                label: 'Loan Release Detail',
                icon: ScrollText,
                component: LoanReleaseDetailCreateReportFormModal,
                persistKey: 'form-report-loans-loan-release-detail',
            },
            {
                label: 'Loan Balances',
                icon: Scale,
                component: LoanBalancesCreateReportFormModal,
                persistKey: 'form-report-loans-loan-balances',
            },
            {
                label: 'Loan Protection Plan',
                icon: FileText,
                component: LoanProtectionPlanCreateReportFormModal,
                persistKey: 'form-report-loans-loan-protection-plan',
            },
            {
                label: 'Loan Receivable',
                icon: Receipt,
                component: LoanReceivableCreateReportFormModal,
                persistKey: 'form-report-loans-loan-receivable',
            },
            {
                label: 'Loan Maturity',
                icon: FileClock,
                component: LoanMaturityCreateReportFormModal,
                persistKey: 'form-report-loans-loan-maturity',
            },
            {
                label: 'Loan Statement',
                icon: FileBarChart,
                component: LoanStatementCreateReportFormModal,
                persistKey: 'form-report-loans-loan-statement',
            },
            {
                label: 'Grocery Loan Release',
                icon: ShoppingCart,
                component: GroceryLoanReleaseCreateReportFormModal,
                persistKey: 'form-report-loans-grocery-loan-release',
            },
            {
                label: 'Past Due on Installment',
                icon: TrendingDown,
                component: PastDueOnInstallmentCreateReportFormModal,
                persistKey: 'form-report-loans-past-due-installment',
            },
            {
                label: 'Portfolio at Risk',
                icon: Shield,
                component: PortfolioAtRiskCreateReportFormModal,
                persistKey: 'form-report-loans-portfolio-at-risk',
            },
            {
                label: 'Comaker',
                icon: UserCheck,
                component: ComakerCreateReportFormModal,
                persistKey: 'form-report-loans-comaker',
            },
        ],
    },
    {
        title: 'Deposits & Withdrawals',
        icon: PiggyBank,
        reports: [
            {
                label: 'Daily Withdrawal',
                icon: ArrowLeftRight,
                component: DailyWithdrawalCreateReportFormModal,
                persistKey: 'form-report-deposits-daily-withdrawal',
            },
            {
                label: 'Deposit Balances',
                icon: Coins,
                component: DepositBalancesCreateReportFormModal,
                persistKey: 'form-report-deposits-deposit-balances',
            },
            {
                label: 'Time Deposit',
                icon: Clock,
                component: TimeDepositCreateReportFormModal,
                persistKey: 'form-report-deposits-time-deposit',
            },
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
        ],
    },
    {
        title: 'Member Accounts',
        icon: Users,
        reports: [
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
                label: 'Account Balance',
                icon: Wallet,
                component: AccountBalanceCreateReportFormModal,
                persistKey: 'form-report-account-balance',
            },
            {
                label: 'Account Hold Out',
                icon: FileX,
                component: AccountHoldOutCreateReportFormModal,
                persistKey: 'form-report-account-hold-out',
            },
            {
                label: 'Close Account',
                icon: FileX,
                component: CloseAccountCreateReportFormModal,
                persistKey: 'form-report-close-account',
            },
            {
                label: 'Voters List (ACE) - Comming soon',
                icon: Vote,
                persistKey: 'form-report-voters-list',
            },
        ],
    },
    {
        title: 'Accounting & Journals',
        icon: BookOpen,
        reports: [
            {
                label: 'Cash Disbursement',
                icon: CreditCard,
                component: CashCheckDisbursementCreateReportFormModal,
                persistKey: 'form-report-accounting-cash-disbursement',
            },
            {
                label: 'Cash Receipt Journal',
                icon: Receipt,
                component:
                    DailyCashCollectionReceiptJournalCreateReportFormModal,
                persistKey: 'form-report-accounting-cash-receipt-journal',
            },
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
                label: 'Direct Adjustment',
                icon: Calculator,
                component: DirectAdjustmentCreateReportFormModal,
                persistKey: 'form-report-accounting-direct-adjustment',
            },
            {
                label: 'Transaction Batch',
                icon: ClipboardList,
                component: TransactionBatchCreateReportFormModal,
                persistKey: 'form-report-accounting-transaction-batch',
            },
            {
                label: 'Ledger',
                icon: BookOpen,
                component: LedgerCreateReportFormModal,
                persistKey: 'form-report-accounting-ledger',
            },
        ],
    },
    {
        title: 'Share Capital & Interest',
        icon: Landmark,
        reports: [
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
                label: 'Interest Share Capital',
                icon: CircleDollarSign,
                component: InterestOnShareCapitalCreateReportFormModal,
                persistKey: 'form-report-share-capital-interest',
            },
            {
                label: 'Earned / Unearned',
                icon: Layers,
                component: EarnedUnearnedCreateReportFormModal,
                persistKey: 'form-report-share-capital-earned-unearned',
            },
        ],
    },
    {
        title: 'Other Reports',
        icon: FolderOpen,
        reports: [
            {
                label: 'Number Tag',
                icon: Hash,
                component: PrintNumberTagCreateReportFormModal,
                persistKey: 'form-report-other-number-tag',
            },
            {
                label: 'Other Funds Entry',
                icon: Coins,
                component: OtherFundsEntryCreateReportFormModal,
                persistKey: 'form-report-other-funds-entry',
            },
            {
                label: 'ICPR',
                icon: FileText,
                component: ICPRCreateReportFormModal,
                persistKey: 'form-report-other-icpr',
            },
            {
                label: 'Supposed / Actual',
                icon: Scale,
                component: SupposedActualCollectionCreateReportFormModal,
                persistKey: 'form-report-other-supposed-actual',
            },
            {
                label: 'Teller Monitor',
                icon: Monitor,
                component: TellerMonitoringCreateReportFormModal,
                persistKey: 'form-report-other-teller-monitor',
            },
            {
                label: 'Rebates',
                icon: DollarSign,
                component: RebateCreateReportFormModal,
                persistKey: 'form-report-other-rebates',
            },
            {
                label: 'Proof of Purchase',
                icon: ShoppingCart,
                component: ProofOfPurchaseCreateReportFormModal,
                persistKey: 'form-report-other-proof-of-purchase',
            },
        ],
    },
]

function ReportsMenu() {
    const [search, setSearch] = useState('')

    const flatReports = useMemo(() => {
        return reportGroups.flatMap((group) =>
            group.reports.map((r) => ({
                ...r,
                groupTitle: group.title,
                groupIcon: group.icon,
            }))
        )
    }, [])

    const fuse = useMemo(() => {
        return new Fuse(flatReports, {
            keys: ['label', 'groupTitle'],
            threshold: 0.3,
        })
    }, [flatReports])

    const filteredGroups = useMemo(() => {
        const results = search.trim()
            ? fuse.search(search).map((r) => r.item)
            : flatReports

        const grouped: Record<string, ReportGroup> = {}

        results.forEach((item) => {
            if (!grouped[item.groupTitle]) {
                grouped[item.groupTitle] = {
                    title: item.groupTitle,
                    icon: item.groupIcon,
                    reports: [],
                }
            }

            grouped[item.groupTitle].reports.push({
                label: item.label,
                icon: item.icon,
                component: item.component,
                persistKey: item.persistKey,
            })
        })

        return Object.values(grouped)
    }, [search, fuse, flatReports])

    // const totalReports = reportGroups.reduce(
    //     (sum, g) => sum + g.reports.length,
    //     0
    // )

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <div className="min-h-screen min-w-6xl">
            <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-7 py-4 flex items-center justify-center gap-6">
                    {/* <div className="shrink-0">
                        <h1 className="text-lg font-semibold tracking-tight text-foreground">
                            Reports Menu
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {totalReports} reports
                        </p>
                    </div> */}
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
                </div>
            </div>

            <div className="mx-auto px-6 py-6">
                {filteredGroups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <UserSearch className="size-10 text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No reports found
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Try a different search term
                        </p>
                    </div>
                )}

                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-5">
                    {filteredGroups.map((group) => (
                        <div
                            className="break-inside-avoid space-y-2.5"
                            key={group.title}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <group.icon className="size-6 text-muted-foreground" />
                                <Badge
                                    className="px-3 py-1.5 text-sm font-semibold uppercase tracking-wide"
                                    variant="secondary"
                                >
                                    {group.title}
                                </Badge>
                            </div>
                            <div className="flex flex-col">
                                {group.reports.map((report) => {
                                    const Component = report.component

                                    if (!Component) {
                                        return (
                                            <Button
                                                className="h-9 justify-start gap-2.5 px-3 text-left w-full opacity-50 cursor-not-allowed"
                                                disabled
                                                key={report.label}
                                                size="sm"
                                                variant="ghost"
                                            >
                                                <report.icon className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="text-sm font-medium truncate">
                                                    {report.label}
                                                </span>
                                            </Button>
                                        )
                                    }

                                    return (
                                        <Component
                                            formProps={{
                                                persistKey: report.persistKey,
                                            }}
                                            key={report.label}
                                            trigger={
                                                <Button
                                                    className="h-9 justify-start gap-2.5 px-3 text-left w-full"
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <report.icon className="size-4 shrink-0 text-muted-foreground" />
                                                    <span className="text-sm font-medium truncate">
                                                        {report.label}
                                                    </span>
                                                </Button>
                                            }
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ReportsMenu
