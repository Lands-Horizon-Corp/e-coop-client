import { TrialBalanceReportCreateFormModal } from '@/modules/general-ledger-definition/components/forms/trial-balance-create-report-form'
import { AdjustmentReportCreateFormModal } from '@/modules/generated-report/components/forms/adjustment-create-report-form'
import { CloseAccountReportCreateFormModal } from '@/modules/generated-report/components/forms/close-account-create-report-form'
import { DailyCashCollectionReceiptJournalReportCreateFormModal } from '@/modules/generated-report/components/forms/daily-cash-receipt-create-report-form'
import { JournalVoucherReportCreateFormModal } from '@/modules/generated-report/components/forms/journal-voucher-create-report-form'
import PrintReportFormModal from '@/modules/generated-report/components/forms/print-modal-config'

import AuthGuard from '@/components/wrappers/auth-guard'
import UserOrgGuard from '@/components/wrappers/user-org-guard'

import Broadcaster from '../components/broadcaster'
import GeneratedReports from '../components/generated-reports'
import PDFUploader from '../components/pdf-uploader'

function PlaygroundPage() {
    return (
        <AuthGuard>
            <UserOrgGuard>
                <div className="min-h-screen bg-background p-8 font-sans text-foreground transition-colors duration-300">
                    <TrialBalanceReportCreateFormModal
                        trigger={<p>HITLER B</p>}
                    />
                    <Broadcaster />
                    <PDFUploader />
                    <GeneratedReports />
                    <DailyCashCollectionReceiptJournalReportCreateFormModal
                        trigger={<p>HITLER A</p>}
                    />
                    <AdjustmentReportCreateFormModal
                        trigger={<p>HITLER B</p>}
                    />
                    <JournalVoucherReportCreateFormModal
                        trigger={<p>HITLER C</p>}
                    />
                    <CloseAccountReportCreateFormModal
                        trigger={<p>HITLER D</p>}
                    />
                    {/* 
                    <GenerateReportTemplatePicker
                        templates={OTHER_FUND_PRINT_TEMPLATES}
                    />

                    <GenerateReportTemplatePicker
                        templates={CASH_CHECK_VOUCHER_PRINT_TEMPLATES}
                    />

                    <GenerateReportTemplatePicker
                        templates={JOURNAL_VOUCHER_PRINT_TEMPLATES}
                    /> */}
                    <PrintReportFormModal />
                    {/* <GLBooksReportCreateFormModal trigger={<p>HITLER A</p>} />
                    <TrialBalanceReportCreateFormModal
                        trigger={<p>HITLER B</p>}
                    />

                    <IncomeStatementReportCreateFormModal
                        trigger={<p>HITLER C</p>}
                    />
                    <BalanceSheetReportCreateFormModal
                        trigger={<p>HITLER D</p>}
                    />

                    <AccountHistoryReportCreateFormModal
                        trigger={<p>HITLER E</p>}
                    />

                    <FinancialStatementConditionReportCreateFormModal
                        trigger={<p>HITLER F</p>}
                    />

                    <StatementOfOperationsReportCreateFormModal
                        trigger={<p>HITLER G</p>}
                    />

                    <CashFlowReportCreateFormModal trigger={<p>HITLER H</p>} />

                    <SLGLComparisonReportCreateFormModal
                        trigger={<p>HITLER I</p>}
                    />

                    <SLTRXGLComparisonReportCreateFormModal
                        trigger={<p>HITLER J</p>}
                    /> */}
                </div>
            </UserOrgGuard>
        </AuthGuard>
    )
}

export default PlaygroundPage
