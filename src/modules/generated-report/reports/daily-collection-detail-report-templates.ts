import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import DAILY_COLLECTION_DETAIL_MULTI_COL_T1 from './templates/dly-col-det-mlti-col-t1.njk?raw'
import DAILY_COLLECTION_DETAIL_SINGLE_COL_T1 from './templates/dly-col-det-sgl-col-t1.njk?raw'

type TPresentationStyle = 'single-column' | 'multi-column'

type TStaticFilter = {
    presentation_style: TPresentationStyle
}

type TDataEntrySingleCol = {
    account_name: string
    account_short_name: string
    amount: string | number
}

type TDataEntryMultiCol = {
    date: string
    or_no: string
    passbook: string
    member_full_name: string

    // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
    // example format -> account_{account_id}_amount
    // example -> account_b8a1124_amount : 1250.50
    [key: `account_${string}_amount`]: number | string

    // IF THE CURRENT ENTRY AY HINDI KABILANG SA account_column_list which fall to Sundries
    sundry_name: string
    sundry_amount: number | string

    is_sundry_entry?: boolean // if entry is a sundry entry, meaning wla sa sa account_column list, so span ng sundry_name yung N account column list
}

type TCashCheckDataEntry = {
    description: string

    // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
    // example format -> account_{account_id}_amount
    // example -> account_b8a1124_amount : 1250.50
    [key: `account_${string}_amount`]: number | string

    sundry_amount: number | string
}

type TDetailEntry = {
    or_no: string
    passbook: string
    account_name: string
    credit: number | string
}

type TSummaryEntry = { account_name: string; credit_amount: number }

export interface IDailyCollectionDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    page_title: string
    batch_no: number

    account_name?: string // pag undefined, meaning all account

    groupings: 'by_teller' | 'no_grouping'

    presentation_style: TPresentationStyle

    tellers_count?: number // how many tellers selected

    print_summary_cash_check?: boolean // print ang summary_data_entries after grand total
    sundries_print_separate_page?: boolean // print ang summary_data_entries next page

    // for presentation style 'single-column'
    // former name -> single column format
    single_col_data?: {
        // pag grouping ay 'no grouping'
        data_entries?: Array<TDataEntrySingleCol>
        grand_total?: number | string

        // pag grouping ay 'by teller'
        by_teller_data_entries?: Array<{
            teller_name: string
            data_entries?: Array<TDataEntrySingleCol>
            grand_total?: number | string
        }>
    }

    // for presentation style 'multi-column'
    // former name -> format 1
    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    multi_column_data?: {
        // show ito if no grouping
        data_entries?: Array<TDataEntryMultiCol>
        grand_total?: number | string

        // detail
        detail_data_entries?: Array<TDetailEntry>
        detail_data_entries_total: string | number

        // show if print_summary_cash_check is naka true
        cash_check_data_entries?: Array<TCashCheckDataEntry>

        // summary - also known as sundries
        summary_data_entries?: Array<TSummaryEntry>
        summary_data_total?: number

        // only show this kung by teller
        by_teller_data_entries?: Array<{
            teller_name: string
            data_entries?: Array<TDataEntryMultiCol>
            grand_total?: number | string

            detail_data_entries?: Array<TDetailEntry>
            detail_data_entries_total: string | number

            summary_data_entries?: Array<TSummaryEntry>
            summary_data_total?: number
        }>
    }

    // Signatures
    prepared_by?: string
    certified_correct_by?: string
    approved_by?: string
}

