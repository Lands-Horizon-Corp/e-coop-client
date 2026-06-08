import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLedgerCreateReportSchema } from '../components/forms/ledger-create-report-form'
import LEDGER_FORMAT1_T1 from './templates/ledger-templates/ldgr-fmt1-t1.njk?raw'
import LEDGER_FORMAT3_T1 from './templates/ledger-templates/ldgr-fmt3-t1.njk?raw'
import LEDGER_FORMAT4_T1 from './templates/ledger-templates/ldgr-fmt4-t1.njk?raw'

// START DO NOT EDIT
export type TPresentationStyle = 'f1' | 'f3' | 'f4'

export interface ILedgerReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment?: string
    barangay?: string

    // 'deposit' | 'loans'
    all_accounts?: TLedgerCreateReportSchema['all_accounts']

    data?: Array<{
        // Fill for: F1(all), F3(all), F4(all)
        member_name?: string

        // Fill for: F1(deposit), F3(all), F4(deposit)
        pasbook_number?: string

        // Fill for: F1(all), F3(all), F4(all)
        account_name?: string
        account_short_name?: string

        // Fill for: F1(loans), F3(loans), F4(loans)
        address?: string
        share_capital?: string | number
        release_date?: string
        maturity_date?: string

        // Fill for: F3(loans)
        mode_of_payment?: string
        amortization?: string | number

        ledger_entries?: Array<{
            // If true, fill only the balance to serve as beginning balance
            is_beginning?: boolean

            // Fill for: All formats (omit if is_beginning)
            ref_no?: string | number
            date?: string

            // Fill for: F1(all), F3(all)
            debit?: string | number
            credit?: string | number

            // Fill for: All formats (filled for both beginning balance and regular rows)
            balance?: string | number

            // Fill for: F1(deposit), F3(deposit), F4(deposit)
            type?: string

            // Fill for: All formats
            employee_name?: string

            // Fill for: F1(loans), F3(loans)
            fines?: string | number
            fines_balance?: string | number
            interest?: string | number
            interest_balance?: string | number

            // Fill for: F3(loans)
            arrears?: string | number

            // Fill for: F4(deposit)
            amount?: string | number

            // Fill for: F4(loans)
            principal?: string | number
            interest_paid?: string | number
            interest_run_total?: string | number
            fines_paid?: string | number
            fines_run_total?: string | number
            total_amount?: string | number
        }>
    }>
}

// END TYPE DO NOT EDIT

