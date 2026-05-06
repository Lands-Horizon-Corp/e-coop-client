import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import DAILY_COLLECTION_SUMMARY_T1 from './templates/daily-collection-summary-templates/dly-col-summary-t1.njk?raw'

// START DO NOT EDIT
type TDataEntry = {
    or_1?: string
    or_2?: string

    // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
    // example format -> account_{account_id}_amount
    // example -> account_b8a1124_amount : 1250.50
    [key: `account_${string}_amount`]: number | string

    sundry_amount: number | string
}

type TSummaryEntry = {
    account_short_name?: string
    amount?: string | number
}

export interface IDailyCollectionSummaryReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string
    am_pm_time?: string // Galing sa end date to

    sundries_print_separate_page?: boolean // print ang summary_data_entries next page

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    collector_employee_entries?: Array<{
        employee_name?: string

        // pang main table
        data_entries?: Array<TDataEntry>

        // pang subtotal kay emplkoyeee
        data_entry_sub_totals: {
            // base sa account list
            [key: `account_${string}_amount`]: number | string
            sundries_total: string | number
        }

        // after mshoow ang sub total
        sundry_entries?: Array<{
            sundry_name: string
            sundries_total: string | number
        }>
    }>

    collector_employees_entries_grand_totals: {
        // base sa account list
        [key: `account_${string}_grand_amount`]: number | string
        sundries_grand_total: string | number
    }

    // summary - also known as sundries
    summary_data_entries?: Array<TSummaryEntry>
    summary_data_total?: number

    // Signatures
    checked_by?: string
    certified_by?: string
    approved_by?: string
}

// END DO NOT EDIT

