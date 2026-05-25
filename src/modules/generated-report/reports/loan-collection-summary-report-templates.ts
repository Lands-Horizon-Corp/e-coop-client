import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanCollectionSummarySchema } from '../components/forms/loan-collection-summary-create-report-form'
import LOAN_COLLECTION_SUMMARY_LIST_INTEREST_T1 from './templates/loan-collection-summary-templates/ln-col-smmry-list-int-earned-t1.njk?raw'
import LOAN_COLLECTION_SUMMARY_T1 from './templates/loan-collection-summary-templates/ln-col-smmry-list-t1.njk?raw'
import LOAN_COLLECTION_SUMMARY_LIST_T1 from './templates/loan-collection-summary-templates/ln-col-smmry-list-t1.njk?raw'

// START DO NOT EDIT
type TDataEntryItem = {
    account_short_name: string

    standard_amount: string | number
    standard_count: string | number

    restruct_amount: string | number
    restruct_count: string | number

    renewal_amount: string | number
    renewal_count: string | number

    past_due_amount: string | number
    past_due_count: string | number

    total_amount: string | number
    total_count: string | number

    // this can show only if presentation style is list-int-earned
    interest_earned?: string | number
}

export type TReportGroup = {
    // Gagamitin ko to solo nya <tr> indicator na start of its group
    roup_title: string
    group_name: string // examples -> Account, Member Type, Barangay etc..

    // If it has sub-groups (3+ levels), this is populated
    sub_groups?: TReportGroup[]
    // Pag leaf to, eto yung data nya meaning wlang sub group
    data_entries?: TDataEntryItem[]

    groupings?: TLoanCollectionSummarySchema['groupings']

    // seto din ididsplay sub total based sa groupings set
    total_per: {
        standard_amount?: string | number
        standard_count?: string | number

        restruct_amount?: string | number
        restruct_count?: string | number

        renewal_amount?: string | number
        renewal_count?: string | number

        past_due_amount?: string | number
        past_due_count?: string | number

        total_amount?: string | number
        total_count?: string | number

        interest_earned?: string | number
    }
}

type TPresentationStyle = 'list' | 'summary' | 'list-int-earned'

type TSummaryMetrics = {
    // nacompute mo based on that
    [key: `entry_${string}_due_loans`]: string | number
    [key: `entry_${string}_projected`]: string | number
    [key: `entry_${string}_collected`]: string | number
    [key: `entry_${string}_war`]: string | number
}

type TSummaryEntries = {
    // galing to sa loan_collections na pinasa ko galing sa form
    [key: `entry_${string}_name`]: string
} & TSummaryMetrics

type TSummaryPeriodData = {
    entries: TSummaryEntries
    sub_total: TSummaryMetrics
}

type TSummaryLoanData = {
    current: TSummaryPeriodData
    past_due: TSummaryPeriodData
}

export interface ILoanCollectionSummaryReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment?: TLoanCollectionSummarySchema['mode_of_payment']
    grouping: TLoanCollectionSummarySchema['groupings']

    // eto populate pag list ang presentation style
    grouped_data?: TReportGroup[] | TDataEntryItem[]

    // pang presentation style summary
    summary_data?: {
        // loan collection desu
        loan_collection_data: TSummaryLoanData
        // loan restructure desu
        loan_restructure_data: TSummaryLoanData

        // Signatures
        prepared_by?: string
        noted_by?: string
    }

    // seto din ididsplay based sa groupings set
    // fill this kapag presentation style is list / list-int-earned
    grand_total?: {
        standard_amount?: string | number
        standard_count?: string | number
        restruct_amount?: string | number
        restruct_count?: string | number
        renewal_amount?: string | number
        renewal_count?: string | number
        past_due_amount?: string | number
        past_due_count?: string | number
        total_amount?: string | number
        total_count?: string | number
        interest_earned?: string | number
    }
}

