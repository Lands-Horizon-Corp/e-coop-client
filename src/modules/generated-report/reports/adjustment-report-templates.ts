import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import ADJUSTMENT_T1 from './templates/adjustment-templates/adj-t1.njk?raw'

// START DO NOT EDIT
export interface IAdjustmentReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR' // ignore this shit wla to not used here.
        short_name?: string
        name?: string
    }>

    adjustment_entries: Array<{
        cv_no: string
        posting_date: string
        pay_to: string

        // base sa account list, dynamic to
        [key: `account_${string}_credit`]: number | string
        [key: `account_${string}_debit`]: number | string

        // kung wla sa list yung account na inadjusted, sundry na mag fafall
        sundry_account_short_name?: string
        sundry_account_debit?: string | number
        sundry_account_credit?: string | number
    }>

    grand_total_debit?: string | number
    grand_total_credit?: string | number

    // Signatures
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_ADJUSTMENT_PREVIEW_DATA: IAdjustmentReportTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Main Street, Sample City',
    tax_number: '000-000-000-000',
    report_title: 'ADJUSTMENT TRANSACTION REPORT',

    start_date: '2024-10-01',
    end_date: '2024-10-31',

    showable_account_column_list: [
        {
            account_id: 'cash_on_hand',
            display_entry_type: 'DR',
            short_name: 'COH',
            name: 'Cash on Hand',
        },
        {
            account_id: 'accounts_payable',
            display_entry_type: 'CR',
            short_name: 'AP',
            name: 'Accounts Payable',
        },
        {
            account_id: 'misc_income',
            display_entry_type: 'CR',
            short_name: 'MISC INC',
            name: 'Miscellaneous Income',
        },
    ],

    adjustment_entries: [
        {
            cv_no: 'ADJ-1001',
            posting_date: '2024-10-05',
            pay_to: 'Juan Dela Cruz',
            account_cash_on_hand_debit: 1500,
            account_accounts_payable_credit: 1500,
        },
        {
            cv_no: 'ADJ-1002',
            posting_date: '2024-10-12',
            pay_to: 'Maria Santos',
            account_cash_on_hand_debit: 2750,
            account_misc_income_credit: 2750,
        },
        {
            cv_no: 'ADJ-1003',
            posting_date: '2024-10-18',
            pay_to: 'Pedro Reyes',
            account_cash_on_hand_debit: 900,
            sundry_account_short_name: 'Sundry Exp',
            sundry_account_credit: 900,
        },
    ],

    grand_total_debit: '5,150.00',
    grand_total_credit: '5,150.00',

    checked_by: 'Checked Person',
    approved_by: 'Approved Person',

    density: 'normal',
}

export const ADJUSTMENT_REPORT_TEMPLATES: GeneratedReportTemplate<IAdjustmentReportTemplate>[] =
    [
        {
            id: 'adjustment-t1',
            template_name: 'Default',
            report_name: 'AdjustmentReport',
            template: ADJUSTMENT_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_ADJUSTMENT_PREVIEW_DATA,
        },
    ]
