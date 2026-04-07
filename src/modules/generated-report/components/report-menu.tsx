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

import { AdjustmentReportCreateFormModal } from './forms/adjustment-create-report-form'
import { DailyCashCollectionReceiptJournalReportCreateFormModal } from './forms/daily-cash-receipt-create-report-form'

interface ReportItem {
    label: string
    icon: React.ElementType
    component?: React.ElementType<{ trigger: React.ReactNode }>
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
            },
            {
                label: 'Daily Coll. Summary',
                icon: ClipboardList,
            },
            {
                label: 'Loan Coll. Detail',
                icon: ScrollText,
            },
            {
                label: 'Loan Coll. Summary',
                icon: FileBarChart,
            },
            {
                label: 'Collection Due',
                icon: Clock,
            },
        ],
    },
    {
        title: 'Loans',
        icon: Banknote,
        reports: [
            {
                label: 'Loan Rel. Tabulated',
                icon: BarChart3,
            },
            {
                label: 'Loan Rel. Summary',
                icon: FileText,
            },
            {
                label: 'Loan Rel. Detail',
                icon: ScrollText,
            },
            {
                label: 'Loan Balances',
                icon: Scale,
            },
            {
                label: 'Loan Receivable',
                icon: Receipt,
            },
            {
                label: 'Loan Maturity',
                icon: FileClock,
            },
            {
                label: 'Loan Statement',
                icon: FileBarChart,
            },
            {
                label: 'Grocery Loan',
                icon: ShoppingCart,
            },
            {
                label: 'Past Due on Inst.',
                icon: TrendingDown,
            },
            {
                label: 'Portfolio at Risk',
                icon: Shield,
            },
            {
                label: 'Comaker',
                icon: UserCheck,
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
            },
            {
                label: 'Deposit Balances',
                icon: Coins,
            },
            {
                label: 'Time Deposit',
                icon: Clock,
            },
            {
                label: 'TD Balance',
                icon: DollarSign,
            },
            {
                label: 'TD Bal / YTD',
                icon: BarChart3,
            },
            {
                label: 'TD Accrued',
                icon: Percent,
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
            },
            {
                label: 'Number Tag',
                icon: Hash,
            },
            {
                label: 'Stmt of Account',
                icon: ReceiptText,
            },
            {
                label: 'Account Balance',
                icon: Wallet,
            },
            {
                label: 'Account Hold Out',
                icon: FileX,
            },
            {
                label: 'Close Account',
                icon: FileX,
            },
            {
                label: 'Voters List',
                icon: Vote,
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
            },
            {
                label: 'Cash Receipt Journal',
                icon: Receipt,
                component:
                    DailyCashCollectionReceiptJournalReportCreateFormModal,
            },
            {
                label: 'Journal Voucher',
                icon: FileText,
                component: AdjustmentReportCreateFormModal,
            },
            {
                label: 'Adjustment',
                icon: Calculator,
            },
            {
                label: 'Direct Adjustment',
                icon: Calculator,
            },
            {
                label: 'Blotter',
                icon: ClipboardList,
            },
            {
                label: 'Ledger',
                icon: BookOpen,
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
            },
            {
                label: 'Share Cap Withdrawal',
                icon: ArrowLeftRight,
            },
            {
                label: 'Interest Share Cap',
                icon: CircleDollarSign,
            },
            {
                label: 'Earned / Unearned',
                icon: Layers,
            },
        ],
    },
    {
        title: 'Other Reports',
        icon: FolderOpen,
        reports: [
            {
                label: 'Other Funds',
                icon: Coins,
            },
            {
                label: 'CLPP',
                icon: FileText,
            },
            {
                label: 'ICPR',
                icon: FileText,
            },
            {
                label: 'Supposed / Actual',
                icon: Scale,
            },
            {
                label: 'Teller Monitor',
                icon: Monitor,
            },
            {
                label: 'Rebates',
                icon: DollarSign,
            },
            {
                label: 'Proof of Purchase',
                icon: ShoppingCart,
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
        if (!search.trim()) return reportGroups

        const results = fuse.search(search).map((r) => r.item)

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
            })
        })

        return Object.values(grouped)
    }, [search, fuse])

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

                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-4">
                    {filteredGroups.map((group) => (
                        <div
                            className="break-inside-avoid space-y-1.5"
                            key={group.title}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <group.icon className="size-3.5 text-muted-foreground" />
                                <Badge
                                    className="text-[10px] font-semibold uppercase tracking-wide"
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
                                                className="justify-start gap-2 px-2 text-left w-full opacity-50 cursor-not-allowed"
                                                disabled
                                                key={report.label}
                                                size="sm"
                                                variant="ghost"
                                            >
                                                <report.icon className="size-3.5 shrink-0 text-muted-foreground" />
                                                <span className="text-xs font-medium truncate">
                                                    {report.label}
                                                </span>
                                            </Button>
                                        )
                                    }

                                    return (
                                        <Component
                                            key={report.label}
                                            trigger={
                                                <Button
                                                    className="justify-start gap-2 px-2 text-left w-full"
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <report.icon className="size-3.5 shrink-0 text-muted-foreground" />
                                                    <span className="text-xs font-medium truncate">
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