export const SHARED_DAILY_COLLECTION_SUMMARY_PREVIEW_DATA: IDailyCollectionSummaryReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'DAILY COLLECTION SUMMARY REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',
        am_pm_time: '4:30 PM',

        sundries_print_separate_page: false,

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

        collector_employee_entries: [
            {
                employee_name: 'Juan Dela Cruz',
                data_entries: [
                    {
                        or_1: '1001',
                        or_2: '1001',
                        account_cash_on_hand_amount: 3000,
                        account_savings_amount: 1500,
                        account_share_cap_amount: 400,
                        account_reg_loan_amount: 250,
                        account_int_on_loan_amount: 75,
                        account_fines_pen_amount: 25,
                        sundry_amount: 120,
                    },
                    {
                        or_1: '1006',
                        or_2: '1002',
                        account_cash_on_hand_amount: 2500,
                        account_savings_amount: 1200,
                        account_share_cap_amount: 380,
                        account_reg_loan_amount: 200,
                        account_int_on_loan_amount: 60,
                        account_fines_pen_amount: 20,
                        sundry_amount: 80,
                    },
                    {
                        or_1: '1011',
                        or_2: '1003',
                        account_cash_on_hand_amount: 1800,
                        account_savings_amount: 900,
                        account_share_cap_amount: 300,
                        account_reg_loan_amount: 150,
                        account_int_on_loan_amount: 50,
                        account_fines_pen_amount: 15,
                        sundry_amount: 45,
                    },
                ],
                data_entry_sub_totals: {
                    account_cash_on_hand_amount: 7300,
                    account_savings_amount: 3600,
                    account_share_cap_amount: 1080,
                    account_reg_loan_amount: 600,
                    account_int_on_loan_amount: 185,
                    account_fines_pen_amount: 60,
                    sundries_total: 245,
                },
                sundry_entries: [
                    {
                        sundry_name: 'Processing Fee',
                        sundries_total: 120,
                    },
                    {
                        sundry_name: 'Penalty',
                        sundries_total: 80,
                    },
                    {
                        sundry_name: 'Documentary Stamp',
                        sundries_total: 45,
                    },
                ],
            },
            {
                employee_name: 'Maria Santos',
                data_entries: [
                    {
                        or_1: '1011',
                        or_2: '1004',
                        account_cash_on_hand_amount: 2200,
                        account_savings_amount: 1100,
                        account_share_cap_amount: 420,
                        account_reg_loan_amount: 190,
                        account_int_on_loan_amount: 55,
                        account_fines_pen_amount: 18,
                        sundry_amount: 90,
                    },
                    {
                        or_1: '1016',
                        or_2: '1005',
                        account_cash_on_hand_amount: 2600,
                        account_savings_amount: 1300,
                        account_share_cap_amount: 460,
                        account_reg_loan_amount: 210,
                        account_int_on_loan_amount: 65,
                        account_fines_pen_amount: 22,
                        sundry_amount: 110,
                    },
                ],
                data_entry_sub_totals: {
                    account_cash_on_hand_amount: 4800,
                    account_savings_amount: 2400,
                    account_share_cap_amount: 880,
                    account_reg_loan_amount: 400,
                    account_int_on_loan_amount: 120,
                    account_fines_pen_amount: 40,
                    sundries_total: 200,
                },
                sundry_entries: [
                    {
                        sundry_name: 'Service Charge',
                        sundries_total: 100,
                    },
                    {
                        sundry_name: 'Notarial Fee',
                        sundries_total: 50,
                    },
                    {
                        sundry_name: 'Others',
                        sundries_total: 50,
                    },
                ],
            },
            {
                employee_name: 'Pedro Reyes',
                data_entries: [
                    {
                        or_1: '1021',
                        or_2: '1006',
                        account_cash_on_hand_amount: 1700,
                        account_savings_amount: 800,
                        account_share_cap_amount: 250,
                        account_reg_loan_amount: 130,
                        account_int_on_loan_amount: 40,
                        account_fines_pen_amount: 10,
                        sundry_amount: 35,
                    },
                    {
                        or_1: '1022',
                        or_2: '1007',
                        account_cash_on_hand_amount: 2100,
                        account_savings_amount: 950,
                        account_share_cap_amount: 320,
                        account_reg_loan_amount: 160,
                        account_int_on_loan_amount: 45,
                        account_fines_pen_amount: 14,
                        sundry_amount: 50,
                    },
                    {
                        or_1: '1023',
                        or_2: '1008',
                        account_cash_on_hand_amount: 1950,
                        account_savings_amount: 870,
                        account_share_cap_amount: 290,
                        account_reg_loan_amount: 140,
                        account_int_on_loan_amount: 42,
                        account_fines_pen_amount: 12,
                        sundry_amount: 40,
                    },
                ],
                data_entry_sub_totals: {
                    account_cash_on_hand_amount: 5750,
                    account_savings_amount: 2620,
                    account_share_cap_amount: 860,
                    account_reg_loan_amount: 430,
                    account_int_on_loan_amount: 127,
                    account_fines_pen_amount: 36,
                    sundries_total: 125,
                },
                sundry_entries: [
                    {
                        sundry_name: 'Processing Fee',
                        sundries_total: 45,
                    },
                    {
                        sundry_name: 'Penalty',
                        sundries_total: 40,
                    },
                    {
                        sundry_name: 'Service Charge',
                        sundries_total: 40,
                    },
                ],
            },
        ],

        collector_employees_entries_grand_totals: {
            account_cash_on_hand_grand_amount: 17850,
            account_savings_grand_amount: 8620,
            account_share_cap_grand_amount: 2820,
            account_reg_loan_grand_amount: 1430,
            account_int_on_loan_grand_amount: 432,
            account_fines_pen_grand_amount: 136,
            sundries_grand_total: 570,
        },

        summary_data_entries: [
            {
                account_short_name: 'Processing Fee',
                amount: 210,
            },
            {
                account_short_name: 'Penalty',
                amount: 130,
            },
            {
                account_short_name: 'Service Charge',
                amount: 90,
            },
            {
                account_short_name: 'Doc. Stamp',
                amount: 55,
            },
            {
                account_short_name: 'Notarial Fee',
                amount: 45,
            },
            {
                account_short_name: 'Others',
                amount: 40,
            },
        ],
        summary_data_total: 570,

        checked_by: 'Checked Person',
        certified_by: 'Certified Person',
        approved_by: 'Approver Person',

        density: 'normal',
    }

export const DAILY_COLLECTION_SUMMARY_REPORT_TEMPLATES: GeneratedReportTemplate<IDailyCollectionSummaryReportTemplate>[] =
    [
        {
            id: 'daily-collection-summary-t1',
            template_name: 'Default',
            report_name: 'DailyCollectionSummaryReport',
            template: DAILY_COLLECTION_SUMMARY_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_DAILY_COLLECTION_SUMMARY_PREVIEW_DATA,
        },
    ]
