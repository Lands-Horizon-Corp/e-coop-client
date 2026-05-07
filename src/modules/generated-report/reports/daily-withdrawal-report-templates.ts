import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import DAILY_WITHDRAWAL_T1 from './templates/daily-withdrawal-templates/dly-wthdrwl-t1.njk?raw'

// START DO NOT EDIT
export interface IDailyWithdrawalReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    show_date_column?: boolean // this was former format #2
    show_showable_account_column_list?: boolean // this was former format #6

    withdrawal_entries?: Array<{
        // format # 1
        teller_name: string
        date: string // Only shows on format #2
        reference_no: string

        passbook_no?: string
        member_full_name?: string

        // Naka define sa showable account column list
        // only shows if show_showable_account_column_list true
        [key: `account_${string}_amount`]: string | number

        total?: string | number
    }>
    withdrawal_entries_grand_total: string | number

    teller_summary_withdrawal_entries: {
        teller_name: string | number

        // base sa showable account column list
        // only shows if show_showable_account_column_list true
        [key: `account_${string}_grand_amount`]: number | string

        total?: string | number
    }
    teller_summary_withdrawal_entries_grand_total?: string | number

    trx_count?: string | number

    // Signatures
    prepared_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_DAILY_WITHDRAWAL_PREVIEW_DATA: IDailyWithdrawalReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'WITHDRAWAL TRANSACTION REPORT',

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

        show_date_column: true,
        show_showable_account_column_list: true,

        withdrawal_entries: [
            {
                teller_name: 'Juan Dela Cruz',
                date: '2024-10-01',
                reference_no: 'DWR-0001',
                passbook_no: 'PB-001',
                member_full_name: 'Member One',
                account_cash_on_hand_amount: 3000,
                account_savings_amount: 1500,
                account_share_cap_amount: 400,
                account_reg_loan_amount: 250,
                account_int_on_loan_amount: 75,
                account_fines_pen_amount: 25,
                total: 5250,
            },
            {
                teller_name: 'Maria Santos',
                date: '2024-10-01',
                reference_no: 'DWR-0002',
                passbook_no: 'PB-002',
                member_full_name: 'Member Two',
                account_cash_on_hand_amount: 2600,
                account_savings_amount: 1300,
                account_share_cap_amount: 460,
                account_reg_loan_amount: 210,
                account_int_on_loan_amount: 65,
                account_fines_pen_amount: 22,
                total: 4657,
            },
        ],

        withdrawal_entries_grand_total: 9907,

        teller_summary_withdrawal_entries: {
            teller_name: 'All Tellers',
            account_cash_on_hand_grand_amount: 5600,
            account_savings_grand_amount: 2800,
            account_share_cap_grand_amount: 860,
            account_reg_loan_grand_amount: 460,
            account_int_on_loan_grand_amount: 140,
            account_fines_pen_grand_amount: 47,
            total: 9907,
        },
        teller_summary_withdrawal_entries_grand_total: 9907,
        trx_count: 2,

        prepared_by: 'Prepared Person',
        approved_by: 'Approver Person',

        density: 'normal',
    }

export const DAILY_WITHDRAWAL_REPORT_TEMPLATES: GeneratedReportTemplate<IDailyWithdrawalReportTemplate>[] =
    [
        {
            id: 'daily-withdrawal-t1',
            template_name: 'Default',
            report_name: 'DailyWithdrawalReport',
            template: DAILY_WITHDRAWAL_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_DAILY_WITHDRAWAL_PREVIEW_DATA,
        },
    ]
