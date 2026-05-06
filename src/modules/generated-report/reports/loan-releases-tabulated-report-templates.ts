import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import LOAN_RELEASE_REGISTER_T1 from './templates/loan-releases-tabulated-templates/ln-rls-rgstr-t1.njk?raw'
import LOAN_RELEASE_TABULATED_T1 from './templates/loan-releases-tabulated-templates/ln-rls-tbltd-t1.njk?raw'

type TStaticFilter = {
    report_type: 'tabulated' | 'register'
}

// HERE IS REAL DO NOT EDIT
type TTabluatedDataEntry = {
    cv_no?: string
    pasbook?: string
    member_full_name?: string
    account_short_name?: string

    amount_granted?: string | number

    // DYNAMIC ACCOUNT
    // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
    // example format -> account_{account_id}_amount
    // example -> account_b8a1124_amount : 1250.50
    [key: `account_${TEntityId}_amount`]: number | string

    // IF THE CURRENT ENTRY AY HINDI KABILANG SA account_column_list which fall to Sundries
    sundry_name: string
    is_sundry_entry?: boolean
    sundries_amount?: string | number
}

type TSundryEntry = {
    account_name?: string // oks lang full name
    debit?: string | number
    credit?: string | number
}

type TRegisterDataEntry = {
    cv_no?: string
    check_no?: string
    pasbook_number?: string

    member_full_name?: string
    account_short_name?: string
    terms?: string | number
    payment_mode?: string

    first_payment_date?: string
    due_date?: string

    loan_amount?: string | number
}

export interface ILoanReleaseTabulatedReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    account_name?: string // pag undefined, meaning all account
    account_category_name?: string

    include_exclude_to_gl?: boolean // idk

    tabulated_data?: {
        showable_account_column_list: Array<{
            account_id: TEntityId
            display_entry_type: 'CR' | 'DR'
            short_name?: string
            name?: string
        }>

        data_entries?: Array<TTabluatedDataEntry>
        data_entries_total_debits: {
            amount_granted_total?: string | number

            // DYNAMIC ACCOUNT
            // DITO MAFIFILL NANG DYNAMIC ACCOUNT COLUMN AMOUNT BASED SA account_column_list
            // example format -> account_{account_id}_amount
            // example -> account_b8a1124_amount : 1250.50
            [key: `account_${TEntityId}_total`]: number | string | undefined
        }

        sundries_summary_data_entries?: TSundryEntry[]
        sundries_summary_total?: string | number
    }

    register_data?: {
        data_endtries?: Array<TRegisterDataEntry>
        total?: string | number // idk naka cut idk ano tinotottal HAHAAHA
    }

    // Signatures
    checked_by?: string
    approved_by?: string
}

// END DO NOT EDIT

export const SHARED_LOAN_RELEASE_TABULATED_PREVIEW_DATA: ILoanReleaseTabulatedReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'DAILY LOAN RELEASES SUMMARY REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',

        account_name: undefined,
        include_exclude_to_gl: true,

        tabulated_data: {
            showable_account_column_list: [
                {
                    account_id: 'acc_lr_prod',
                    display_entry_type: 'CR',
                    short_name: 'LR-PROD',
                    name: 'Loan Release - Production',
                },
                {
                    account_id: 'acc_lr_pda',
                    display_entry_type: 'CR',
                    short_name: 'LR-PDA',
                    name: 'Loan Release - PDA',
                },
            ],

            data_entries: [
                {
                    cv_no: 'CV-1001',
                    pasbook: 'PB-001',
                    member_full_name: 'Juan Dela Cruz',
                    account_short_name: 'LR-PROD',
                    amount_granted: 10000,

                    account_acc_lr_prod_amount: 10000,

                    sundry_name: '',
                    sundries_amount: 0,
                },
                {
                    cv_no: 'CV-1002',
                    pasbook: 'PB-002',
                    member_full_name: 'Maria Santos',
                    account_short_name: 'LR-PDA',
                    amount_granted: 8000,

                    account_acc_lr_pda_amount: 8000,

                    sundry_name: '',
                    sundries_amount: 0,
                },
                {
                    cv_no: 'CV-1003',
                    pasbook: 'PB-003',
                    member_full_name: 'Pedro Reyes',
                    account_short_name: '',
                    amount_granted: 0,

                    account_acc_lr_prod_amount: 0,
                    account_acc_lr_pda_amount: 0,

                    sundry_name: 'Processing Fee',
                    sundries_amount: 500,
                    is_sundry_entry: true,
                },
            ],

            data_entries_total_debits: {
                amount_granted_total: '18,000.00',
                account_acc_lr_prod_total: 10000,
                account_acc_lr_pda_total: 8000,
            },

            sundries_summary_data_entries: [
                {
                    account_name: 'Processing Fee',
                    debit: 0,
                    credit: 500,
                },
            ],

            sundries_summary_total: 500,
        },

        register_data: {
            data_endtries: [
                {
                    cv_no: 'CV-1001',
                    check_no: 'CHK-001',
                    pasbook_number: 'PB-001',
                    member_full_name: 'Juan Dela Cruz',
                    account_short_name: 'LR-PROD',
                    terms: 12,
                    payment_mode: 'Monthly',
                    first_payment_date: '2024-11-01',
                    due_date: '2025-10-01',
                    loan_amount: '10,000.00',
                },
                {
                    cv_no: 'CV-1002',
                    check_no: 'CHK-002',
                    pasbook_number: 'PB-002',
                    member_full_name: 'Maria Santos',
                    account_short_name: 'LR-PDA',
                    terms: 6,
                    payment_mode: 'Monthly',
                    first_payment_date: '2024-11-15',
                    due_date: '2025-04-15',
                    loan_amount: '8,000.00',
                },
            ],
            total: '18,000.00',
        },

        density: 'normal',
    }

export const LOAN_RELEASE_TABULATED_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILoanReleaseTabulatedReportTemplate,
    TStaticFilter
>[] = [
    {
        id: 'loan-release-tabulated-t1',
        template_name: 'Tabulated',
        report_name: 'LoanReleaseTabulatedReport',
        template: LOAN_RELEASE_TABULATED_T1,
        template_filter: { report_type: 'tabulated' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_TABULATED_PREVIEW_DATA,
    },
    {
        id: 'loan-release-register-t1',
        template_name: 'Register',
        report_name: 'LoanReleaseTabulatedReport',
        template: LOAN_RELEASE_REGISTER_T1,
        template_filter: { report_type: 'register' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_TABULATED_PREVIEW_DATA,
    },
]
