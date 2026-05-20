import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanReleaseSummarySchema } from '../components/forms/loan-release-summary-create-report-form'
import LN_RLS_SMRY_AGE_GENDER_MATRIX_T1 from './templates/loan-release-summary-templates/ln-rls-smry-age-gender-matrix-t1.njk?raw'
import LN_RLS_SMRY_GROUPED_MBR_T1 from './templates/loan-release-summary-templates/ln-rls-smry-grouped-mbr-t1.njk?raw'
import LN_RLS_SMRY_GROUPED_SUMMARY_T1 from './templates/loan-release-summary-templates/ln-rls-smry-grouped-summary-t1.njk?raw'
import LN_RLS_SMRY_GROUPED_T1 from './templates/loan-release-summary-templates/ln-rls-smry-grouped-t1.njk?raw'
import LN_RLS_SMRY_PROCESSOR_T1 from './templates/loan-release-summary-templates/ln-rls-smry-processor-t1.njk?raw'
import LN_RLS_SMRY_RELEASE_T1 from './templates/loan-release-summary-templates/ln-rls-smry-release-t1.njk?raw'

// START DO NOT EDIT
export type TDataEntryItem = {
    account_short_name?: string
    pb_no?: string
    name?: string
    age_range?: string

    mbs_accnt_count?: string | number

    standard_amount?: string | number
    standard_count?: string | number
    standard_mbr?: string | number

    restruct_amount?: string | number
    restruct_count?: string | number
    restruct_mbr?: string | number

    renewal_amount?: string | number
    renewal_count?: string | number
    renewal_mbr?: string | number

    male_count?: string | number
    female_count?: string | number
    na_gender_count?: string | number

    total_amount?: string | number
    total_count?: string | number
    total_mbr?: string | number
    applied_amount?: string | number
    granted_amount?: string | number
    proceeds?: string | number
    interest?: string | number
}

export type TReportGroup = {
    group_title: string
    group_name: string

    sub_groups?: TReportGroup[]
    data_entries?: TDataEntryItem[]

    groupings?: unknown

    total_per: {
        subtotal_mbs_accnt_count?: string | number

        subtotal_standard_amount?: string | number
        subtotal_standard_count?: string | number
        subtotal_standard_mbr?: string | number

        subtotal_restruct_amount?: string | number
        subtotal_restruct_count?: string | number
        subtotal_restruct_mbr?: string | number

        subtotal_renewal_amount?: string | number
        subtotal_renewal_count?: string | number
        subtotal_renewal_mbr?: string | number

        subtotal_male_count?: string | number
        subtotal_female_count?: string | number
        subtotal_na_gender_count?: string | number

        subtotal_applied_amount?: string | number
        subtotal_granted_amount?: string | number

        subtotal_total_amount?: string | number
        subtotal_total_count?: string | number
        subtotal_total_mbr?: string | number
        subtotal_proceeds?: string | number
        subtotal_interest?: string | number
    }
}

export type TPresentationStyle =
    | 'grouped'
    | 'grouped-mbr'
    | 'grouped-summary'
    | 'processor'
    | 'release'
    | 'age-gender-matrix'

// heres what is data to display/fill each one of these presentation style
// "grouped" -> type of loans (accounbt name), mbs/acct cnt., STANDARD, count, RESTRUCT, count, RENEWAL, count, TOTAL, count, PROCEEDS
// subtotal -> mbs count, mbs/acc cnt, STANDARD, count, RESTRUCT, count, RENEWAL, count, Total, count, PROCEEDS,
// grand total -> mbs count, mbs/acc cnt, STANDARD, count, RESTRUCT, count, RENEWAL, count, Total, count, PROCEEDS,

// "grouped-mbr" -> type of loans (accounbt name), STANDARD, count, mbr, RESTRUCT, count, mbr, RENEWAL, count, mbr, TOTAL, count, mbr, PROCEEDS
// subtotal -> STANDARD, count, mbr, RESTRUCT, count, mbr, RENEWAL, count, mbr, TOTAL, count, mbr, PROCEEDS
// grand total -> STANDARD, count, mbr, RESTRUCT, count, mbr, RENEWAL, count, mbr, TOTAL, count, mbr, PROCEEDS

