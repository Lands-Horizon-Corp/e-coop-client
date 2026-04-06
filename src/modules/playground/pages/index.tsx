import { AccountHistoryReportCreateFormModal } from '@/modules/account/components/forms/account-history-create-report-form'
import { GLBooksReportCreateFormModal } from '@/modules/general-ledger/components/forms/gl-books-create-report-form'
import { BalanceSheetReportCreateFormModal } from '@/modules/generated-report/components/forms/balance-sheet-create-report-form'
import { CashFlowReportCreateFormModal } from '@/modules/generated-report/components/forms/cash-flow-create-report-form'
import { FinancialStatementConditionReportCreateFormModal } from '@/modules/generated-report/components/forms/financial-statement-condition-create-report-form'
import { IncomeStatementReportCreateFormModal } from '@/modules/generated-report/components/forms/income-statement-create-report-form'
import PrintReportFormModal from '@/modules/generated-report/components/forms/print-modal-config'
import { SLGLComparisonReportCreateFormModal } from '@/modules/generated-report/components/forms/sl-gl-comparison-create-report-form'
import { SLTRXGLComparisonReportCreateFormModal } from '@/modules/generated-report/components/forms/sl-trx-gl-comparison-create-report-form'
import { StatementOfOperationsReportCreateFormModal } from '@/modules/generated-report/components/forms/statements-of-operation-create-report-form'
import { TrialBalanceReportCreateFormModal } from '@/modules/generated-report/components/forms/trial-balance-create-report-form'
import { GenerateReportTemplatePicker } from '@/modules/generated-report/components/generated-report-template/generated-report-template'
import { LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES } from '@/modules/loan-transaction/reports/loan-transaction-templates'

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
                    <Broadcaster />
                    <PDFUploader />
                    <GeneratedReports />
                    <GenerateReportTemplatePicker
                        templates={LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES}
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
                    <GLBooksReportCreateFormModal trigger={<p>HITLER A</p>} />
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
                    />
                </div>
            </UserOrgGuard>
        </AuthGuard>
    )
}

export default PlaygroundPage
