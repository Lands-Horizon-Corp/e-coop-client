import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import CASH_RECEIPT_JOURNAL_T1 from './templates/cash-receipt-journal-templates/csh-rcpt-journal-t1.njk?raw'

// START DO NOT EDIT
export interface ICashReceiptJournalReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    employee_cash_receipt_journal_entries?: Array<{
        data_entries: Array<{
            teller_name: string
            beginning_balance_credit_amount?: string | number
            cash_on_hand_debit_amount?: string | number
            ar_teller_collector_debit?: string | number
            ar_teller_collector_credit?: string | number

            // Naka define sa showable account column list
            // only shows if show_showable_account_column_list true
            [key: `account_${string}_amount`]: string | number

            sundry_total?: string | number
            sundry_name?: string | number
        }>

        // pang sub total of current teller
        starting_or?: string
        ending_or?: string
        subtotal_amount?: string | number
    }>
    cash_receipt_journal_entry_grand_total: string | number

    sundries_summary_entries: {
        account_short_name: string | number
        amount?: string | number
    }
    sundries_summary_entries_grand_total?: string | number

    // Signatures
    prepared_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_CASH_RECEIPT_JOURNAL_PREVIEW_DATA: ICashReceiptJournalReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'CASH RECEIPT JOURNAL REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        showable_account_column_list: [
            {
                account_id: 'cash_on_hand',
                display_entry_type: 'CR',
                short_name: 'Cash on Hand',
                name: 'Cash on Hand',
            },
            {
                account_id: 'savings',
                display_entry_type: 'CR',
                short_name: 'Savings',
                name: 'Savings',
            },
            {
                account_id: 'share_cap',
                display_entry_type: 'CR',
                short_name: 'ShareCap',
                name: 'Share Capital',
            },
            {
                account_id: 'reg_loan',
                display_entry_type: 'DR',
                short_name: 'Reg.Loan',
                name: 'Regular Loan',
            },
            {
                account_id: 'int_on_loan',
                display_entry_type: 'CR',
                short_name: 'Int.OnLoan',
                name: 'Interest on Loan',
            },
            {
                account_id: 'fines_pen',
                display_entry_type: 'CR',
                short_name: 'Fines/Pen.',
                name: 'Fines and Penalties',
            },
        ],

        employee_cash_receipt_journal_entries: [
            {
                data_entries: [
                    {
                        teller_name: 'Juan Dela Cruz',
                        beginning_balance_credit_amount: 1200,
                        cash_on_hand_debit_amount: 3000,
                        ar_teller_collector_debit: 500,
                        ar_teller_collector_credit: 300,
                        account_cash_on_hand_amount: 3000,
                        account_savings_amount: 1500,
                        account_share_cap_amount: 400,
                        account_reg_loan_amount: 250,
                        account_int_on_loan_amount: 75,
                        account_fines_pen_amount: 25,
                        sundry_total: 120,
                        sundry_name: 'Processing Fee',
                    },
                    {
                        teller_name: 'Juan Dela Cruz',
                        beginning_balance_credit_amount: 1200,
                        cash_on_hand_debit_amount: 1800,
                        ar_teller_collector_debit: 200,
                        ar_teller_collector_credit: 150,
                        account_cash_on_hand_amount: 1800,
                        account_savings_amount: 900,
                        account_share_cap_amount: 220,
                        account_reg_loan_amount: 120,
                        account_int_on_loan_amount: 40,
                        account_fines_pen_amount: 12,
                        sundry_total: 60,
                        sundry_name: 'Documentary Stamp',
                    },
                    {
                        teller_name: 'Juan Dela Cruz',
                        beginning_balance_credit_amount: 1200,
                        cash_on_hand_debit_amount: 0,
                        ar_teller_collector_debit: 0,
                        ar_teller_collector_credit: 0,
                        sundry_total: 85,
                        sundry_name: 'Notarial Fee',
                    },
                    {
                        teller_name: 'Juan Dela Cruz',
                        beginning_balance_credit_amount: 1200,
                        cash_on_hand_debit_amount: 0,
                        ar_teller_collector_debit: 0,
                        ar_teller_collector_credit: 0,
                        sundry_total: 40,
                        sundry_name: 'Membership Form',
                    },
                ],
                starting_or: '1001',
                ending_or: '1010',
                subtotal_amount: 305,
            },
            {
                data_entries: [
                    {
                        teller_name: 'Maria Santos',
                        beginning_balance_credit_amount: 900,
                        cash_on_hand_debit_amount: 2600,
                        ar_teller_collector_debit: 350,
                        ar_teller_collector_credit: 180,
                        account_cash_on_hand_amount: 2600,
                        account_savings_amount: 1300,
                        account_share_cap_amount: 460,
                        account_reg_loan_amount: 210,
                        account_int_on_loan_amount: 65,
                        account_fines_pen_amount: 22,
                        sundry_total: 95,
                        sundry_name: 'Service Charge',
                    },
                    {
                        teller_name: 'Maria Santos',
                        beginning_balance_credit_amount: 900,
                        cash_on_hand_debit_amount: 0,
                        ar_teller_collector_debit: 0,
                        ar_teller_collector_credit: 0,
                        sundry_total: 130,
                        sundry_name: 'Insurance Premium',
                    },
                    {
                        teller_name: 'Maria Santos',
                        beginning_balance_credit_amount: 900,
                        cash_on_hand_debit_amount: 0,
                        ar_teller_collector_debit: 0,
                        ar_teller_collector_credit: 0,
                        sundry_total: 55,
                        sundry_name: 'Ledger Card',
                    },
                ],
                starting_or: '1011',
                ending_or: '1015',
                subtotal_amount: 280,
            },
        ],

        cash_receipt_journal_entry_grand_total: 16994,

        sundries_summary_entries: {
            account_short_name: 'Sundries Total',
            amount: 585,
        },
        sundries_summary_entries_grand_total: 585,

        prepared_by: 'Prepared Person',
        approved_by: 'Approver Person',

        density: 'normal',
    }

export const CASH_RECEIPT_JOURNAL_REPORT_TEMPLATES: GeneratedReportTemplate<ICashReceiptJournalReportTemplate>[] =
    [
        {
            id: 'cash-receipt-journal-t1',
            template_name: 'Default',
            report_name: 'DailyCashReceiptReport',
            template: CASH_RECEIPT_JOURNAL_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_CASH_RECEIPT_JOURNAL_PREVIEW_DATA,
        },
    ]
