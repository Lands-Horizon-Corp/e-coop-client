import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import { TCashCheckDisbursementReportSchema } from '../components/forms/cash-check-disbursement-create-report-form'
import CASH_CHECK_DISBURSEMENT_SINGLE_COL_T1 from './templates/cash-check-disbursement-templates/csh-chk-dsbrsmnt-sglcol-t1.njk.njk?raw'
import CASH_CHECK_DISBURSEMENT_STANDARD_T1 from './templates/cash-check-disbursement-templates/csh-chk-dsbrsmnt-stndrd-t1.njk?raw'
import CASH_CHECK_DISBURSEMENT_TABULATED_T1 from './templates/cash-check-disbursement-templates/csh-chk-dsbrsmnt-tbltd-t1.njk?raw'

// START DO NOT EDIT

type TTotal = {
    // for debits
    [key: `account_${string}_subtotal_debit`]: undefined | number | string // depende sa showable ccolumn list kung credit or debit lalagay mo
    sundry_total_debit: string | number

    // for credits
    [key: `account_${string}_subtotal_credit`]: undefined | number | string // depende sa showable ccolumn list kung credit or debit lalagay mo
    sundry_total_credit: string | number
}

type TData = {
    data_entries: Array<{
        date?: string
        cv_no?: string // wala pag summary
        pasbook_no?: string // wala pag summary

        check_no?: string // wala pag summary
        particulars_payee?: string // wala pag summary

        [key: `account_${string}_amount`]: undefined | number | string // depende sa showable ccolumn list kung credit or debit lalagay mo

        is_sundry?: boolean
        // depende din to sa showable account column list na di inabot ng showable count.
        // so kukunin mo debit and credit neto since sundries sya, disregard yung cr dr nya
        sundries_account_name?: string

        // printable parin to if is_sundry = false and if print type = 'summary' which means lahat na ng sundry entries sa date nato ay naka sum na ang debit credit kaya kahit may dynamic account, this can be shown same line
        // pag print type naman = 'detail' solo nya yung entire row sa baba if naka if_sundry = true
        sundried_debit?: string | number
        sundried_credit?: string | number
    }>

    // sub total
    sub_total: TTotal
}

type TPresentationStyle = 'standard' | 'tabulated' | 'single-col'

