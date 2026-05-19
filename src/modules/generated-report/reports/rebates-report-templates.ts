import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import REBATES_T1 from './templates/rebates-templates/rbts-t1.njk?raw'

// START DO NOT EDIT

export interface IRebatesReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    data_entries?: Array<{
        passbook?: string

        member_name?: string

        cv_no?: string
        term?: string

        principal_amount?: string | number
        date_released?: string
        due_date?: string
        date_paid?: string

        unused_days?: string | number

        // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
        // example format -> account_{account_id}_amount
        // example -> account_b8a1124_amount : 1250.50
        [key: `account_${string}_amount`]: number | string

        sundry_amount: number | string
    }>

    collector_employees_entries_grand_totals: {
        // naka base sa account list
        [key: `account_${string}_grand_amount`]: number | string
        sundries_grand_total: string | number
    }

    gl_entries?: Array<{
        account_name?: string

        debit?: string | number
        credit?: string | number
    }>
    gl_entries_total?: number

    // Signatures
    checked_by?: string
    approved_by?: string
}

// END DO NOT EDIT

export const SHARED_REBATES_PREVIEW_DATA: IRebatesReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'REBATES REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        showable_account_column_list: [
            {
                account_id: 'rebate_receivable',
                display_entry_type: 'CR',
                short_name: 'Reb. Rec.',
                name: 'Rebate Receivable',
            },
            {
                account_id: 'rebate_payable',
                display_entry_type: 'CR',
                short_name: 'Reb. Pay.',
                name: 'Rebate Payable',
            },
            {
                account_id: 'rebate_expense',
                display_entry_type: 'CR',
                short_name: 'Reb. Exp.',
                name: 'Rebate Expense',
            },
        ],

        data_entries: [
            {
                passbook: 'PB-1001',
                member_name: 'Juan Dela Cruz',
                cv_no: 'CV-001',
                term: '12 mos',
                principal_amount: 15000,
                date_released: '2024-01-15',
                due_date: '2025-01-15',
                date_paid: '2024-10-20',
                unused_days: 87,
                account_rebate_receivable_amount: 1250,
                account_rebate_payable_amount: 900,
                account_rebate_expense_amount: 250,
                sundry_amount: 100,
            },
            {
                passbook: 'PB-1002',
                member_name: 'Maria Santos',
                cv_no: 'CV-002',
                term: '18 mos',
                principal_amount: 20000,
                date_released: '2024-02-01',
                due_date: '2025-08-01',
                date_paid: '2024-10-25',
                unused_days: 64,
                account_rebate_receivable_amount: 1700,
                account_rebate_payable_amount: 1200,
                account_rebate_expense_amount: 320,
                sundry_amount: 130,
            },
            {
                passbook: 'PB-1003',
                member_name: 'Pedro Reyes',
                cv_no: 'CV-003',
                term: '24 mos',
                principal_amount: 18000,
                date_released: '2024-03-10',
                due_date: '2026-03-10',
                date_paid: '2024-10-28',
                unused_days: 41,
                account_rebate_receivable_amount: 1400,
                account_rebate_payable_amount: 1000,
                account_rebate_expense_amount: 280,
                sundry_amount: 90,
            },
        ],

        collector_employees_entries_grand_totals: {
            account_rebate_receivable_grand_amount: 4350,
            account_rebate_payable_grand_amount: 3100,
            account_rebate_expense_grand_amount: 850,
            sundries_grand_total: 320,
        },

        gl_entries: [
            {
                account_name: 'Rebate Receivable',
                debit: 4350,
                credit: 0,
            },
            {
                account_name: 'Rebate Payable',
                debit: 0,
                credit: 3100,
            },
            {
                account_name: 'Rebate Expense',
                debit: 850,
                credit: 0,
            },
        ],
        gl_entries_total: 5200,

        checked_by: 'Checked Person',
        approved_by: 'Approver Person',

        density: 'normal',
    }

export const REBATES_REPORT_TEMPLATES: GeneratedReportTemplate<IRebatesReportTemplate>[] =
    [
        {
            id: 'rebates-report-t1',
            template_name: 'Default',
            report_name: 'RebateReport',
            template: REBATES_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_REBATES_PREVIEW_DATA,
        },
    ]
