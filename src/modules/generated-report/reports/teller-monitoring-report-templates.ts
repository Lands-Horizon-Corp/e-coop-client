import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import TELLER_MONITORING_PER_TELLER_DETAILED_T1 from './templates/teller-monitoring-templates/tlr-mntrng-pr-tllr-t1.njk?raw'
import TELLER_MONITORING_SUMMARY_T1 from './templates/teller-monitoring-templates/tlr-mntrng-smry-t1.njk?raw'
import TELLER_MONITORING_WITHDRAWAL_T1 from './templates/teller-monitoring-templates/tlr-mntrng-wthdrwl-t1.njk?raw'

export type TPresentationStyle =
    | 'per-teller-detailed'
    | 'summary'
    | 'withdrawal'

export interface ITellerMonitoringReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string
    presentation_style: TPresentationStyle

    account_name?: string // pag undefined, meaning all account

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    withdrawal_showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    // fill moto pag 'per-teller-detailed'
    per_teller_data_entries?: Array<{
        employee_name: string
        // pang main table per employee/teller
        data_entries: Array<{
            date?: string
            or?: string
            pasbook?: string
            member_full_name?: string
            // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA SHOWABLE ACCOUNT COLUMN LIST
            [key: `account_${string}_amount`]: number | string | undefined

            // do not fill/show above kung is_sundry,
            // all sundry here will be credit
            is_sundry?: boolean
            sundry_name?: string
            sundry_amount?: string | number
        }>
        grand_total: {
            [key: `account_${string}_total_amount`]: number | string | undefined
            sundry_total_amount?: string | number
        }

        // pang detail table after ng main table min w half ng parent, pero max nya is parent lang desu
        detail_data_entries: Array<{
            or?: string
            pasbook?: string
            account_name?: string
            credit?: string | number
        }>
        detail_total?: string | number

        // sumary table, same sa detail data entry half and max parent
        summary_data_entries: Array<{
            account_name?: string
            credit?: string | number
        }>
        summary_total?: string | number
    }>

    // fill moto pag 'summary'
    // pinaka simple at summary just 1 main table desyo
    teller_summary_data_entries?: Array<{
        employee_name: string
        no_of_deposit_payment?: string | number
        no_of_deposit_withdrawal?: string | number
        no_of_loan_int_fines_payment?: string | number
        other_payment?: string | number
        total_transaction: string | number
    }>
    teller_summary_grand_total?: {
        no_of_deposit_payment?: string | number
        no_of_deposit_withdrawal?: string | number
        no_of_loan_int_fines_payment?: string | number
        other_payment?: string | number
        total_transaction: string | number
    }

    // fill moto page 'withdrawal'
    teller_withdrawal_data: {
        // main table desu
        teller_withdrawal_data_entries?: Array<{
            tlr_ref_no?: string
            pasbook?: string
            member_full_name?: string
            // base sa withdrwal showable account column list
            [key: `account_${string}_amount`]: number | string | undefined
            total?: string | number
        }>
        teller_withdrawal_grand_total?: {
            // base sa withdrwal showable account column list
            [key: `account_${string}_total_amount`]: number | string | undefined
            total?: string | number
        }

        // summary table desu
        teller_summary_data_entries: Array<{
            employee_name?: string
            [key: `account_${string}_amount`]: number | string | undefined
            total: string | number
        }>
        teller_summary_total: {
            [key: `account_${string}_amount`]: number | string | undefined
            total: string | number
        }
        grand_total?: string | number
        trx_count?: string | number
    }

    // Signatures
    prepared_by?: string
    approved_by?: string
}