// "grouped-summary" -> type of loans (accounbt name),  STANDARD, count, RESTRUCT, count, RENEWAL, count, PROCEEDS, INTEREST
// subtotal ->   STANDARD, count, RESTRUCT, count, RENEWAL, count, PROCEEDS, INTEREST
// grand total ->   STANDARD, count, RESTRUCT, count, RENEWAL, count, PROCEEDS, INTEREST
// note this can be plain array of TDataEntry[] only if group by is set to "by_account" so i will set this to nunjucks to handle that. but default it is grouped deep nested

// "processor" -> idk yet
// subtotal ->  idk yet
// grand total ->  idk yet

// "release" -> pasbook, member name, account name, applied, granted, proceeds
// subtotal ->  this has no grand total
// grand total -> applied, granted, proceeds
// note this is plain TDataEntry[] never willb ecom a nested grouped

// "age-gender-matrix" -> age range, male, female, n/a, total
// subtotal ->  age range, male, female, n/a, total
// grand total -> age range, male, female, n/a, total

export interface ILoanReleaseSummaryReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment?: TLoanReleaseSummarySchema['mode_of_payment']
    grouping: TLoanReleaseSummarySchema['groupings']

    // if presentationm style is release
    release_data_entries?: Array<{
        pb_no?: string
        member_full_name?: string
        account_name?: string
        applied?: string | number
        granted?: string | number
        proceeds?: string | number
    }>

    // if presentation style is group*
    grouped_data?: TReportGroup[] | TDataEntryItem[] // if grouping is by account then this will not be grouped

    // only if presentation style is gender age matrix
    age_gender_data: {
        data_entries: Array<{
            age_range: string
            male?: number
            female?: number
            na?: number
            total: number
        }>
    }

    grand_total: {
        // Legacy/general totals used by existing templates
        total_amort?: string | number
        total_current?: string | number
        total_restruct?: string | number
        total_renewal?: string | number

        total_amount_applied?: string | number
        total_interest_on_loan?: string | number
        total_amount_granted?: string | number

        applied?: string | number
        granted?: string | number
        proceeds?: string | number

        // Optional explicit per-column grand totals (safe aliases for backend payload clarity)
        total_mbs_accnt_count?: string | number

        total_standard_amount?: string | number
        total_standard_count?: string | number
        total_standard_mbr?: string | number

        total_restruct_amount?: string | number
        total_restruct_count?: string | number
        total_restruct_mbr?: string | number

        total_renewal_amount?: string | number
        total_renewal_count?: string | number
        total_renewal_mbr?: string | number

        total_total_amount?: string | number
        total_total_count?: string | number
        total_total_mbr?: string | number
        total_proceeds?: string | number
        total_interest?: string | number

        // fill only if gender age matrix
        total_male?: string | number
        total_female?: string | number
        total_na?: string | number
        total_total: string | number
    }

    prepared_by?: string
    noted_by?: string
}
// END DO NOT EDIT

