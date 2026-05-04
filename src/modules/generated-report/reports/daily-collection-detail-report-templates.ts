import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import DAILY_COLLECTION_DETAIL_MULTI_COL_T1 from './templates/daily-collection-templates/dly-col-det-mlti-col-t1.njk?raw'
import DAILY_COLLECTION_DETAIL_SINGLE_COL_T1 from './templates/daily-collection-templates/dly-col-det-sgl-col-t1.njk?raw'

type TPresentationStyle = 'single-column' | 'multi-column' | 'detailed-summary'

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

type TSummaryEntry = { account_name: string; credit_amount: string | number }

type TDataDetailSummaryEntry = {
    member_full_name: string
    or_no: string
    rem: string

    regular_associate_type?: string
    regular_associate_amount?: string

    // QUESTION: Tf is Share capital column shows?
    // nasa table pero walang column name yung sub column
    // wla din value
    share_capital: string | number

    sundries_account_name: string
    sudries_account_short_name?: string

    total: string | number
}

type TDataDetailSummarySummaryEntry = TSummaryEntry & {
    debit_amount: string | number

    bill_coin_name: string | number
    count: string | number
    bill_coin_count_total: string | number
}

export interface IDailyCollectionDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    page_title: string
    batch_no: number

    account_name?: string // pag undefined, meaning all account

    groupings: 'by-teller' | 'no-grouping'

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

            cash_check_data_entries?: Array<TCashCheckDataEntry>

            detail_data_entries?: Array<TDetailEntry>
            detail_data_entries_total: string | number

            summary_data_entries?: Array<TSummaryEntry>
            summary_data_total?: number
        }>
    }

    // for presentation style 'detailed-summary'
    // former name -> format 2

    detailed_summary_data?: {
        data_entries?: Array<TDataDetailSummaryEntry>
        grand_total_sundries?: string | number
        grand_total_total?: string | number

        summary_data_entries?: Array<TDataDetailSummarySummaryEntry>
        summary_data_entry_total?: {
            sundy_debit_total: string | number
            sundy_credit_total: string | number

            cash_count_total: string | number
        }

        summary: {
            number_of_member_borrower_visited: string | number
            number_of_member_borrwoer_responded: string | number

            last_no_of_or_used: string | number
            last_no_of_or_used_or_nos_from: string | number
            last_no_of_or_used_or_nos_to: string | number
            last_no_of_or_used_or_nos_from_2: string | number
            last_no_of_or_used_or_nos_to_2: string | number

            last_of_no_msp_or_used: string | number
            last_of_no_msp_or_used_or_nos_from: string | number
            last_of_no_msp_or_used_or_nos_to: string | number
            last_of_no_msp_or_used_or_nos_from_2: string | number
            last_of_no_msp_or_used_or_nos_to_2: string | number

            loan_recievable_adm: string | number
            loan_recievable_pda: string | number
            loan_recievable_pdi: string | number
            loan_recievable_total: string | number
        }

        by_teller_data_entries?: Array<{
            teller_name: string

            data_entries?: Array<TDataDetailSummaryEntry>
            grand_total_sundries?: string | number
            grand_total_total?: string | number

            summary_data_entries?: Array<TDataDetailSummarySummaryEntry>
            summary_data_entry_total?: {
                sundy_debit_total: string | number
                sundy_credit_total: string | number

                cash_count_total: string | number
            }

            summary: {
                number_of_member_borrower_visited: string | number
                number_of_member_borrwoer_responded: string | number

                last_no_of_or_used: string | number
                last_no_of_or_used_or_nos_from: string | number
                last_no_of_or_used_or_nos_to: string | number
                last_no_of_or_used_or_nos_from_2: string | number
                last_no_of_or_used_or_nos_to_2: string | number

                last_of_no_msp_or_used: string | number
                last_of_no_msp_or_used_or_nos_from: string | number
                last_of_no_msp_or_used_or_nos_to: string | number
                last_of_no_msp_or_used_or_nos_from_2: string | number
                last_of_no_msp_or_used_or_nos_to_2: string | number

                loan_recievable_adm: string | number
                loan_recievable_pda: string | number
                loan_recievable_pdi: string | number
                loan_recievable_total: string | number
            }
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

        groupings: 'no-grouping',
        presentation_style: 'single-column',

        sundries_print_separate_page: true,
        print_summary_cash_check: true,

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
                    description: 'COH - (CASH)',
                    account_acc_sd_reg_amount: 8000,
                    account_acc_sc_com_amount: 2000,
                    account_acc_lr_prod_amount: 7000,
                    sundry_amount: 500,
                },
                {
                    description: 'COCI - (CHECK)',
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

                    cash_check_data_entries: [
                        {
                            description: 'COH - (CASH)',
                            account_acc_sd_reg_amount: 8000,
                            account_acc_sc_com_amount: 2000,
                            account_acc_lr_prod_amount: 7000,
                            sundry_amount: 500,
                        },
                        {
                            description: 'COCI - (CHECK)',
                            account_acc_sd_reg_amount: 0,
                            account_acc_sc_com_amount: 0,
                            account_acc_lr_prod_amount: 0,
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

        // 🔹 DETAILED SUMMARY
        detailed_summary_data: {
            data_entries: [
                {
                    member_full_name: 'Juan Dela Cruz',
                    or_no: 'OR-2001',
                    rem: 'On-time payment',
                    regular_associate_type: 'Regular',
                    regular_associate_amount: '1,000.00',
                    share_capital: 500,
                    sundries_account_name: 'Service Fee',
                    sudries_account_short_name: 'SF',
                    total: '1,500.00',
                },
            ],
            grand_total_sundries: '500.00',
            grand_total_total: '1,500.00',
            summary_data_entries: [
                {
                    account_name: 'Service Fee',
                    credit_amount: 500,
                    debit_amount: 0,
                    bill_coin_name: '₱500',
                    count: 1,
                    bill_coin_count_total: 500,
                },
            ],
            summary_data_entry_total: {
                sundy_debit_total: 0,
                sundy_credit_total: 500,
                cash_count_total: 500,
            },
            summary: {
                number_of_member_borrower_visited: 2,
                number_of_member_borrwoer_responded: 1,
                last_no_of_or_used: 'OR-2001',
                last_no_of_or_used_or_nos_from: 'OR-2001',
                last_no_of_or_used_or_nos_to: 'OR-2001',
                last_no_of_or_used_or_nos_from_2: '',
                last_no_of_or_used_or_nos_to_2: '',
                last_of_no_msp_or_used: 'MSP-101',
                last_of_no_msp_or_used_or_nos_from: 'MSP-100',
                last_of_no_msp_or_used_or_nos_to: 'MSP-101',
                last_of_no_msp_or_used_or_nos_from_2: '',
                last_of_no_msp_or_used_or_nos_to_2: '',
                loan_recievable_adm: '500.00',
                loan_recievable_pda: '500.00',
                loan_recievable_pdi: '500.00',
                loan_recievable_total: '1,500.00',
            },

            by_teller_data_entries: [
                {
                    teller_name: 'Juan Dela Cruz',
                    data_entries: [
                        {
                            member_full_name: 'Juan Dela Cruz',
                            or_no: 'OR-2001',
                            rem: 'On-time payment',
                            regular_associate_type: 'Regular',
                            regular_associate_amount: '1,000.00',
                            share_capital: 500,
                            sundries_account_name: 'Service Fee',
                            sudries_account_short_name: 'SF',
                            total: '1,500.00',
                        },
                    ],
                    grand_total_sundries: '500.00',
                    grand_total_total: '1,500.00',
                    summary_data_entries: [
                        {
                            account_name: 'Service Fee',
                            credit_amount: 500,
                            debit_amount: 0,
                            bill_coin_name: '₱500',
                            count: 1,
                            bill_coin_count_total: 500,
                        },
                    ],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 500,
                        cash_count_total: 500,
                    },
                    summary: {
                        number_of_member_borrower_visited: 2,
                        number_of_member_borrwoer_responded: 1,
                        last_no_of_or_used: 'OR-2001',
                        last_no_of_or_used_or_nos_from: 'OR-2001',
                        last_no_of_or_used_or_nos_to: 'OR-2001',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: 'MSP-101',
                        last_of_no_msp_or_used_or_nos_from: 'MSP-100',
                        last_of_no_msp_or_used_or_nos_to: 'MSP-101',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: '500.00',
                        loan_recievable_pda: '500.00',
                        loan_recievable_pdi: '500.00',
                        loan_recievable_total: '1,500.00',
                    },
                },

                {
                    teller_name: 'Maria Santos',
                    data_entries: [
                        {
                            member_full_name: 'Maria Santos',
                            or_no: 'OR-3001',
                            rem: 'Late payment',
                            regular_associate_type: 'Regular',
                            regular_associate_amount: '3,000.00',
                            share_capital: 1000,
                            sundries_account_name: 'Service Fee',
                            sudries_account_short_name: 'SF',
                            total: '4,000.00',
                        },
                    ],
                    grand_total_sundries: '1,000.00',
                    grand_total_total: '4,000.00',
                    summary_data_entries: [
                        {
                            account_name: 'Service Fee',
                            credit_amount: 1000,
                            debit_amount: 0,
                            bill_coin_name: '₱1000',
                            count: 1,
                            bill_coin_count_total: 1000,
                        },
                    ],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 1000,
                        cash_count_total: 1000,
                    },
                    summary: {
                        number_of_member_borrower_visited: 3,
                        number_of_member_borrwoer_responded: 2,
                        last_no_of_or_used: 'OR-3001',
                        last_no_of_or_used_or_nos_from: 'OR-3001',
                        last_no_of_or_used_or_nos_to: 'OR-3001',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: 'MSP-200',
                        last_of_no_msp_or_used_or_nos_from: 'MSP-180',
                        last_of_no_msp_or_used_or_nos_to: 'MSP-200',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: '2,000.00',
                        loan_recievable_pda: '1,000.00',
                        loan_recievable_pdi: '1,000.00',
                        loan_recievable_total: '4,000.00',
                    },
                },

                {
                    teller_name: 'Carlos Mendoza',
                    data_entries: [],
                    grand_total_sundries: 0,
                    grand_total_total: 0,
                    summary_data_entries: [],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 0,
                        cash_count_total: 0,
                    },
                    summary: {
                        number_of_member_borrower_visited: 0,
                        number_of_member_borrwoer_responded: 0,
                        last_no_of_or_used: '',
                        last_no_of_or_used_or_nos_from: '',
                        last_no_of_or_used_or_nos_to: '',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: '',
                        last_of_no_msp_or_used_or_nos_from: '',
                        last_of_no_msp_or_used_or_nos_to: '',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: 0,
                        loan_recievable_pda: 0,
                        loan_recievable_pdi: 0,
                        loan_recievable_total: 0,
                    },
                },

                {
                    teller_name: 'Ana Lopez',
                    data_entries: [
                        {
                            member_full_name: 'Ana Lopez',
                            or_no: 'OR-4001',
                            rem: '',
                            share_capital: 300,
                            sundries_account_name: 'Misc Fee',
                            total: 300,
                        },
                    ],
                    grand_total_sundries: 300,
                    grand_total_total: 300,
                    summary_data_entries: [],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 300,
                        cash_count_total: 300,
                    },
                    summary: {
                        number_of_member_borrower_visited: 1,
                        number_of_member_borrwoer_responded: 1,
                        last_no_of_or_used: 'OR-4001',
                        last_no_of_or_used_or_nos_from: 'OR-4001',
                        last_no_of_or_used_or_nos_to: 'OR-4001',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: '',
                        last_of_no_msp_or_used_or_nos_from: '',
                        last_of_no_msp_or_used_or_nos_to: '',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: 0,
                        loan_recievable_pda: 0,
                        loan_recievable_pdi: 300,
                        loan_recievable_total: 300,
                    },
                },

                {
                    teller_name: 'Mark Bautista',
                    data_entries: [],
                    grand_total_sundries: 0,
                    grand_total_total: 0,
                    summary_data_entries: [],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 0,
                        cash_count_total: 0,
                    },
                    summary: {
                        number_of_member_borrower_visited: 0,
                        number_of_member_borrwoer_responded: 0,
                        last_no_of_or_used: '',
                        last_no_of_or_used_or_nos_from: '',
                        last_no_of_or_used_or_nos_to: '',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: '',
                        last_of_no_msp_or_used_or_nos_from: '',
                        last_of_no_msp_or_used_or_nos_to: '',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: 0,
                        loan_recievable_pda: 0,
                        loan_recievable_pdi: 0,
                        loan_recievable_total: 0,
                    },
                },

                {
                    teller_name: 'Liza Ramos',
                    data_entries: [],
                    grand_total_sundries: 0,
                    grand_total_total: 0,
                    summary_data_entries: [],
                    summary_data_entry_total: {
                        sundy_debit_total: 0,
                        sundy_credit_total: 0,
                        cash_count_total: 0,
                    },
                    summary: {
                        number_of_member_borrower_visited: 0,
                        number_of_member_borrwoer_responded: 0,
                        last_no_of_or_used: '',
                        last_no_of_or_used_or_nos_from: '',
                        last_no_of_or_used_or_nos_to: '',
                        last_no_of_or_used_or_nos_from_2: '',
                        last_no_of_or_used_or_nos_to_2: '',
                        last_of_no_msp_or_used: '',
                        last_of_no_msp_or_used_or_nos_from: '',
                        last_of_no_msp_or_used_or_nos_to: '',
                        last_of_no_msp_or_used_or_nos_from_2: '',
                        last_of_no_msp_or_used_or_nos_to_2: '',
                        loan_recievable_adm: 0,
                        loan_recievable_pda: 0,
                        loan_recievable_pdi: 0,
                        loan_recievable_total: 0,
                    },
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