export const SHARED_TELLER_MONITORING_PREVIEW_DATA: ITellerMonitoringReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'TELLER MONITORING REPORT',

        start_date: '2026-04-01',
        end_date: '2026-04-30',
        presentation_style: 'per-teller-detailed',

        account_name: undefined,
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
            {
                account_id: 'acc_td',
                display_entry_type: 'CR',
                short_name: 'TD',
                name: 'Time Deposit',
            },
        ],
        withdrawal_showable_account_column_list: [
            {
                account_id: 'acc_wd_sd',
                display_entry_type: 'DR',
                short_name: 'WD-SD',
                name: 'Withdrawal - Savings Deposit',
            },
            {
                account_id: 'acc_wd_td',
                display_entry_type: 'DR',
                short_name: 'WD-TD',
                name: 'Withdrawal - Time Deposit',
            },
            {
                account_id: 'acc_wd_sc',
                display_entry_type: 'DR',
                short_name: 'WD-SC',
                name: 'Withdrawal - Share Capital',
            },
        ],
        per_teller_data_entries: [
            {
                employee_name: 'Juan Dela Cruz',
                data_entries: [
                    {
                        date: '2026-04-02',
                        or: 'OR-21001',
                        pasbook: 'PB-1001',
                        member_full_name: 'Arvin Lopez',
                        account_acc_sd_reg_amount: 1500,
                        account_acc_sc_com_amount: 500,
                        account_acc_lr_prod_amount: 0,
                        account_acc_td_amount: 2000,
                    },
                    {
                        date: '2026-04-02',
                        or: 'OR-21002',
                        pasbook: 'PB-1002',
                        member_full_name: 'Maria Santos',
                        account_acc_sd_reg_amount: 2000,
                        account_acc_sc_com_amount: 0,
                        account_acc_lr_prod_amount: 4500,
                        account_acc_td_amount: 0,
                    },
                    {
                        date: '2026-04-03',
                        or: 'OR-21003',
                        pasbook: 'PB-1003',
                        member_full_name: 'Pedro Reyes',
                        account_acc_sd_reg_amount: 0,
                        account_acc_sc_com_amount: 0,
                        account_acc_lr_prod_amount: 0,
                        account_acc_td_amount: 0,
                        is_sundry: true,
                        sundry_name: 'Service Fee',
                        sundry_amount: 250,
                    },
                ],
                grand_total: {
                    account_acc_sd_reg_total_amount: 3500,
                    account_acc_sc_com_total_amount: 500,
                    account_acc_lr_prod_total_amount: 4500,
                    account_acc_td_total_amount: 2000,
                    sundry_total_amount: 250,
                },
                detail_data_entries: [
                    {
                        or: 'OR-21001',
                        pasbook: 'PB-1001',
                        account_name: 'Savings Deposit - Regular',
                        credit: 1500,
                    },
                    {
                        or: 'OR-21002',
                        pasbook: 'PB-1002',
                        account_name: 'Loan Receivable - Productive',
                        credit: 4500,
                    },
                    {
                        or: 'OR-21003',
                        pasbook: 'PB-1003',
                        account_name: 'Service Fee',
                        credit: 250,
                    },
                ],
                detail_total: 6250,
                summary_data_entries: [
                    {
                        account_name: 'Service Fee',
                        credit: 250,
                    },
                ],
                summary_total: 250,
            },
            {
                employee_name: 'Ana Lopez',
                data_entries: [
                    {
                        date: '2026-04-04',
                        or: 'OR-22001',
                        pasbook: 'PB-2001',
                        member_full_name: 'Liza Ramos',
                        account_acc_sd_reg_amount: 1800,
                        account_acc_sc_com_amount: 300,
                        account_acc_lr_prod_amount: 1200,
                        account_acc_td_amount: 0,
                    },
                    {
                        date: '2026-04-04',
                        or: 'OR-22002',
                        pasbook: 'PB-2002',
                        member_full_name: 'Mark Bautista',
                        account_acc_sd_reg_amount: 500,
                        account_acc_sc_com_amount: 700,
                        account_acc_lr_prod_amount: 0,
                        account_acc_td_amount: 3000,
                    },
                    {
                        date: '2026-04-05',
                        or: 'OR-22003',
                        pasbook: 'PB-2003',
                        member_full_name: 'Ella Mendoza',
                        account_acc_sd_reg_amount: 0,
                        account_acc_sc_com_amount: 0,
                        account_acc_lr_prod_amount: 800,
                        account_acc_td_amount: 0,
                    },
                    {
                        date: '2026-04-05',
                        or: 'OR-22004',
                        pasbook: 'PB-2004',
                        member_full_name: 'Rico Tan',
                        account_acc_sd_reg_amount: 0,
                        account_acc_sc_com_amount: 0,
                        account_acc_lr_prod_amount: 0,
                        account_acc_td_amount: 0,
                        is_sundry: true,
                        sundry_name: 'Penalty',
                        sundry_amount: 180,
                    },
                ],
                grand_total: {
                    account_acc_sd_reg_total_amount: 2300,
                    account_acc_sc_com_total_amount: 1000,
                    account_acc_lr_prod_total_amount: 2000,
                    account_acc_td_total_amount: 3000,
                    sundry_total_amount: 180,
                },
                detail_data_entries: [
                    {
                        or: 'OR-22001',
                        pasbook: 'PB-2001',
                        account_name: 'Savings Deposit - Regular',
                        credit: 1800,
                    },
                    {
                        or: 'OR-22002',
                        pasbook: 'PB-2002',
                        account_name: 'Time Deposit',
                        credit: 3000,
                    },
                    {
                        or: 'OR-22004',
                        pasbook: 'PB-2004',
                        account_name: 'Penalty',
                        credit: 180,
                    },
                ],
                detail_total: 4980,
                summary_data_entries: [
                    {
                        account_name: 'Penalty',
                        credit: 180,
                    },
                ],
                summary_total: 180,
            },
        ],
        teller_summary_data_entries: [
            {
                employee_name: 'Juan Dela Cruz',
                no_of_deposit_payment: 58,
                no_of_deposit_withdrawal: 21,
                no_of_loan_int_fines_payment: 17,
                other_payment: 6,
                total_transaction: 102,
            },
            {
                employee_name: 'Ana Lopez',
                no_of_deposit_payment: 44,
                no_of_deposit_withdrawal: 18,
                no_of_loan_int_fines_payment: 11,
                other_payment: 5,
                total_transaction: 78,
            },
            {
                employee_name: 'Mark Bautista',
                no_of_deposit_payment: 39,
                no_of_deposit_withdrawal: 14,
                no_of_loan_int_fines_payment: 9,
                other_payment: 4,
                total_transaction: 66,
            },
            {
                employee_name: 'Liza Ramos',
                no_of_deposit_payment: 62,
                no_of_deposit_withdrawal: 20,
                no_of_loan_int_fines_payment: 13,
                other_payment: 7,
                total_transaction: 102,
            },
        ],
        teller_summary_grand_total: {
            no_of_deposit_payment: 203,
            no_of_deposit_withdrawal: 73,
            no_of_loan_int_fines_payment: 50,
            other_payment: 22,
            total_transaction: 348,
        },
        teller_withdrawal_data: {
            teller_withdrawal_data_entries: [
                {
                    tlr_ref_no: 'TLR-W-1001',
                    pasbook: 'PB-W001',
                    member_full_name: 'Pedro Reyes',
                    account_acc_wd_sd_amount: 2500,
                    account_acc_wd_td_amount: 0,
                    account_acc_wd_sc_amount: 300,
                    total: 2800,
                },
                {
                    tlr_ref_no: 'TLR-W-1002',
                    pasbook: 'PB-W002',
                    member_full_name: 'Maria Santos',
                    account_acc_wd_sd_amount: 1000,
                    account_acc_wd_td_amount: 4000,
                    account_acc_wd_sc_amount: 0,
                    total: 5000,
                },
                {
                    tlr_ref_no: 'TLR-W-1003',
                    pasbook: 'PB-W003',
                    member_full_name: 'Arvin Lopez',
                    account_acc_wd_sd_amount: 800,
                    account_acc_wd_td_amount: 0,
                    account_acc_wd_sc_amount: 200,
                    total: 1000,
                },
                {
                    tlr_ref_no: 'TLR-W-1004',
                    pasbook: 'PB-W004',
                    member_full_name: 'Liza Ramos',
                    account_acc_wd_sd_amount: 0,
                    account_acc_wd_td_amount: 1500,
                    account_acc_wd_sc_amount: 0,
                    total: 1500,
                },
                {
                    tlr_ref_no: 'TLR-W-1005',
                    pasbook: 'PB-W005',
                    member_full_name: 'Mark Bautista',
                    account_acc_wd_sd_amount: 2200,
                    account_acc_wd_td_amount: 0,
                    account_acc_wd_sc_amount: 400,
                    total: 2600,
                },
            ],
            teller_withdrawal_grand_total: {
                account_acc_wd_sd_total_amount: 6500,
                account_acc_wd_td_total_amount: 5500,
                account_acc_wd_sc_total_amount: 900,
                total: 12900,
            },
            teller_summary_data_entries: [
                {
                    employee_name: 'Juan Dela Cruz',
                    account_acc_wd_sd_amount: 3500,
                    account_acc_wd_td_amount: 4000,
                    account_acc_wd_sc_amount: 300,
                    total: 7800,
                },
                {
                    employee_name: 'Ana Lopez',
                    account_acc_wd_sd_amount: 3000,
                    account_acc_wd_td_amount: 1500,
                    account_acc_wd_sc_amount: 600,
                    total: 5100,
                },
            ],
            teller_summary_total: {
                account_acc_wd_sd_amount: 6500,
                account_acc_wd_td_amount: 5500,
                account_acc_wd_sc_amount: 900,
                total: 12900,
            },
            grand_total: 12900,
            trx_count: 5,
        },
        prepared_by: 'Teller Supervisor',
        approved_by: 'Branch Manager',
        density: 'normal',
    }