export const SHARED_DAILY_COLLECTION_DETAIL_PREVIEW_DATA: IDailyCollectionDetailReportTemplate =
    {
        // IBaseReportTemplateData fields
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'DAILY COLLECTION DETAIL',

        // IDailyCollectionDetailReportTemplate fields
        start_date: '2024-10-01',
        end_date: '2024-10-31',
        page_title: 'Daily Collection Detail',
        batch_no: 2024001,

        groupings: 'no_grouping',
        presentation_style: 'single-column',

        sundries_print_separate_page: true,

        account_name: undefined,
        tellers_count: 1,

        single_col_data: {
            data_entries: [
                {
                    account_name: 'Savings Deposit - Regular',
                    account_short_name: 'SD-REG',
                    amount: 15000.5,
                },
                {
                    account_name: 'Share Capital - Common',
                    account_short_name: 'SC-COM',
                    amount: 5000.0,
                },
                {
                    account_name: 'Loan Receivable - Productive',
                    account_short_name: 'LR-PROD',
                    amount: '12,500.00',
                },
                {
                    account_name: 'Service Fees',
                    account_short_name: 'SF',
                    amount: 750.0,
                },
            ],
            grand_total: '33,250.50',

            by_teller_data_entries: [
                {
                    teller_name: 'Juan Dela Cruz',
                    data_entries: [
                        {
                            account_name: 'Savings Deposit - Regular',
                            account_short_name: 'SD-REG',
                            amount: 10000.0,
                        },
                        {
                            account_name: 'Share Capital - Common',
                            account_short_name: 'SC-COM',
                            amount: 3000.0,
                        },
                        {
                            account_name: 'Service Fees',
                            account_short_name: 'SF',
                            amount: 500.0,
                        },
                    ],
                    grand_total: '13,500.00',
                },
                {
                    teller_name: 'Maria Santos',
                    data_entries: [
                        {
                            account_name: 'Savings Deposit - Regular',
                            account_short_name: 'SD-REG',
                            amount: 5000.5,
                        },
                        {
                            account_name: 'Loan Receivable - Productive',
                            account_short_name: 'LR-PROD',
                            amount: '12,500.00',
                        },
                        {
                            account_name: 'Service Fees',
                            account_short_name: 'SF',
                            amount: 250.0,
                        },
                    ],
                    grand_total: '17,750.50',
                },
            ],
        },

        // 🔹 MULTI COLUMN CONFIG
        showable_account_column_list: [
            {
                account_id: 'acc_sd_reg',
                display_entry_type: 'CR',
                short_name: 'SD-REG',
                name: 'Savings Deposit - Regular',
            },
            {
                account_id: 'acc_sc_com',
                display_entry_type: 'CR',
                short_name: 'SC-COM',
                name: 'Share Capital - Common',
            },
            {
                account_id: 'acc_lr_prod',
                display_entry_type: 'CR',
                short_name: 'LR-PROD',
                name: 'Loan Receivable - Productive',
            },
        ],

        multi_column_data: {
            data_entries: [
                {
                    date: '2024-10-01',
                    or_no: 'OR-1001',
                    passbook: 'PB-001',
                    member_full_name: 'Juan Dela Cruz',

                    account_acc_sd_reg_amount: 5000,
                    account_acc_sc_com_amount: 2000,
                    account_acc_lr_prod_amount: 0,

                    sundry_name: '',
                    sundry_amount: 0,
                },
                {
                    date: '2024-10-01',
                    or_no: 'OR-1002',
                    passbook: 'PB-002',
                    member_full_name: 'Maria Santos',

                    account_acc_sd_reg_amount: 3000,
                    account_acc_sc_com_amount: 0,
                    account_acc_lr_prod_amount: 7000,

                    sundry_name: '',
                    sundry_amount: 0,
                },
                {
                    date: '2024-10-01',
                    or_no: 'OR-1003',
                    passbook: 'PB-003',
                    member_full_name: 'Pedro Reyes',

                    account_acc_sd_reg_amount: 0,
                    account_acc_sc_com_amount: 0,
                    account_acc_lr_prod_amount: 0,

                    sundry_name: 'Service Fee',
                    sundry_amount: 500,
                    is_sundry_entry: true,
                },
            ],

            grand_total: '17,500.00',

            // 🔹 DETAIL
            detail_data_entries: [
                {
                    or_no: 'OR-1001',
                    passbook: 'PB-001',
                    account_name: 'Savings Deposit - Regular',
                    credit: 5000,
                },
                {
                    or_no: 'OR-1002',
                    passbook: 'PB-002',
                    account_name: 'Loan Receivable - Productive',
                    credit: 7000,
                },
            ],
            detail_data_entries_total: '12,000.00',

            // 🔹 CASH/CHECK
            cash_check_data_entries: [
                {
                    description: 'Cash Collection',
                    account_acc_sd_reg_amount: 8000,
                    account_acc_sc_com_amount: 2000,
                    account_acc_lr_prod_amount: 7000,
                    sundry_amount: 500,
                },
                {
                    description: 'Check Collection',
                    account_acc_sd_reg_amount: 0,
                    account_acc_sc_com_amount: 0,
                    account_acc_lr_prod_amount: 0,
                    sundry_amount: 0,
                },
            ],

            // 🔹 SUMMARY
            summary_data_entries: [
                {
                    account_name: 'Service Fee',
                    credit_amount: 500,
                },
            ],
            summary_data_total: 500,

            // 🔹 By Teller Version
            by_teller_data_entries: [
                {
                    teller_name: 'Juan Dela Cruz',

                    data_entries: [
                        {
                            date: '2024-10-01',
                            or_no: 'OR-1001',
                            passbook: 'PB-001',
                            member_full_name: 'Juan Dela Cruz',

                            account_acc_sd_reg_amount: 5000,
                            account_acc_sc_com_amount: 2000,
                            account_acc_lr_prod_amount: 0,

                            sundry_name: '',
                            sundry_amount: 0,
                        },
                    ],
                    grand_total: '7,000.00',

                    detail_data_entries: [
                        {
                            or_no: 'OR-1001',
                            passbook: 'PB-001',
                            account_name: 'Savings Deposit - Regular',
                            credit: 5000,
                        },
                    ],
                    detail_data_entries_total: '5,000.00',

                    summary_data_entries: [],
                    summary_data_total: 0,
                },
                {
                    teller_name: 'Maria Santos',

                    data_entries: [
                        {
                            date: '2024-10-01',
                            or_no: 'OR-1002',
                            passbook: 'PB-002',
                            member_full_name: 'Maria Santos',

                            account_acc_sd_reg_amount: 3000,
                            account_acc_sc_com_amount: 0,
                            account_acc_lr_prod_amount: 7000,

                            sundry_name: '',
                            sundry_amount: 0,
                        },
                        {
                            date: '2024-10-01',
                            or_no: 'OR-1003',
                            passbook: 'PB-003',
                            member_full_name: 'Pedro Reyes',

                            account_acc_sd_reg_amount: 0,
                            account_acc_sc_com_amount: 0,
                            account_acc_lr_prod_amount: 0,

                            sundry_name: 'Service Fee',
                            sundry_amount: 500,
                            is_sundry_entry: true,
                        },
                    ],
                    grand_total: '10,500.00',

                    detail_data_entries: [
                        {
                            or_no: 'OR-1002',
                            passbook: 'PB-002',
                            account_name: 'Loan Receivable - Productive',
                            credit: 7000,
                        },
                    ],
                    detail_data_entries_total: '7,000.00',

                    summary_data_entries: [
                        {
                            account_name: 'Service Fee',
                            credit_amount: 500,
                        },
                    ],
                    summary_data_total: 500,
                },
            ],
        },

        // IBaseReportTemplateCheck fields
        density: 'normal',
    }

export const DAILY_COLLECTION_DETAIL_REPORT_TEMPLATES: GeneratedReportTemplate<
    IDailyCollectionDetailReportTemplate,
    TStaticFilter
>[] = [
    {
        id: 'daily-collection-detail-mlti-col-t1',
        template_name: 'Multi Column',
        report_name: 'DailyCollectionReport',
        template: DAILY_COLLECTION_DETAIL_MULTI_COL_T1,
        template_filter: { presentation_style: 'multi-column' },
        default_unit: 'in',
        width: '8.5in',
        height: '11in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_DAILY_COLLECTION_DETAIL_PREVIEW_DATA,
    },
    {
        id: 'daily-collection-detail-sgl-col-t1',
        template_name: 'Single Column',
        report_name: 'DailyCollectionReport',
        template: DAILY_COLLECTION_DETAIL_SINGLE_COL_T1,
        template_filter: { presentation_style: 'single-column' },
        default_unit: 'in',
        width: '8.5in',
        height: '11in',
        density: 'normal',
        orientation: 'portrait',
        preview_data: SHARED_DAILY_COLLECTION_DETAIL_PREVIEW_DATA,
    },
]
