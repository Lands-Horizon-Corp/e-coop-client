import { CASH_CHECK_VOUCHER_PRINT_TEMPLATES } from '@/modules/cash-check-voucher/reports/cash-check-voucher-templates'
import { GenerateReportTemplatePicker } from '@/modules/generated-report/components/generated-report-template/generated-report-template'
import { JOURNAL_VOUCHER_PRINT_TEMPLATES } from '@/modules/journal-voucher/reports/jornal-voucher-template'
import { LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES } from '@/modules/loan-transaction/reports/loan-transaction-templates'
import { OTHER_FUND_PRINT_TEMPLATES } from '@/modules/other-fund/reports/other-fund-templates'

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

                    <GenerateReportTemplatePicker
                        templates={OTHER_FUND_PRINT_TEMPLATES}
                    />

                    <GenerateReportTemplatePicker
                        templates={CASH_CHECK_VOUCHER_PRINT_TEMPLATES}
                    />

                    <GenerateReportTemplatePicker
                        templates={JOURNAL_VOUCHER_PRINT_TEMPLATES}
                    />
                </div>
            </UserOrgGuard>
        </AuthGuard>
    )
}

export default PlaygroundPage
