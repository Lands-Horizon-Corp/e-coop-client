import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import TRANSACTION_BATCH_T1 from './templates/transaction-batch-templates/trnsctn-btch-t1.njk?raw'

// START DO NOT EDIT
export interface ITransactionBatchReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    batch_number?: number

    employee_id?: string
    employee_name?: string
    employee_user_name?: string

    or_validated_slip?: string | number
    beginning_balance?: string | number

    total_cash_handled?: string | number
    withdrawal?: string | number
    loan_release?: string | number
    cash_disbursement?: string | number

    //
    summary_accounts_data_entries?: Array<{
        account_name?: string
        debit?: string | number
        credit?: string | number
    }>
    summary_accounts_data_entries_totals: {
        total_debit?: string | number
        total_credit?: string | number
    }

    cash_remittance_data_entries?: Array<{
        bill_coin_name?: string
        quantity?: number
        amount: string | number
    }>
    cash_remittance_data_entries_total?: string | number

    total_check_remittance?: string | number
    total_petty_cash_remittance?: string | number
    total_transfer_to_rf?: string | number
    total_commercial_check?: string | number
    total_deposit_in_bank?: string | number

    cash_accounted_remittance?: string | number
    total_remittance?: string | number
    overage_shortage?: string | number

    // Signatures
    prepared_by?: string
    acknowledged_by?: string
    certified_by?: string
}
// END DO NOT EDIT

export const SHARED_TRANSACTION_BATCH_PREVIEW_DATA: ITransactionBatchReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'TRANSACTION BATCH REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        batch_number: 20241031,

        employee_id: 'EMP-0001',
        employee_name: 'Juan Dela Cruz',
        employee_user_name: 'juandelacruz',

        or_validated_slip: 'OR-1001 - OR-1050',
        beginning_balance: '15,000.00',

        total_cash_handled: '125,500.00',
        withdrawal: '18,500.00',
        loan_release: '45,000.00',
        cash_disbursement: '12,000.00',

        summary_accounts_data_entries: [
            {
                account_name: 'Cash on Hand',
                debit: '50,000.00',
                credit: '0.00',
            },
            {
                account_name: 'Savings Deposit',
                debit: '25,000.00',
                credit: '0.00',
            },
            {
                account_name: 'Share Capital',
                debit: '15,500.00',
                credit: '0.00',
            },
            {
                account_name: 'Loan Receivable',
                debit: '0.00',
                credit: '45,000.00',
            },
            {
                account_name: 'Withdrawal',
                debit: '0.00',
                credit: '18,500.00',
            },
            {
                account_name: 'Cash Disbursement',
                debit: '0.00',
                credit: '12,000.00',
            },
        ],

        summary_accounts_data_entries_totals: {
            total_debit: '90,500.00',
            total_credit: '75,500.00',
        },

        cash_remittance_data_entries: [
            {
                bill_coin_name: '₱1000',
                quantity: 40,
                amount: '40,000.00',
            },
            {
                bill_coin_name: '₱500',
                quantity: 30,
                amount: '15,000.00',
            },
            {
                bill_coin_name: '₱200',
                quantity: 20,
                amount: '4,000.00',
            },
            {
                bill_coin_name: '₱100',
                quantity: 50,
                amount: '5,000.00',
            },
            {
                bill_coin_name: '₱50',
                quantity: 40,
                amount: '2,000.00',
            },
            {
                bill_coin_name: '₱20',
                quantity: 100,
                amount: '2,000.00',
            },
            {
                bill_coin_name: 'Coins',
                quantity: 1,
                amount: '850.00',
            },
        ],

        cash_remittance_data_entries_total: '68,850.00',

        total_check_remittance: '20,000.00',
        total_petty_cash_remittance: '2,500.00',
        total_transfer_to_rf: '5,000.00',
        total_commercial_check: '10,000.00',
        total_deposit_in_bank: '15,000.00',

        cash_accounted_remittance: '121,350.00',
        total_remittance: '121,350.00',
        overage_shortage: '0.00',

        prepared_by: 'Prepared Person',
        acknowledged_by: 'Acknowledged Person',
        certified_by: 'Certified Person',

        density: 'normal',
    }

export const TRANSACTION_BATCH_REPORT_TEMPLATES: GeneratedReportTemplate<ITransactionBatchReportTemplate>[] =
    [
        {
            id: 'transaction-batch-t1',
            template_name: 'Default',
            report_name: 'TransactionBatchReport',
            template: TRANSACTION_BATCH_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_TRANSACTION_BATCH_PREVIEW_DATA,
        },
    ]