export interface ICashCheckDisbursementReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    account_name?: string // pag undefined show ko ALL, else Account name (full not shortname)
    presentation_style: TPresentationStyle
    print_type: TCashCheckDisbursementReportSchema['print_type'] // "summary" | "detail"

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    // fill moto if presentation style is tabulated - eto didisplay
    tabulated_data?: {
        // FOR CASH CHECK TABLE
        cash_check_data: TData
        loan_releases: TData
        withdrawals: TData

        sundry_summary: {
            data_entries: Array<{
                account_name?: string
                debit?: string | number
                credit?: string | number
            }>

            total_debit?: string | number
            total_credit?: string | number
        }
    }

    // fill mo to if presentation style is standard - eto didisplay
    standard_data?: {
        data_entries: Array<{
            cv_no?: string
            passbook?: string
            pay_to?: string
        }>

        detailed_schedule_cash_check: {
            data_entries: Array<{
                cv_no?: string
                account_name: string
                debit?: string | number
                credit?: string | number
            }>

            total_debit?: string | number
            total_credit?: string | number
        }

        daily_cash_disbursement_summary: {
            data_entries: Array<{
                account_name: string
                debit?: string | number
                credit?: string | number
            }>

            total_debit?: string | number
            total_credit?: string | number
        }
    }

    // fill mo to if presentation style is single-col - eto didisplay
    single_col_data?: {
        data_entries: Array<{
            account_name?: string

            debit?: string | number
            credit?: string | number
            balance: string | number
        }>

        grand_total_debit?: string | number
        grand_total_credit?: string | number
        grand_total_balance?: string | number
    }

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_CASH_CHECK_DISBURSEMENT_PREVIEW_DATA: ICashCheckDisbursementReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'CASH CHECK DISBURSEMENT REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        account_name: undefined,
        presentation_style: 'standard',
        print_type: 'detail',

        showable_account_column_list: [
            {
                account_id: 'cash_disb',
                display_entry_type: 'DR',
                short_name: 'Cash Disb.',
                name: 'Cash Disbursement',
            },
            {
                account_id: 'loan_rls',
                display_entry_type: 'DR',
                short_name: 'Loan Rls.',
                name: 'Loan Releases',
            },
            {
                account_id: 'wdrl',
                display_entry_type: 'CR',
                short_name: 'Withdrawal',
                name: 'Withdrawals',
            },
        ],

        tabulated_data: {
            cash_check_data: {
                data_entries: [
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1001',
                        pasbook_no: 'PB-0001',
                        check_no: 'CHK-1001',
                        particulars_payee: 'Office Supplies Vendor',
                        account_cash_disb_amount: 12000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1002',
                        pasbook_no: 'PB-0002',
                        check_no: 'CHK-1002',
                        particulars_payee: 'Fuel Expense',
                        account_cash_disb_amount: 9000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1003',
                        pasbook_no: 'PB-0003',
                        check_no: 'CHK-1003',
                        particulars_payee: 'Office Rent',
                        account_cash_disb_amount: 15000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1004',
                        pasbook_no: 'PB-0004',
                        check_no: 'CHK-1004',
                        particulars_payee: 'Utility Expense',
                        account_cash_disb_amount: 7000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1005',
                        pasbook_no: 'PB-0005',
                        check_no: 'CHK-1005',
                        particulars_payee: 'Repairs and Maintenance',
                        account_cash_disb_amount: 8000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1006',
                        pasbook_no: 'PB-0006',
                        check_no: 'CHK-1006',
                        particulars_payee: 'Communication Expense',
                        account_cash_disb_amount: 9500,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1007',
                        pasbook_no: 'PB-0007',
                        check_no: 'CHK-1007',
                        particulars_payee: 'Supplies Replenishment',
                        account_cash_disb_amount: 11000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1008',
                        pasbook_no: 'PB-0008',
                        check_no: 'CHK-1008',
                        particulars_payee: 'Courier and Delivery',
                        account_cash_disb_amount: 6000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1009',
                        pasbook_no: 'PB-0009',
                        check_no: 'CHK-1009',
                        particulars_payee: 'IT Service Fee',
                        account_cash_disb_amount: 13000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1010',
                        pasbook_no: 'PB-0010',
                        check_no: 'CHK-1010',
                        particulars_payee: 'Training Expense',
                        account_cash_disb_amount: 5000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1011',
                        pasbook_no: 'PB-0011',
                        check_no: 'CHK-1011',
                        particulars_payee: 'Janitorial Services',
                        account_cash_disb_amount: 14000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-02',
                        cv_no: 'CV-1012',
                        pasbook_no: 'PB-0012',
                        check_no: 'CHK-1012',
                        particulars_payee: 'Security Services',
                        account_cash_disb_amount: 10000,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 0,
                        sundried_debit: 550,
                        sundried_credit: 650,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Petty Cash Replenishment',
                        sundried_debit: 400,
                        sundried_credit: 0,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Representation Expense',
                        sundried_debit: 0,
                        sundried_credit: 650,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Freight and Handling',
                        sundried_debit: 150,
                        sundried_credit: 0,
                    },
                ],
                sub_total: {
                    account_cash_disb_subtotal_debit: 119500,
                    account_loan_rls_subtotal_debit: 0,
                    account_wdrl_subtotal_credit: 0,
                    sundry_total_debit: 550,
                    sundry_total_credit: 650,
                },
            },
            loan_releases: {
                data_entries: [
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1101',
                        pasbook_no: 'PB-0101',
                        check_no: 'CHK-1101',
                        particulars_payee: 'Member Loan Release',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 25000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1102',
                        pasbook_no: 'PB-0102',
                        check_no: 'CHK-1102',
                        particulars_payee: 'Member Loan Release 2',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 18000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1103',
                        pasbook_no: 'PB-0103',
                        check_no: 'CHK-1103',
                        particulars_payee: 'Member Loan Release 3',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 12000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1104',
                        pasbook_no: 'PB-0104',
                        check_no: 'CHK-1104',
                        particulars_payee: 'Member Loan Release 4',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 30000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1105',
                        pasbook_no: 'PB-0105',
                        check_no: 'CHK-1105',
                        particulars_payee: 'Member Loan Release 5',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 14000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1106',
                        pasbook_no: 'PB-0106',
                        check_no: 'CHK-1106',
                        particulars_payee: 'Member Loan Release 6',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 22000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1107',
                        pasbook_no: 'PB-0107',
                        check_no: 'CHK-1107',
                        particulars_payee: 'Member Loan Release 7',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 16000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1108',
                        pasbook_no: 'PB-0108',
                        check_no: 'CHK-1108',
                        particulars_payee: 'Member Loan Release 8',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 19500,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1109',
                        pasbook_no: 'PB-0109',
                        check_no: 'CHK-1109',
                        particulars_payee: 'Member Loan Release 9',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 20500,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1110',
                        pasbook_no: 'PB-0110',
                        check_no: 'CHK-1110',
                        particulars_payee: 'Member Loan Release 10',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 17500,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1111',
                        pasbook_no: 'PB-0111',
                        check_no: 'CHK-1111',
                        particulars_payee: 'Member Loan Release 11',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 24000,
                        account_wdrl_amount: 0,
                    },
                    {
                        date: '2024-10-03',
                        cv_no: 'CV-1112',
                        pasbook_no: 'PB-0112',
                        check_no: 'CHK-1112',
                        particulars_payee: 'Member Loan Release 12',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 26000,
                        account_wdrl_amount: 0,
                        sundried_debit: 200,
                        sundried_credit: 750,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Documentary Stamp',
                        sundried_debit: 0,
                        sundried_credit: 300,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Legal and Notarial Fee',
                        sundried_debit: 0,
                        sundried_credit: 450,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Miscellaneous Adjustment',
                        sundried_debit: 200,
                        sundried_credit: 0,
                    },
                ],
                sub_total: {
                    account_cash_disb_subtotal_debit: 0,
                    account_loan_rls_subtotal_debit: 244500,
                    account_wdrl_subtotal_credit: 0,
                    sundry_total_debit: 200,
                    sundry_total_credit: 750,
                },
            },
            withdrawals: {
                data_entries: [
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1201',
                        pasbook_no: 'PB-0201',
                        check_no: 'CHK-1201',
                        particulars_payee: 'Member Withdrawal',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 12000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1202',
                        pasbook_no: 'PB-0202',
                        check_no: 'CHK-1202',
                        particulars_payee: 'Member Withdrawal 2',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 8000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1203',
                        pasbook_no: 'PB-0203',
                        check_no: 'CHK-1203',
                        particulars_payee: 'Member Withdrawal 3',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 15000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1204',
                        pasbook_no: 'PB-0204',
                        check_no: 'CHK-1204',
                        particulars_payee: 'Member Withdrawal 4',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 7000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1205',
                        pasbook_no: 'PB-0205',
                        check_no: 'CHK-1205',
                        particulars_payee: 'Member Withdrawal 5',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 11000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1206',
                        pasbook_no: 'PB-0206',
                        check_no: 'CHK-1206',
                        particulars_payee: 'Member Withdrawal 6',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 9500,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1207',
                        pasbook_no: 'PB-0207',
                        check_no: 'CHK-1207',
                        particulars_payee: 'Member Withdrawal 7',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 13000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1208',
                        pasbook_no: 'PB-0208',
                        check_no: 'CHK-1208',
                        particulars_payee: 'Member Withdrawal 8',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 6000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1209',
                        pasbook_no: 'PB-0209',
                        check_no: 'CHK-1209',
                        particulars_payee: 'Member Withdrawal 9',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 14500,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1210',
                        pasbook_no: 'PB-0210',
                        check_no: 'CHK-1210',
                        particulars_payee: 'Member Withdrawal 10',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 10000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1211',
                        pasbook_no: 'PB-0211',
                        check_no: 'CHK-1211',
                        particulars_payee: 'Member Withdrawal 11',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 9000,
                    },
                    {
                        date: '2024-10-04',
                        cv_no: 'CV-1212',
                        pasbook_no: 'PB-0212',
                        check_no: 'CHK-1212',
                        particulars_payee: 'Member Withdrawal 12',
                        account_cash_disb_amount: 0,
                        account_loan_rls_amount: 0,
                        account_wdrl_amount: 12500,
                        sundried_debit: 150,
                        sundried_credit: 250,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Bank Charges',
                        sundried_debit: 100,
                        sundried_credit: 0,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Service Charge',
                        sundried_debit: 0,
                        sundried_credit: 250,
                    },
                    {
                        is_sundry: true,
                        sundries_account_name: 'Rounding Adjustment',
                        sundried_debit: 50,
                        sundried_credit: 0,
                    },
                ],
                sub_total: {
                    account_cash_disb_subtotal_debit: 0,
                    account_loan_rls_subtotal_debit: 0,
                    account_wdrl_subtotal_credit: 127500,
                    sundry_total_debit: 150,
                    sundry_total_credit: 250,
                },
            },
            sundry_summary: {
                data_entries: [
                    {
                        account_name: 'Petty Cash Replenishment',
                        debit: 400,
                        credit: 0,
                    },
                    {
                        account_name: 'Freight and Handling',
                        debit: 150,
                        credit: 0,
                    },
                    {
                        account_name: 'Representation Expense',
                        debit: 0,
                        credit: 650,
                    },
                    {
                        account_name: 'Documentary Stamp',
                        debit: 0,
                        credit: 300,
                    },
                    {
                        account_name: 'Legal and Notarial Fee',
                        debit: 0,
                        credit: 450,
                    },
                    {
                        account_name: 'Miscellaneous Adjustment',
                        debit: 200,
                        credit: 0,
                    },
                    {
                        account_name: 'Bank Charges',
                        debit: 100,
                        credit: 0,
                    },
                    {
                        account_name: 'Service Charge',
                        debit: 0,
                        credit: 250,
                    },
                    {
                        account_name: 'Rounding Adjustment',
                        debit: 50,
                        credit: 0,
                    },
                ],
                total_debit: 900,
                total_credit: 1650,
            },
        },

        standard_data: {
            data_entries: [
                {
                    cv_no: 'CV-1001',
                    passbook: 'PB-0001',
                    pay_to: 'Office Supplies Vendor',
                },
                {
                    cv_no: 'CV-1002',
                    passbook: 'PB-0002',
                    pay_to: 'Member Loan Release',
                },
            ],
            detailed_schedule_cash_check: {
                data_entries: [
                    {
                        cv_no: 'CV-1001',
                        account_name: 'Cash Disbursement',
                        debit: 15000,
                        credit: 0,
                    },
                    {
                        cv_no: 'CV-1002',
                        account_name: 'Loan Releases',
                        debit: 25000,
                        credit: 0,
                    },
                    {
                        cv_no: 'CV-1003',
                        account_name: 'Withdrawals',
                        debit: 0,
                        credit: 12000,
                    },
                ],
                total_debit: 40000,
                total_credit: 12000,
            },
            daily_cash_disbursement_summary: {
                data_entries: [
                    {
                        account_name: 'Cash Disbursement',
                        debit: 15000,
                        credit: 0,
                    },
                    {
                        account_name: 'Loan Releases',
                        debit: 25000,
                        credit: 0,
                    },
                    {
                        account_name: 'Withdrawals',
                        debit: 0,
                        credit: 12000,
                    },
                ],
                total_debit: 40000,
                total_credit: 12000,
            },
        },

        single_col_data: {
            data_entries: [
                {
                    account_name: 'Cash Disbursement',
                    debit: 15000,
                    credit: 0,
                    balance: 15000,
                },
                {
                    account_name: 'Loan Releases',
                    debit: 25000,
                    credit: 0,
                    balance: 40000,
                },
                {
                    account_name: 'Withdrawals',
                    debit: 0,
                    credit: 12000,
                    balance: 28000,
                },
            ],
            grand_total_debit: 40000,
            grand_total_credit: 12000,
            grand_total_balance: 28000,
        },

        prepared_by: 'Prepared Person',
        checked_by: 'Checked Person',
        approved_by: 'Approver Person',

        density: 'normal',
    }

export const CASH_CHECK_DISBURSEMENT_REPORT_TEMPLATES: GeneratedReportTemplate<
    ICashCheckDisbursementReportTemplate,
    { presentation_style?: TPresentationStyle }
>[] = [
    {
        id: 'cash-check-disbursement-tabulated-t1',
        template_name: 'Tabulated',
        report_name: 'CashCheckDisbursementReport',
        template: CASH_CHECK_DISBURSEMENT_TABULATED_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'tabulated' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_CASH_CHECK_DISBURSEMENT_PREVIEW_DATA,
    },
    {
        id: 'cash-check-disbursement-standard-t1',
        template_name: 'Standard',
        report_name: 'CashCheckDisbursementReport',
        template: CASH_CHECK_DISBURSEMENT_STANDARD_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'standard' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_CASH_CHECK_DISBURSEMENT_PREVIEW_DATA,
    },
    {
        id: 'cash-check-disbursement-single-col-t1',
        template_name: 'Single Column',
        report_name: 'CashCheckDisbursementReport',
        template: CASH_CHECK_DISBURSEMENT_SINGLE_COL_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'single-col' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_CASH_CHECK_DISBURSEMENT_PREVIEW_DATA,
    },
]
