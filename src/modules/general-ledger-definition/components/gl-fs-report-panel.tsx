import { Fragment, ReactNode } from 'react'

import { cn } from '@/helpers'
import { CashFlowReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/cash-flow-create-report-form'
import { FinancialStatementConditionReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/financial-statement-condition-create-report-form'
import { GLBooksReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/gl-books-create-report-form'
import { IncomeStatementReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/income-statement-create-report-form'
import { SLGLComparisonReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/sl-gl-comparison-create-report-form'
import { SLTRXGLComparisonReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/sl-trx-gl-comparison-create-report-form'
import { StatementOfOperationsReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/statements-of-operation-create-report-form'
import { TrialBalanceReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/trial-balance-create-report-form'
import { IGeneratedReport } from '@/modules/generated-report'
import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import { TrendingUpIcon } from 'lucide-react'

import {
    ActivityBeatIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    BookOpenIcon,
    ChartBarIcon,
    DollarIcon,
    FilesIcon,
    PieChartIcon,
    WalletIcon,
    WeightScaleIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

import { AccountHistoryReportCreateFormModal } from './forms/account-history-create-report-form'
import { AccountLedgerReportCreateFormModal } from './forms/account-ledger-report-form'
import { BalanceSheetReportCreateFormModal } from './forms/balance-sheet-create-report-form'

const handleOpenReport = (generatedReport: IGeneratedReport) => {
    useReportViewerStore.getState().open({ reportId: generatedReport.id })
}

const glReports: ReactNode[] = [
    <AccountLedgerReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <BookOpenIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">
                    Report Accnt. Ledger
                </span>
            </Button>
        }
    />,
    <GLBooksReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <FilesIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Report GL Books</span>
            </Button>
        }
    />,
    <TrialBalanceReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <WeightScaleIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Trial Balance</span>
            </Button>
        }
    />,
    <IncomeStatementReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <TrendingUpIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Income Statement</span>
            </Button>
        }
    />,
    <BalanceSheetReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <ChartBarIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Balance Sheet</span>
            </Button>
        }
    />,
    <AccountHistoryReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <DollarIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Account History</span>
            </Button>
        }
    />,
]

const fsReports: ReactNode[] = [
    <FinancialStatementConditionReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <ActivityBeatIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Financial Condition</span>
            </Button>
        }
    />,
    <StatementOfOperationsReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <PieChartIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">
                    Statement of Operations
                </span>
            </Button>
        }
    />,
    <Button
        className="justify-start gap-3 h-auto py-3 px-4 text-left"
        disabled
        variant="outline"
    >
        <WalletIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium">
            Cash Flow Table (not available yet)
        </span>
    </Button>,
    <CashFlowReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <DollarIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">Report Cash Flow</span>
            </Button>
        }
    />,
    <SLGLComparisonReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <ArrowLeftIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">SL-GL Comparison</span>
            </Button>
        }
    />,
    <SLTRXGLComparisonReportCreateFormModal
        formProps={{ onSuccess: handleOpenReport }}
        trigger={
            <Button
                className="justify-start gap-3 h-auto py-3 px-4 text-left"
                variant="outline"
            >
                <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">
                    SL-TRX-GL Comparison
                </span>
            </Button>
        }
    />,
]

const ReportSection = ({
    title,
    reports,
}: {
    title: string
    reports: ReactNode[]
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Badge
                    className="text-xs font-semibold tracking-wide uppercase"
                    variant="secondary"
                >
                    {title}
                </Badge>
            </div>
            <div className="flex flex-col gap-1">
                {reports.map((report, i) => (
                    <Fragment key={`${title}-${i}`}>{report}</Fragment>
                ))}
            </div>
        </div>
    )
}

export const GLFSReportsPanel = ({ className }: IClassProps) => {
    return (
        <div
            className={cn(
                'flex-1 p-4 space-y-6 overflow-auto bg-popover rounded-xl ecoop-scroll',
                className
            )}
        >
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Reports
            </h2>
            <ReportSection reports={glReports} title="General Ledger" />
            <Separator />
            <ReportSection reports={fsReports} title="Financial Statement" />
        </div>
    )
}

export default GLFSReportsPanel
