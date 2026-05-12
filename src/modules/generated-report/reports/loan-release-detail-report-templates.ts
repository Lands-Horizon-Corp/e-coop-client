import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanReleaseDetailSchema } from '../components/forms/loan-release-detail-create-report-form'
import CASH_RECEIPT_JOURNAL_T1 from './templates/journal-voucher-templates/jrnl-vchr-t1.njk?raw'

type TDataEntryItem = {
    passbook: string
    member_fullname: string
    account_short_name: string
    cv_no: string
    release_date: string
    due_date: string
    firt_pay_date: string
    terms: string
    mode_of_payment: string

    amortization: string | number
    current?: string | number
    restructured?: string | number
    renewal?: string | number
}

// START DO NOT EDIT
export interface ILoanReleaseDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment: string

    grouping: TLoanReleaseDetailSchema['groupings']

    // by mem type
    by_member_type_data_entry: Array<{
        member_type: string
        data_entries: TDataEntryItem[]
    }>

    // by mem class
    by_member_class_data_entry: Array<{
        member_class: string
        data_entries: TDataEntryItem[]
    }>

    // by coll
    by_collection_data_entry: Array<{
        collection_name: string
        data_entries: TDataEntryItem[]
    }>

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_JOURNAL_VOUCHER_PREVIEW_DATA: IJournalVoucherReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'JOURNAL VOUCHER REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        journal_voucher_entries: [
            {
                cv_no: 'JV-1001',
                payto: 'Juan Dela Cruz',
                particular: 'Office Supplies Expense',
            },
            {
                cv_no: 'JV-1002',
                payto: 'Maria Santos',
                particular: 'Transportation Allowance',
            },
            {
                cv_no: 'JV-1003',
                payto: 'Pedro Reyes',
                particular: 'Utility Expense Adjustment',
            },
            {
                cv_no: 'JV-1004',
                payto: 'Ana Lopez',
                particular: 'Miscellaneous Expense',
            },
            {
                cv_no: 'JV-1005',
                payto: 'Carlos Mendoza',
                particular: 'Internet Subscription Expense',
            },
            {
                cv_no: 'JV-1006',
                payto: 'Liza Ramos',
                particular: 'Repairs and Maintenance',
            },
        ],

        detailed_schedule_of_daily_journal_voucher_entries: [
            {
                cv_no: 'JV-1001',
                account_name: 'Office Supplies Expense',
                debit: 2500,
                credit: 0,
            },
            {
                cv_no: 'JV-1001',
                account_name: 'Cash on Hand',
                debit: 0,
                credit: 2500,
            },

            {
                cv_no: 'JV-1002',
                account_name: 'Transportation Expense',
                debit: 1800,
                credit: 0,
            },
            {
                cv_no: 'JV-1002',
                account_name: 'Cash in Bank',
                debit: 0,
                credit: 1800,
            },

            {
                cv_no: 'JV-1003',
                account_name: 'Utilities Expense',
                debit: 3200,
                credit: 0,
            },
            {
                cv_no: 'JV-1003',
                account_name: 'Accounts Payable',
                debit: 0,
                credit: 3200,
            },

            {
                cv_no: 'JV-1004',
                account_name: 'Miscellaneous Expense',
                debit: 950,
                credit: 0,
            },
            {
                cv_no: 'JV-1004',
                account_name: 'Petty Cash',
                debit: 0,
                credit: 950,
            },

            {
                cv_no: 'JV-1005',
                account_name: 'Internet Expense',
                debit: 4200,
                credit: 0,
            },
            {
                cv_no: 'JV-1005',
                account_name: 'Cash in Bank',
                debit: 0,
                credit: 4200,
            },

            {
                cv_no: 'JV-1006',
                account_name: 'Repairs and Maintenance',
                debit: 1750,
                credit: 0,
            },
            {
                cv_no: 'JV-1006',
                account_name: 'Accounts Payable',
                debit: 0,
                credit: 1750,
            },
        ],

        detailed_schedule_of_daily_journal_voucher_entries_totals: {
            total_debit: '14,400.00',
            total_credit: '14,400.00',
        },

        summary_of_daily_journal_voucher_entries: [
            {
                account_name: 'Office Supplies Expense',
                debit: 2500,
                credit: 0,
            },
            {
                account_name: 'Transportation Expense',
                debit: 1800,
                credit: 0,
            },
            {
                account_name: 'Utilities Expense',
                debit: 3200,
                credit: 0,
            },
            {
                account_name: 'Miscellaneous Expense',
                debit: 950,
                credit: 0,
            },
            {
                account_name: 'Internet Expense',
                debit: 4200,
                credit: 0,
            },
            {
                account_name: 'Repairs and Maintenance',
                debit: 1750,
                credit: 0,
            },

            {
                account_name: 'Cash on Hand',
                debit: 0,
                credit: 2500,
            },
            {
                account_name: 'Cash in Bank',
                debit: 0,
                credit: 6000,
            },
            {
                account_name: 'Accounts Payable',
                debit: 0,
                credit: 4950,
            },
            {
                account_name: 'Petty Cash',
                debit: 0,
                credit: 950,
            },
        ],

        summary_of_daily_journal_voucher_entries_totals: {
            total_debit: '14,400.00',
            total_credit: '14,400.00',
        },

        prepared_by: 'Prepared Person',
        checked_by: 'Checked Person',
        approved_by: 'Approved Person',

        density: 'normal',
    }

export const JOURNAL_VOUCHER_REPORT_TEMPLATES: GeneratedReportTemplate<IJournalVoucherReportTemplate>[] =
    [
        {
            id: 'journal-voucher-t1',
            template_name: 'Default',
            report_name: 'JournalVoucherReport',
            template: CASH_RECEIPT_JOURNAL_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_JOURNAL_VOUCHER_PREVIEW_DATA,
        },
    ]
