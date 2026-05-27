import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import DIRECT_ADJUSTMENT_TABULATED_T1 from './templates/direct-adjustment-templates/drct-adj-t1.njk?raw'

// HERE IS REAL DO NOT EDIT
type TTabluatedDataEntry = {
    ref_no?: string
    date?: string
    account_short_name?: string

    pasbook?: string
    member_full_name?: string

    // DYNAMIC ACCOUNT
    // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
    [key: `account_${TEntityId}_short_name`]: number
    [key: `account_${TEntityId}_debit`]: number | string
    [key: `account_${TEntityId}_credit`]: number | string

    sundry_debit?: number | string
    sundry_credit?: number | string
    sundry_account_short_name?: string

    checked_by?: string
    approved_by?: string
}

export interface IDirectAdjustmentReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    account_name?: string // pag undefined, meaning all account
    account_category_name?: string

    include_exclude_to_gl?: boolean // idk

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    data_entries?: Array<TTabluatedDataEntry>

    data_entries_total: {
        [key: `account_${TEntityId}_debit`]: number | string
        [key: `account_${TEntityId}_credit`]: number | string

        sundry_debit?: number | string
        sundry_credit?: number | string
    }

    // Signatures
    checked_by?: string
    approved_by?: string
}

// END DO NOT EDIT

export const SHARED_DIRECT_ADJUSTMENT_PREVIEW_DATA: IDirectAdjustmentReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'DIRECT ADJUSTMENT REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        showable_account_column_list: [
            {
                account_id: 'acc_cash_on_hand',
                display_entry_type: 'DR',
                short_name: 'CASH',
                name: 'Cash On Hand',
            },
            {
                account_id: 'acc_ar_trade',
                display_entry_type: 'CR',
                short_name: 'AR',
                name: 'Accounts Receivable',
            },
        ],

        data_entries: [
            {
                ref_no: 'DA-0001',
                date: '2024-10-03',
                pasbook: 'PB-001',
                member_full_name: 'Juan Dela Cruz',
                account_short_name: 'CASH',
                account_acc_cash_on_hand_debit: 5000,
                account_acc_ar_trade_credit: 5000,
                sundry_debit: 0,
                sundry_credit: 0,
                sundry_account_short_name: '',
            },
            {
                ref_no: 'DA-0002',
                date: '2024-10-10',
                pasbook: 'PB-002',
                member_full_name: 'Maria Santos',
                account_short_name: 'AR',
                account_acc_cash_on_hand_debit: 1200,
                account_acc_ar_trade_credit: 1200,
                sundry_debit: 0,
                sundry_credit: 0,
                sundry_account_short_name: '',
            },
            {
                ref_no: 'DA-0003',
                date: '2024-10-18',
                pasbook: 'PB-003',
                member_full_name: 'Pedro Reyes',
                account_short_name: 'SUNDRY',
                account_acc_cash_on_hand_debit: 0,
                account_acc_ar_trade_credit: 0,
                sundry_debit: 0,
                sundry_credit: 300,
                sundry_account_short_name: 'Processing Fee',
            },
        ],

        data_entries_total: {
            account_acc_cash_on_hand_debit: 6200,
            account_acc_ar_trade_credit: 6200,
            sundry_debit: 0,
            sundry_credit: 300,
        },

        checked_by: 'Accounting Clerk',
        approved_by: 'Finance Manager',

        density: 'normal',
    }

export const DIRECT_ADJUSTMENT_REPORT_TEMPLATES: GeneratedReportTemplate<IDirectAdjustmentReportTemplate>[] =
    [
        {
            id: 'direct-adjustment-tabulated-t1',
            template_name: 'Tabulated',
            report_name: 'DirectAdjustmentReport',
            template: DIRECT_ADJUSTMENT_TABULATED_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_DIRECT_ADJUSTMENT_PREVIEW_DATA,
        },
    ]
