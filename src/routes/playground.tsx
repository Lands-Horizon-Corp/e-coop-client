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
export const sampleCashCheckDisbursementData = [
    {
        header_title: 'XYZ COOPERATIVE CREDIT UNION',
        header_address: '123 Main Street, Quezon City, Metro Manila',
        tax_number: '008-456-789-001',
        report_title: 'CASH/CHECK DISBURSEMENT',

        pay_to: 'Maria Clara Santos',
        address: '456 Luna St., Brgy. Santolan, Pasig City',
        particulars: 'Payment for office supplies and equipment',

        voucher_no: 'CDV-2025-00542',
        entry_date: '2025-11-28',
        print_date: '2025-11-28',
        amount: 25000.0,
        date: '2025-11-28',

        account_entries: [
            {
                account_title: 'Office Supplies Expense',
                debit: 15000.0,
                credit: 0.0,
            },
            {
                account_title: 'Equipment Expense',
                debit: 10000.0,
                credit: 0.0,
            },
            {
                account_title: 'Cash in Bank - BPI',
                debit: 0.0,
                credit: 25000.0,
            },
        ],

        cash_on_hand_total_debit: 25000.0,
        cash_on_hand_total_credit: 25000.0,

        total_debit: 25000.0,
        total_credit: 25000.0,

        check_no: 'CHK-987654',
        check_date: '2025-11-28',

        total_amount_into_words: 'TWENTY-FIVE THOUSAND PESOS',

        prepared_by: 'Sarah Reyes',
        payee: 'Maria Clara Santos',
        certified_correct: 'John Martinez',
        paid_by: 'Linda Aquino',
        approved_for_payment: 'Dr. Roberto Fernandez',

        user_id: 'USR-2025-0045',
        report_date: '2025-11-28',
        time: '14:30:00',
    },
]
export const sampleJournalEntryData = [
    {
        header_title: 'ABC COOPERATIVE SOCIETY',
        header_address: '789 Rizal Avenue, Manila City, Philippines',
        tax_number: '005-123-456-789',

        report_title: 'JOURNAL ENTRY VOUCHER',

        name: 'Pedro Gonzales',
        address: '321 Bonifacio St., Brgy. San Miguel, Taguig City',
        particulars: 'Adjustment for office equipment depreciation',

        voucher_no: 'JEV-2025-00321',
        entry_date: '2025-11-28',
        print_date: '2025-11-28',
        amount: 8500.0,
        date: '2025-11-28',

        total_credit: 8500.0,
        total_debit: 8500.0,

        account_entries: [
            {
                account_title: 'Depreciation Expense - Office Equipment',
                debit: 8500.0,
                credit: 0.0,
            },
            {
                account_title: 'Accumulated Depreciation - Office Equipment',
                debit: 0.0,
                credit: 8500.0,
            },
        ],

        check_date: '2025-11-28',
        check_no: 'N/A',

        status: 'POSTED',
        count: 2,

        prepared_by: 'Angela Torres',
        approved_by: 'Mr. Benjamin Cruz',
    },
]

function RouteComponent() {
    return (
        <div className="size-full h-fit v1 flex items-center flex-wrap justify-center text-black p-8">
            <PaperSizeContainer className="" scale={1} size="STATEMENT">
                <HbsCompiler
                    data={sampleCashCheckDisbursementData[0]}
                    templatePath="/reports/cash-check-disbursement/hbs-cash-check-disbursement.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="A5">
                <HbsCompiler
                    data={sampleJournalEntryData[0]}
                    templatePath="/reports/journal-entry/hbs-journal-entry.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="B5">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/template-1.hbs"
                />
            </PaperSizeContainer>
            <PaperSizeContainer className="" scale={1} size="BANKBOOK">
                <HbsCompiler
                    data={sampleLoanReleaseData[0]}
                    templatePath="/reports/loan-release-voucher/hbs-loan-release-voucher.hbs"
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
