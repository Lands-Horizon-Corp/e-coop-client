import { createFileRoute } from '@tanstack/react-router'

import PaperSizeContainer from '@/modules/generated-report/components/paper-size-container'

import HbsCompiler from '../components/reports/handlebars-compiler'

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})
export const sampleLoanReleaseData = [
    {
        header_title: 'ABC MICROFINANCE CORPORATION',
        header_address: 'Brgy. San Isidro, Makati City, Philippines',
        tax_number: '004-982-553-000',
        report_title: 'LOAN RELEASE VOUCHER',

        pay_to: 'Juan Dela Cruz',
        account_number: 'ACC-2025-00123',
        contact: '0917-555-2012',

        voucher_no: 'VCH-2025-00981',
        date_release: '2025-11-25',
        terms: 12,
        mode_of_payment: 'Monthly',
        processor: 'Maria Santos',
        due_date: '2026-11-25',

        loan_transaction_entries: [
            {
                account_title: 'Cash on Hand',
                debit: '50,000.00',
                credit: '0.00',
                is_highlighted: false,
            },
            {
                account_title: 'Loan Receivable',
                debit: '0.00',
                credit: '50,000.00',
                is_highlighted: false,
            },
            {
                account_title: 'Service Fee Income',
                debit: '0.00',
                credit: '1,500.00',
                is_highlighted: false,
            },
            {
                account_title: 'Document Stamp Tax',
                debit: '0.00',
                credit: '300.00',
                is_highlighted: false,
            },
            {
                account_title: 'Net Proceeds',
                debit: '48,200.00',
                credit: '0.00',
                is_highlighted: true,
            },
        ],

        cash_on_hand_total_debit: '98,200.00',
        cash_on_hand_total_credit: '51,800.00',

        total_amount_in_words: 'FORTY-EIGHT THOUSAND TWO HUNDRED PESOS',

        prepared_by: 'Anna Lopez',
        payeee: 'Juan Dela Cruz',
        cetified_correct: 'Roberto Lim',
        paid_by: 'Catherine Dy',

        approved_for_payment: 'Engr. Raymond Cruz',
    },
]

function RouteComponent() {
    return (
        <div className="size-full h-fit v1 flex items-center flex-wrap justify-center text-black p-8">
            <PaperSizeContainer className="" scale={1} size="STATEMENT">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-responsive.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="A5">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-responsive.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="A4">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-3.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="B5">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-responsive.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="BANKBOOK">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-responsive.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="CHECKBOOK">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-responsive.hbs"
                />
            </PaperSizeContainer>
        </div>
    )
}