export const TELLER_MONITORING_REPORT_TEMPLATES: GeneratedReportTemplate<
    ITellerMonitoringReportTemplate,
    { presentation_style: TPresentationStyle }
>[] = [
    {
        id: 'teller-monitoring-per-teller-detailed-t1',
        template_name: 'Per Teller Detailed',
        report_name: 'TellerMonitoringReport',
        template: TELLER_MONITORING_PER_TELLER_DETAILED_T1,
        template_filter: { presentation_style: 'per-teller-detailed' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_TELLER_MONITORING_PREVIEW_DATA,
    },
    {
        id: 'teller-monitoring-summary-t1',
        template_name: 'Summary',
        report_name: 'TellerMonitoringReport',
        template: TELLER_MONITORING_SUMMARY_T1,
        template_filter: { presentation_style: 'summary' },
        default_unit: 'in',
        width: '8.5in',
        height: '11in',
        density: 'normal',
        orientation: 'portrait',
        preview_data: SHARED_TELLER_MONITORING_PREVIEW_DATA,
    },
    {
        id: 'teller-monitoring-withdrawal-t1',
        template_name: 'Withdrawal',
        report_name: 'TellerMonitoringReport',
        template: TELLER_MONITORING_WITHDRAWAL_T1,
        template_filter: { presentation_style: 'withdrawal' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'portrait',
        preview_data: SHARED_TELLER_MONITORING_PREVIEW_DATA,
    },
]