// Backward-compatible alias for old typo name
export type ILoanCollecitonSummaryReportTemplate =
    ILoanCollectionSummaryReportTemplate
// END DO NOT EDIT

export const SHARED_LOAN_COLLECTION_SUMMARY_PREVIEW_DATA: ILoanCollectionSummaryReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'LOAN COLLECTION SUMMARY REPORT',
        start_date: '2024-10-01',
        end_date: '2024-10-31',
        mode_of_payment: 'all',
        grouping: 'by_acct',
        summary_data: {
            loan_collection_data: {
                current: {
                    entries: {
                        entry_1_name: 'Regular',
                        entry_1_due_loans: '220000.00',
                        entry_1_projected: '205000.00',
                        entry_1_collected: '198500.00',
                        entry_1_war: '96.83%',
                        entry_2_name: 'Micro',
                        entry_2_due_loans: '155000.00',
                        entry_2_projected: '149000.00',
                        entry_2_collected: '142000.00',
                        entry_2_war: '95.30%',
                    },
                    sub_total: {
                        entry_total_due_loans: '375000.00',
                        entry_total_projected: '354000.00',
                        entry_total_collected: '340500.00',
                        entry_total_war: '96.19%',
                    },
                },
                past_due: {
                    entries: {
                        entry_1_name: 'Regular',
                        entry_1_due_loans: '45000.00',
                        entry_1_projected: '39000.00',
                        entry_1_collected: '36000.00',
                        entry_1_war: '92.31%',
                        entry_2_name: 'Micro',
                        entry_2_due_loans: '32000.00',
                        entry_2_projected: '28500.00',
                        entry_2_collected: '27100.00',
                        entry_2_war: '95.09%',
                    },
                    sub_total: {
                        entry_total_due_loans: '77000.00',
                        entry_total_projected: '67500.00',
                        entry_total_collected: '63100.00',
                        entry_total_war: '93.48%',
                    },
                },
            },
            loan_restructure_data: {
                current: {
                    entries: {
                        entry_1_name: 'Restruct A',
                        entry_1_due_loans: '52000.00',
                        entry_1_projected: '50000.00',
                        entry_1_collected: '47200.00',
                        entry_1_war: '94.40%',
                        entry_2_name: 'Restruct B',
                        entry_2_due_loans: '48000.00',
                        entry_2_projected: '45100.00',
                        entry_2_collected: '43500.00',
                        entry_2_war: '96.45%',
                    },
                    sub_total: {
                        entry_total_due_loans: '100000.00',
                        entry_total_projected: '95100.00',
                        entry_total_collected: '90700.00',
                        entry_total_war: '95.37%',
                    },
                },
                past_due: {
                    entries: {
                        entry_1_name: 'Restruct A',
                        entry_1_due_loans: '18000.00',
                        entry_1_projected: '16000.00',
                        entry_1_collected: '15100.00',
                        entry_1_war: '94.38%',
                        entry_2_name: 'Restruct B',
                        entry_2_due_loans: '12000.00',
                        entry_2_projected: '10800.00',
                        entry_2_collected: '10100.00',
                        entry_2_war: '93.52%',
                    },
                    sub_total: {
                        entry_total_due_loans: '30000.00',
                        entry_total_projected: '26800.00',
                        entry_total_collected: '25200.00',
                        entry_total_war: '94.03%',
                    },
                },
            },
            prepared_by: 'Prepared Person',
            noted_by: 'Noted Person',
        },
        grouped_data: [
            {
                roup_title: 'ACCOUNT',
                group_name: 'REG',
                data_entries: [
                    {
                        account_short_name: 'REG',
                        standard_amount: '84000.00',
                        standard_count: 9,
                        restruct_amount: '15000.00',
                        restruct_count: 2,
                        renewal_amount: '10000.00',
                        renewal_count: 1,
                        past_due_amount: '4000.00',
                        past_due_count: 1,
                        total_amount: '113000.00',
                        total_count: 13,
                        interest_earned: '9200.00',
                    },
                ],
                total_per: {
                    standard_amount: '84000.00',
                    standard_count: 9,
                    restruct_amount: '15000.00',
                    restruct_count: 2,
                    renewal_amount: '10000.00',
                    renewal_count: 1,
                    past_due_amount: '4000.00',
                    past_due_count: 1,
                    total_amount: '113000.00',
                    total_count: 13,
                    interest_earned: '9200.00',
                },
            },
            {
                roup_title: 'ACCOUNT',
                group_name: 'MIC',
                data_entries: [
                    {
                        account_short_name: 'MIC',
                        standard_amount: '62000.00',
                        standard_count: 7,
                        restruct_amount: '9000.00',
                        restruct_count: 1,
                        renewal_amount: '6000.00',
                        renewal_count: 1,
                        past_due_amount: '2000.00',
                        past_due_count: 1,
                        total_amount: '79000.00',
                        total_count: 10,
                        interest_earned: '6100.00',
                    },
                ],
                total_per: {
                    standard_amount: '62000.00',
                    standard_count: 7,
                    restruct_amount: '9000.00',
                    restruct_count: 1,
                    renewal_amount: '6000.00',
                    renewal_count: 1,
                    past_due_amount: '2000.00',
                    past_due_count: 1,
                    total_amount: '79000.00',
                    total_count: 10,
                    interest_earned: '6100.00',
                },
            },
            {
                roup_title: 'ACCOUNT',
                group_name: 'SAL',
                data_entries: [
                    {
                        account_short_name: 'SAL',
                        standard_amount: '44000.00',
                        standard_count: 5,
                        restruct_amount: '7000.00',
                        restruct_count: 1,
                        renewal_amount: '4000.00',
                        renewal_count: 1,
                        past_due_amount: '1000.00',
                        past_due_count: 1,
                        total_amount: '56000.00',
                        total_count: 8,
                        interest_earned: '4300.00',
                    },
                ],
                total_per: {
                    standard_amount: '44000.00',
                    standard_count: 5,
                    restruct_amount: '7000.00',
                    restruct_count: 1,
                    renewal_amount: '4000.00',
                    renewal_count: 1,
                    past_due_amount: '1000.00',
                    past_due_count: 1,
                    total_amount: '56000.00',
                    total_count: 8,
                    interest_earned: '4300.00',
                },
            },
        ],
        grand_total: {
            standard_amount: '190000.00',
            standard_count: 21,
            restruct_amount: '31000.00',
            restruct_count: 4,
            renewal_amount: '20000.00',
            renewal_count: 3,
            past_due_amount: '7000.00',
            past_due_count: 3,
            total_amount: '248000.00',
            total_count: 31,
            interest_earned: '19600.00',
        },
        density: 'normal',
    }

export const LOAN_COLLECTION_SUMMARY_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILoanCollectionSummaryReportTemplate,
    { presentation_style: TPresentationStyle }
>[] = [
    {
        id: 'loan-collection-summary-summary-t1',
        template_name: 'Summary',
        report_name: 'LoanCollectionSummaryReport',
        template: LOAN_COLLECTION_SUMMARY_T1,
        template_filter: { presentation_style: 'summary' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_COLLECTION_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-collection-summary-list-t1',
        template_name: 'List',
        report_name: 'LoanCollectionSummaryReport',
        template: LOAN_COLLECTION_SUMMARY_LIST_T1,
        template_filter: { presentation_style: 'list' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_COLLECTION_SUMMARY_PREVIEW_DATA,
    },
    {
        id: 'loan-collection-summary-list-int-earned-t1',
        template_name: 'List Interest Earned',
        report_name: 'LoanCollectionSummaryReport',
        template: LOAN_COLLECTION_SUMMARY_LIST_INTEREST_T1,
        template_filter: { presentation_style: 'list-int-earned' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LOAN_COLLECTION_SUMMARY_PREVIEW_DATA,
    },
]
