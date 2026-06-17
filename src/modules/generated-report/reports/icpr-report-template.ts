import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TICPRSchema } from '../components/forms/icpr-create-report-form'
import ICPR_SUMMARY_T1 from './templates/icpr-templates/icpr-summary-t1.njk?raw'

type TPresentationStyle =
    | 'icpr-summary'
    | 'pr-detail'
    | 'icpr-cash' // TODO: Report Template
    | 'ic-distribution' // TODO: Report Template
    | 'pr-distribution' // TODO: Report Template

// START DO NOT EDIT
type TICPRDataEntryItem = {
    // 'icpr-summary'
    pasbook_no?: string
    member_name?: string
    itnerest_share_capital_average?: string | number
    interest_share_capital_rate?: string | number
    interest_share_capital_amount?: string | number
    patrionage_refund_earned?: string | number
    patrionage_refund_rate?: string | number
    patrionage_refund_amount?: string | number
    total?: string | number

    // 'pr-detail'
    cv_no?: string
    release_date?: string
    due_date?: string
    account_short_name?: string
    terms?: string | number
    principal?: string | number
    interest?: string | number
    days?: string | number
    interest_earned?: string | number
    status?: string
    loan_balance?: string | number
    last_pay_date?: string
}

export type TICPRReportGroup = {
    // Gagamitin ko to solo nya <tr> indicator na start of its group
    roup_title: string
    group_name: string // examples -> Account, Member Type, Barangay etc..
    member_name?: string // used when grouped by to show member before its entries

    // If it has sub-groups (3+ levels), this is populated
    sub_groups?: TICPRReportGroup[]
    //Pag leaf to, eto yung data nya meaning wlang sub group
    data_entries?: TICPRDataEntryItem[]

    // groupings?: TICPRDetailSchema['groupings']

    // seto din ididsplay based sa groupings set
    total_per: {
        // 'icpr-summary'
        itnerest_share_capital_average?: string | number
        interest_share_capital_rate?: string | number
        interest_share_capital_amount?: string | number

        patrionage_refund_earned?: string | number
        patrionage_refund_rate?: string | number
        patrionage_refund_amount?: string | number
        total?: string | number

        // grand total 'pr-detail'
        principal?: string | number
        interest?: string | number
        interest_earned?: string | number
        loan_balance?: string | number
    }
}