export const SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA: ILoanReleaseSummaryReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'LOAN RELEASE SUMMARY REPORT - SHARED PREVIEW',
        start_date: '2026-05-01',
        end_date: '2026-05-31',
        grouping: 'by_class_cat',
        mode_of_payment: 'all',
        grouped_data: [
            {
                group_title: 'CLASSIFICATION',
                group_name: 'Class A',
                sub_groups: [
                    {
                        group_title: 'PURPOSE',
                        group_name: 'Business',
                        data_entries: [
                            {
                                account_short_name: 'Regular Loan',
                                mbs_accnt_count: 12,
                                standard_amount: 120000,
                                standard_count: 10,
                                standard_mbr: 10,
                                restruct_amount: 18000,
                                restruct_count: 1,
                                restruct_mbr: 1,
                                renewal_amount: 15000,
                                renewal_count: 1,
                                renewal_mbr: 1,
                                total_amount: 153000,
                                total_count: 12,
                                total_mbr: 12,
                                proceeds: 153000,
                                interest: 18360,
                            },
                            {
                                account_short_name: 'Micro Loan',
                                mbs_accnt_count: 8,
                                standard_amount: 64000,
                                standard_count: 6,
                                standard_mbr: 6,
                                restruct_amount: 10000,
                                restruct_count: 1,
                                restruct_mbr: 1,
                                renewal_amount: 9000,
                                renewal_count: 1,
                                renewal_mbr: 1,
                                total_amount: 83000,
                                total_count: 8,
                                total_mbr: 8,
                                proceeds: 83000,
                                interest: 9960,
                            },
                        ],
                        total_per: {
                            subtotal_mbs_accnt_count: 20,
                            subtotal_standard_amount: 184000,
                            subtotal_standard_count: 16,
                            subtotal_standard_mbr: 16,
                            subtotal_restruct_amount: 28000,
                            subtotal_restruct_count: 2,
                            subtotal_restruct_mbr: 2,
                            subtotal_renewal_amount: 24000,
                            subtotal_renewal_count: 2,
                            subtotal_renewal_mbr: 2,
                            subtotal_total_amount: 236000,
                            subtotal_total_count: 20,
                            subtotal_total_mbr: 20,
                            subtotal_proceeds: 236000,
                            subtotal_interest: 28320,
                        },
                    },
                ],
                total_per: {
                    subtotal_mbs_accnt_count: 20,
                    subtotal_standard_amount: 184000,
                    subtotal_standard_count: 16,
                    subtotal_standard_mbr: 16,
                    subtotal_restruct_amount: 28000,
                    subtotal_restruct_count: 2,
                    subtotal_restruct_mbr: 2,
                    subtotal_renewal_amount: 24000,
                    subtotal_renewal_count: 2,
                    subtotal_renewal_mbr: 2,
                    subtotal_total_amount: 236000,
                    subtotal_total_count: 20,
                    subtotal_total_mbr: 20,
                    subtotal_proceeds: 236000,
                    subtotal_interest: 28320,
                },
            },
            {
                group_title: 'CLASSIFICATION',
                group_name: 'Class B',
                data_entries: [
                    {
                        account_short_name: 'Salary Loan',
                        mbs_accnt_count: 9,
                        standard_amount: 81000,
                        standard_count: 7,
                        standard_mbr: 7,
                        restruct_amount: 12000,
                        restruct_count: 1,
                        restruct_mbr: 1,
                        renewal_amount: 9000,
                        renewal_count: 1,
                        renewal_mbr: 1,
                        total_amount: 102000,
                        total_count: 9,
                        total_mbr: 9,
                        proceeds: 102000,
                        interest: 12240,
                    },
                    {
                        account_short_name: 'Calamity Loan',
                        mbs_accnt_count: 4,
                        standard_amount: 28000,
                        standard_count: 3,
                        standard_mbr: 3,
                        restruct_amount: 5000,
                        restruct_count: 1,
                        restruct_mbr: 1,
                        renewal_amount: 0,
                        renewal_count: 0,
                        renewal_mbr: 0,
                        total_amount: 33000,
                        total_count: 4,
                        total_mbr: 4,
                        proceeds: 33000,
                        interest: 3960,
                    },
                ],
                total_per: {
                    subtotal_mbs_accnt_count: 13,
                    subtotal_standard_amount: 109000,
                    subtotal_standard_count: 10,
                    subtotal_standard_mbr: 10,
                    subtotal_restruct_amount: 17000,
                    subtotal_restruct_count: 2,
                    subtotal_restruct_mbr: 2,
                    subtotal_renewal_amount: 9000,
                    subtotal_renewal_count: 1,
                    subtotal_renewal_mbr: 1,
                    subtotal_total_amount: 135000,
                    subtotal_total_count: 13,
                    subtotal_total_mbr: 13,
                    subtotal_proceeds: 135000,
                    subtotal_interest: 16200,
                },
            },
        ],
        release_data_entries: [
            {
                pb_no: 'PB-1001',
                member_full_name: 'Juan Dela Cruz',
                account_name: 'Regular Loan',
                applied: 20000,
                granted: 18000,
                proceeds: 18000,
            },
            {
                pb_no: 'PB-1002',
                member_full_name: 'Maria Santos',
                account_name: 'Micro Loan',
                applied: 15000,
                granted: 14000,
                proceeds: 14000,
            },
            {
                pb_no: 'PB-1003',
                member_full_name: 'Pedro Reyes',
                account_name: 'Salary Loan',
                applied: 12000,
                granted: 11000,
                proceeds: 11000,
            },
            {
                pb_no: 'PB-1004',
                member_full_name: 'Ana Lopez',
                account_name: 'Emergency Loan',
                applied: 10000,
                granted: 9500,
                proceeds: 9500,
            },
            {
                pb_no: 'PB-1005',
                member_full_name: 'Joel Ramirez',
                account_name: 'Calamity Loan',
                applied: 8000,
                granted: 7600,
                proceeds: 7600,
            },
            {
                pb_no: 'PB-1006',
                member_full_name: 'Liza Mendoza',
                account_name: 'Appliance Loan',
                applied: 18000,
                granted: 17000,
                proceeds: 17000,
            },
        ],
        age_gender_data: {
            data_entries: [
                { age_range: '18-25', male: 6, female: 8, na: 0, total: 14 },
                { age_range: '26-35', male: 12, female: 10, na: 1, total: 23 },
                { age_range: '36-45', male: 7, female: 9, na: 0, total: 16 },
                { age_range: '46-55', male: 5, female: 4, na: 0, total: 9 },
                { age_range: '56-65', male: 4, female: 3, na: 0, total: 7 },
                { age_range: '66+', male: 2, female: 1, na: 0, total: 3 },
            ],
        },
        grand_total: {
            total_current: 338000,
            total_restruct: 52000,
            total_renewal: 33000,
            total_interest_on_loan: 50760,
            total_amount_granted: 423000,
            applied: 83000,
            granted: 77100,
            proceeds: 77100,
            total_mbs_accnt_count: 38,
            total_standard_amount: 338000,
            total_standard_count: 30,
            total_standard_mbr: 30,
            total_restruct_amount: 52000,
            total_restruct_count: 5,
            total_restruct_mbr: 5,
            total_renewal_amount: 33000,
            total_renewal_count: 3,
            total_renewal_mbr: 3,
            total_total_amount: 423000,
            total_total_count: 38,
            total_total_mbr: 38,
            total_proceeds: 423000,
            total_interest: 50760,
            total_male: 36,
            total_female: 35,
            total_na: 1,
            total_total: 72,
        },
        prepared_by: 'Prepared Person',
        noted_by: 'Noted Person',
        density: 'normal',
    }

export const LOAN_RELEASE_SUMMARY_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILoanReleaseSummaryReportTemplate,
    { presentation_style: TPresentationStyle }
>[] = [
    {
        id: 'loan-release-summary-grouped-t1',
        template_name: 'Grouped',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_GROUPED_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'grouped' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-release-summary-grouped-summary-t1',
        template_name: 'Grouped Summary',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_GROUPED_SUMMARY_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'grouped-summary' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-release-summary-grouped-mbr-t1',
        template_name: 'Grouped Member',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_GROUPED_MBR_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'grouped-mbr' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-release-summary-processor-t1',
        template_name: 'Processor',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_PROCESSOR_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'processor' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-release-summary-release-t1',
        template_name: 'Release',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_RELEASE_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'release' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-release-summary-age-gender-matrix-t1',
        template_name: 'Age Gender Matrix',
        report_name: 'LoanReleaseSummaryReport',
        template: LN_RLS_SMRY_AGE_GENDER_MATRIX_T1,
        default_unit: 'in',
        template_filter: { presentation_style: 'age-gender-matrix' },
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_RELEASE_SUMMARY_PREVIEW_DATA,
    },
]