export const SHARED_LEDGER_PREVIEW_DATA: ILedgerReportTemplate = {
    header_title: 'LANDS HORIZON MULTI-PURPOSE COOPERATIVE',
    header_address: 'Main Hub, Prosperity District, Quezon City, Philippines',
    tax_number: '001-234-567-000',
    report_title: 'MEMBER LOAN LEDGER DETAILED PREVIEW',
    density: 'normal',

    start_date: '2026-01-01',
    end_date: '2026-06-30',
    mode_of_payment: 'all',
    barangay: 'Barangay Prosperity',
    all_accounts: 'loans',

    data: [
        {
            member_name: 'Juan Dela Cruz',
            pasbook_number: 'PB-2026-0001',
            account_name: 'Regular Salary Loan',
            account_short_name: 'RSL',
            address: 'Row 3, Block 5, Barangay Prosperity',
            share_capital: '15000.00',
            release_date: '2026-01-15',
            maturity_date: '2027-01-15',
            mode_of_payment: 'Monthly Auto-Debit',
            amortization: '5416.67',
            ledger_entries: [
                {
                    ref_no: 'LN-26-001',
                    date: '2026-01-15',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '50000.00',
                    credit: '0.00',
                    balance: '50000.00',
                    interest: '5000.00',
                    interest_balance: '5000.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
                {
                    ref_no: 'OR-99812',
                    date: '2026-02-15',
                    type: 'Amortization',
                    employee_name: 'Mark Teller',
                    debit: '0.00',
                    credit: '4166.67',
                    balance: '45833.33',
                    interest: '416.67',
                    interest_balance: '4583.33',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Maria Clara Santos',
            pasbook_number: 'PB-2026-0002',
            account_name: 'Emergency Loan',
            account_short_name: 'EML',
            address: 'Phase 2, Barangay Prosperity',
            share_capital: '25000.00',
            release_date: '2026-03-01',
            maturity_date: '2026-09-01',
            mode_of_payment: 'Over-the-Counter',
            amortization: '17500.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-014',
                    date: '2026-03-01',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '100000.00',
                    credit: '0.00',
                    balance: '100000.00',
                    interest: '5000.00',
                    interest_balance: '5000.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Pedro Penduko',
            pasbook_number: 'PB-2026-0003',
            account_name: 'Regular Salary Loan',
            account_short_name: 'RSL',
            address: 'Sitio Central, Barangay Prosperity',
            share_capital: '8000.00',
            release_date: '2026-01-10',
            maturity_date: '2026-07-10',
            mode_of_payment: 'GCash',
            amortization: '3500.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-005',
                    date: '2026-01-10',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '20000.00',
                    credit: '0.00',
                    balance: '20000.00',
                    interest: '1000.00',
                    interest_balance: '1000.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Ana Capalad',
            pasbook_number: 'PB-2026-0004',
            account_name: 'Small Business Loan',
            account_short_name: 'SBL',
            address: 'Block 12 Lot 4, Barangay Prosperity',
            share_capital: '30000.00',
            release_date: '2026-02-20',
            maturity_date: '2027-02-20',
            mode_of_payment: 'Monthly Auto-Debit',
            amortization: '6500.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-022',
                    date: '2026-02-20',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '75000.00',
                    credit: '0.00',
                    balance: '75000.00',
                    interest: '6000.00',
                    interest_balance: '6000.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Danilo Reyes',
            pasbook_number: 'PB-2026-0005',
            account_name: 'Emergency Loan',
            account_short_name: 'EML',
            address: 'Purok 4, Barangay Prosperity',
            share_capital: '12000.00',
            release_date: '2026-03-15',
            maturity_date: '2026-09-15',
            mode_of_payment: 'Over-the-Counter',
            amortization: '4800.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-035',
                    date: '2026-03-15',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '30000.00',
                    credit: '0.00',
                    balance: '30000.00',
                    interest: '1800.00',
                    interest_balance: '1800.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Elena Alcantara',
            pasbook_number: 'PB-2026-0006',
            account_name: 'Regular Salary Loan',
            account_short_name: 'RSL',
            address: 'Mabini St, Barangay Prosperity',
            share_capital: '18000.00',
            release_date: '2026-01-22',
            maturity_date: '2026-07-22',
            mode_of_payment: 'GCash',
            amortization: '7200.00',
            ledger_entries: [
                {
                    ref_no: 'OR-100110',
                    date: '2026-02-22',
                    type: 'Amortization',
                    employee_name: 'Mark Teller',
                    debit: '0.00',
                    credit: '7500.00',
                    balance: '37500.00',
                    interest: '450.00',
                    interest_balance: '2250.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Fernando Poe Jr.',
            pasbook_number: 'PB-2026-0007',
            account_name: 'Calamity Loan',
            account_short_name: 'CAL',
            address: 'Bakabakahan Road, Barangay Prosperity',
            share_capital: '50000.00',
            release_date: '2026-04-05',
            maturity_date: '2027-04-05',
            mode_of_payment: 'Monthly Auto-Debit',
            amortization: '12500.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-048',
                    date: '2026-04-05',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '150000.00',
                    credit: '0.00',
                    balance: '150000.00',
                    interest: '12000.00',
                    interest_balance: '12000.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Grace Poe',
            pasbook_number: 'PB-2026-0008',
            account_name: 'Small Business Loan',
            account_short_name: 'SBL',
            address: 'Del Pilar Compound, Barangay Prosperity',
            share_capital: '22000.00',
            release_date: '2026-02-11',
            maturity_date: '2026-08-11',
            mode_of_payment: 'Over-the-Counter',
            amortization: '9300.00',
            ledger_entries: [
                {
                    ref_no: 'OR-100325',
                    date: '2026-03-11',
                    type: 'Amortization',
                    employee_name: 'Mark Teller',
                    debit: '0.00',
                    credit: '10000.00',
                    balance: '50000.00',
                    interest: '700.00',
                    interest_balance: '3500.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Hilario Davide',
            pasbook_number: 'PB-2026-0009',
            account_name: 'Regular Salary Loan',
            account_short_name: 'RSL',
            address: 'Riverside Walk, Barangay Prosperity',
            share_capital: '9500.00',
            release_date: '2026-05-12',
            maturity_date: '2026-11-12',
            mode_of_payment: 'GCash',
            amortization: '3100.00',
            ledger_entries: [
                {
                    ref_no: 'LN-26-061',
                    date: '2026-05-12',
                    type: 'Loan Release',
                    employee_name: 'Sarah Gomez',
                    debit: '18000.00',
                    credit: '0.00',
                    balance: '18000.00',
                    interest: '1080.00',
                    interest_balance: '1080.00',
                    fines: '0.00',
                    fines_balance: '0.00',
                    arrears: '0.00',
                },
            ],
        },
        {
            member_name: 'Irma Daldal',
            pasbook_number: 'PB-2026-0010',
            account_name: 'Emergency Loan',
            account_short_name: 'EML',
            address: 'Market Site, Barangay Prosperity',
            share_capital: '14000.00',
            release_date: '2026-01-20',
            maturity_date: '2026-07-20',
            mode_of_payment: 'Over-the-Counter',
            amortization: '5200.00',
            ledger_entries: [
                {
                    ref_no: 'OR-99940',
                    date: '2026-02-20',
                    type: 'Late Payment',
                    employee_name: 'Mark Teller',
                    debit: '0.00',
                    credit: '5833.33',
                    balance: '29166.67',
                    interest: '350.00',
                    interest_balance: '1750.00',
                    fines: '150.00',
                    fines_balance: '0.00',
                    arrears: '5200.00',
                },
            ],
        },
    ],
}

export const LEDGER_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILedgerReportTemplate,
    { presentation_style?: TPresentationStyle }
>[] = [
    {
        id: 'ledger-f1-t1',
        template_name: 'Format 1',
        report_name: 'LedgerReport',
        template: LEDGER_FORMAT1_T1,
        template_filter: { presentation_style: 'f1' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LEDGER_PREVIEW_DATA,
    },
    {
        id: 'ledger-f3-t1',
        template_name: 'Format 3',
        report_name: 'LedgerReport',
        template: LEDGER_FORMAT3_T1,
        template_filter: { presentation_style: 'f3' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LEDGER_PREVIEW_DATA,
    },
    {
        id: 'ledger-f4-t1',
        template_name: 'Format 4',
        report_name: 'LedgerReport',
        template: LEDGER_FORMAT4_T1,
        template_filter: { presentation_style: 'f4' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LEDGER_PREVIEW_DATA,
    },
]