export interface IICPRDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    target_date: string
    grouping: TICPRSchema['groupings']

    grouped_data?: TICPRReportGroup[] // eto fill mo pag may grouping

    no_grouping_data_entries?: TICPRDataEntryItem[] // eto fill pag walang grouping

    // seto din ididsplay based sa groupings set
    grand_total: {
        // 'icpr-summary'
        itnerest_share_capital_average?: string | number
        interest_share_capital_rate?: string | number
        interest_share_capital_amount?: string | number
        patrionage_refund_earned?: string | number
        patrionage_refund_rate?: string | number
        patrionage_refund_amount?: string | number
        total?: string | number

        // grand total 'pr-detail'
        principal?: string | number
        interest?: string | number
        interest_earned?: string | number
        loan_balance?: string | number
    }

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const ICPR_PREVIEW_DATA: IICPRDetailReportTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Sample Street, Quezon City',
    tax_number: '123-456-789-000',

    report_title: 'ICPR REPORT',

    target_date: '2025-12-31',

    grouping: 'no_grouping',

    grouped_data: [
        {
            roup_title: 'MEMBER TYPE',
            group_name: 'REGULAR MEMBER',

            data_entries: [
                {
                    pasbook_no: 'PB-00001',
                    member_name: 'JUAN DELA CRUZ',

                    itnerest_share_capital_average: 120000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 6000,

                    patrionage_refund_earned: 90000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 2700,

                    total: 8700,

                    cv_no: 'CV-00001',
                    release_date: '2025-01-15',
                    due_date: '2026-01-15',
                    account_short_name: 'REGULAR LOAN',
                    terms: 12,
                    principal: 50000,
                    interest: 5000,
                    days: 365,
                    interest_earned: 3500,
                    status: 'ACTIVE',
                    loan_balance: 25000,
                    last_pay_date: '2025-12-01',
                },
                {
                    pasbook_no: 'PB-00002',
                    member_name: 'MARIA SANTOS',

                    itnerest_share_capital_average: 150000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 7500,

                    patrionage_refund_earned: 110000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 3300,

                    total: 10800,

                    cv_no: 'CV-00002',
                    release_date: '2025-02-10',
                    due_date: '2026-02-10',
                    account_short_name: 'BUSINESS LOAN',
                    terms: 24,
                    principal: 100000,
                    interest: 10000,
                    days: 365,
                    interest_earned: 7000,
                    status: 'ACTIVE',
                    loan_balance: 60000,
                    last_pay_date: '2025-12-05',
                },
                {
                    pasbook_no: 'PB-00003',
                    member_name: 'ROBERTO CRUZ',

                    itnerest_share_capital_average: 80000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 4000,

                    patrionage_refund_earned: 50000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 1500,

                    total: 5500,

                    cv_no: 'CV-00003',
                    release_date: '2025-03-01',
                    due_date: '2026-03-01',
                    account_short_name: 'EMERGENCY LOAN',
                    terms: 6,
                    principal: 25000,
                    interest: 2500,
                    days: 180,
                    interest_earned: 1500,
                    status: 'PAID',
                    loan_balance: 0,
                    last_pay_date: '2025-10-15',
                },
            ],

            total_per: {
                itnerest_share_capital_average: 350000,
                interest_share_capital_amount: 17500,

                patrionage_refund_earned: 250000,
                patrionage_refund_amount: 7500,

                total: 25000,

                principal: 175000,
                interest: 17500,
                interest_earned: 12000,
                loan_balance: 85000,
            },
        },

        {
            roup_title: 'MEMBER TYPE',
            group_name: 'ASSOCIATE MEMBER',

            data_entries: [
                {
                    pasbook_no: 'PB-00004',
                    member_name: 'PEDRO REYES',

                    itnerest_share_capital_average: 90000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 4500,

                    patrionage_refund_earned: 60000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 1800,

                    total: 6300,

                    cv_no: 'CV-00004',
                    release_date: '2025-04-01',
                    due_date: '2026-04-01',
                    account_short_name: 'SALARY LOAN',
                    terms: 12,
                    principal: 40000,
                    interest: 4000,
                    days: 180,
                    interest_earned: 2500,
                    status: 'ACTIVE',
                    loan_balance: 18000,
                    last_pay_date: '2025-12-10',
                },
                {
                    pasbook_no: 'PB-00005',
                    member_name: 'ANA LOPEZ',

                    itnerest_share_capital_average: 70000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 3500,

                    patrionage_refund_earned: 45000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 1350,

                    total: 4850,

                    cv_no: 'CV-00005',
                    release_date: '2025-05-20',
                    due_date: '2026-05-20',
                    account_short_name: 'MICRO LOAN',
                    terms: 10,
                    principal: 20000,
                    interest: 2000,
                    days: 150,
                    interest_earned: 1200,
                    status: 'ACTIVE',
                    loan_balance: 8000,
                    last_pay_date: '2025-12-03',
                },
                {
                    pasbook_no: 'PB-00006',
                    member_name: 'JOSEPH RAMOS',

                    itnerest_share_capital_average: 60000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 3000,

                    patrionage_refund_earned: 40000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 1200,

                    total: 4200,

                    cv_no: 'CV-00006',
                    release_date: '2025-06-15',
                    due_date: '2026-06-15',
                    account_short_name: 'SALARY LOAN',
                    terms: 12,
                    principal: 18000,
                    interest: 1800,
                    days: 120,
                    interest_earned: 900,
                    status: 'ACTIVE',
                    loan_balance: 9000,
                    last_pay_date: '2025-11-28',
                },
            ],

            total_per: {
                itnerest_share_capital_average: 220000,
                interest_share_capital_amount: 11000,

                patrionage_refund_earned: 145000,
                patrionage_refund_amount: 4350,

                total: 15350,

                principal: 78000,
                interest: 7800,
                interest_earned: 4600,
                loan_balance: 35000,
            },
        },

        {
            roup_title: 'MEMBER TYPE',
            group_name: 'OFFICER MEMBER',

            data_entries: [
                {
                    pasbook_no: 'PB-00007',
                    member_name: 'CARLOS GARCIA',

                    itnerest_share_capital_average: 250000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 12500,

                    patrionage_refund_earned: 180000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 5400,

                    total: 17900,

                    cv_no: 'CV-00007',
                    release_date: '2025-01-01',
                    due_date: '2027-01-01',
                    account_short_name: 'EXECUTIVE LOAN',
                    terms: 36,
                    principal: 250000,
                    interest: 25000,
                    days: 365,
                    interest_earned: 18000,
                    status: 'ACTIVE',
                    loan_balance: 180000,
                    last_pay_date: '2025-12-12',
                },
                {
                    pasbook_no: 'PB-00008',
                    member_name: 'LIZA MANALO',

                    itnerest_share_capital_average: 200000,
                    interest_share_capital_rate: 5,
                    interest_share_capital_amount: 10000,

                    patrionage_refund_earned: 150000,
                    patrionage_refund_rate: 3,
                    patrionage_refund_amount: 4500,

                    total: 14500,

                    cv_no: 'CV-00008',
                    release_date: '2025-02-15',
                    due_date: '2027-02-15',
                    account_short_name: 'EXECUTIVE LOAN',
                    terms: 36,
                    principal: 200000,
                    interest: 20000,
                    days: 365,
                    interest_earned: 15000,
                    status: 'ACTIVE',
                    loan_balance: 120000,
                    last_pay_date: '2025-12-08',
                },
            ],

            total_per: {
                itnerest_share_capital_average: 450000,
                interest_share_capital_amount: 22500,

                patrionage_refund_earned: 330000,
                patrionage_refund_amount: 9900,

                total: 32400,

                principal: 450000,
                interest: 45000,
                interest_earned: 33000,
                loan_balance: 300000,
            },
        },
    ],

    no_grouping_data_entries: [
        {
            pasbook_no: 'PB-10001',
            member_name: 'NO GROUP MEMBER 1',

            itnerest_share_capital_average: 50000,
            interest_share_capital_rate: 5,
            interest_share_capital_amount: 2500,

            patrionage_refund_earned: 40000,
            patrionage_refund_rate: 3,
            patrionage_refund_amount: 1200,

            total: 3700,

            cv_no: 'CV-NG-001',
            release_date: '2025-01-01',
            due_date: '2026-01-01',
            account_short_name: 'REGULAR LOAN',
            terms: 12,
            principal: 20000,
            interest: 2000,
            days: 365,
            interest_earned: 1200,
            status: 'ACTIVE',
            loan_balance: 10000,
            last_pay_date: '2025-12-15',
        },

        {
            pasbook_no: 'PB-10002',
            member_name: 'NO GROUP MEMBER 2',

            itnerest_share_capital_average: 70000,
            interest_share_capital_rate: 5,
            interest_share_capital_amount: 3500,

            patrionage_refund_earned: 50000,
            patrionage_refund_rate: 3,
            patrionage_refund_amount: 1500,

            total: 5000,

            cv_no: 'CV-NG-002',
            release_date: '2025-05-01',
            due_date: '2026-05-01',
            account_short_name: 'EMERGENCY LOAN',
            terms: 6,
            principal: 15000,
            interest: 1500,
            days: 180,
            interest_earned: 900,
            status: 'PAID',
            loan_balance: 0,
            last_pay_date: '2025-11-20',
        },
    ],

    grand_total: {
        itnerest_share_capital_average: 460000,
        interest_share_capital_amount: 23000,

        patrionage_refund_earned: 350000,
        patrionage_refund_amount: 10500,

        total: 33500,

        principal: 220000,
        interest: 22000,
        interest_earned: 15000,
        loan_balance: 113000,
    },

    prepared_by: 'JUAN PREPARER',
    checked_by: 'MARIA CHECKER',
    approved_by: 'PEDRO APPROVER',
}

export const ICPR_REPORT_TEMPLATES: GeneratedReportTemplate<
    IICPRDetailReportTemplate,
    { presentation_style?: TPresentationStyle }
>[] = [
    {
        id: 'icpr-summary-t1',
        template_name: 'ICPR Summary',
        report_name: 'ICPRReport',
        template: ICPR_SUMMARY_T1,
        template_filter: { presentation_style: 'icpr-summary' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: ICPR_PREVIEW_DATA,
    },
]
