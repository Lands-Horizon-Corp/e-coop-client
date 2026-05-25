import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanCollectionDetailSchema } from '../components/forms/loan-collection-detail-create-report-form'
import LOAN_COLLECTION_DETAIL_SIMPLE_T1 from './templates/loan-collection-detail-templates/ln-coll-detail-simple-t1.njk?raw'
import LOAN_COLLECTION_DETAIL_STANDARD_T1 from './templates/loan-collection-detail-templates/ln-coll-detail-standard-t1.njk?raw'

// START DO NOT EDIT
type TDataEntryItem = {
    passbook: string
    member_fullname: string

    cv_no: string
    // for column label: due
    release_date: string
    due_date: string

    // columns based on presentation style
    // standard - standard, restruct, renewal, past due, interest,
    // advanced payment amortized, advanced payment lumpsum
    standard?: string | number
    restruct?: string | number
    renewal?: string | number
    past_due?: string | number
    interest?: string | number
    advanced_payment_amortized?: string | number
    advanced_payment_lumpsum?: string | number

    // simple - current, past due, interest, fines, total, advance pay
    current?: string | number
    fines?: string | number
    total?: string | number
    advance_pay?: string | number
}

export type TReportGroup = {
    // Gagamitin ko to solo nya <tr> indicator na start of its group
    group_title: string
    group_name: string // examples -> Account, Member Type, Barangay etc..

    // If it has sub-groups (3+ levels), this is populated
    sub_groups?: TReportGroup[]
    //Pag leaf to, eto yung data nya meaning wlang sub group
    data_entries?: TDataEntryItem[]

    groupings?: TLoanCollectionDetailSchema['grouping']

    // seto din ididsplay based sa groupings set
    total_per: {
        // totals based on presentation style columns
        total_standard?: string | number
        total_restruct?: string | number
        total_renewal?: string | number
        total_past_due?: string | number
        total_interest?: string | number
        total_advanced_payment_amortized?: string | number
        total_advanced_payment_lumpsum?: string | number

        total_current?: string | number
        total_fines?: string | number
        total_total?: string | number
        total_advance_pay?: string | number
    }
}

type TPresentationStyle = 'standard' | 'simple'
// columns na ishoshow desu depende sa presentation style
// standard - passbook, member name, cv no, due, date release, standard, restruct, renewal, past due, interest, advanced payment amortized, advanced payment lumpsum
// simple - passbook, member name, cv no, due, date release, current, past due, interest, fines, total, advance pay

export interface ILoanCollectionDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string
    presentation_style?: TPresentationStyle

    mode_of_payment?: TLoanCollectionDetailSchema['mode_of_payment']
    grouping: TLoanCollectionDetailSchema['grouping']

    // by default ang report nato ang 1st level nya ay naka by member type, so yung grouping, papasok sya sa
    // loob so pang 2nd level na sya kaya I'll keep this approach TReportGroup

    grouped_data?: TReportGroup[]

    grand_total: {
        // totals based on presentation style columns
        total_standard?: string | number
        total_restruct?: string | number
        total_renewal?: string | number
        total_past_due?: string | number
        total_interest?: string | number
        total_advanced_payment_amortized?: string | number
        total_advanced_payment_lumpsum?: string | number

        total_current?: string | number
        total_fines?: string | number
        total_total?: string | number
        total_advance_pay?: string | number
    }

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_LOAN_COLLECTION_DETAIL_PREVIEW_DATA: ILoanCollectionDetailReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'LOAN COLLECTION DETAIL REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',
        presentation_style: 'standard',
        mode_of_payment: 'all',
        grouping: 'by_account',

        grouped_data: [
            {
                group_title: 'ASSOCIATE',
                group_name: 'MEMBER TYPE',
                sub_groups: [
                    {
                        group_title: 'ACCOUNT 1',
                        group_name: 'ACCOUNT',
                        sub_groups: [
                            {
                                group_title: 'SAN ROQUE',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-001',
                                        member_fullname: 'Juan Dela Cruz',
                                        cv_no: 'CV-001',
                                        release_date: '2024-10-01',
                                        due_date: '2025-10-01',
                                        current: '12000.00',
                                        renewal: '200.00',
                                        standard: '12000.00',
                                        restruct: '500.00',
                                        past_due: '150.00',
                                        interest: '1200.00',
                                        advanced_payment_amortized: '100.00',
                                        advanced_payment_lumpsum: '50.00',
                                        fines: '25.00',
                                        total: '14025.00',
                                        advance_pay: '150.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '12000.00',
                                    total_renewal: '200.00',
                                    total_standard: '12000.00',
                                    total_restruct: '500.00',
                                    total_past_due: '150.00',
                                    total_interest: '1200.00',
                                    total_advanced_payment_amortized: '100.00',
                                    total_advanced_payment_lumpsum: '50.00',
                                    total_fines: '25.00',
                                    total_total: '14025.00',
                                    total_advance_pay: '150.00',
                                },
                            },
                            {
                                group_title: 'STA CRUZ',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-002',
                                        member_fullname: 'Maria Santos',
                                        cv_no: 'CV-002',
                                        release_date: '2024-10-02',
                                        due_date: '2025-10-02',
                                        current: '9800.00',
                                        renewal: '100.00',
                                        standard: '9800.00',
                                        restruct: '300.00',
                                        past_due: '80.00',
                                        interest: '1000.00',
                                        advanced_payment_amortized: '70.00',
                                        advanced_payment_lumpsum: '20.00',
                                        fines: '15.00',
                                        total: '11395.00',
                                        advance_pay: '90.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '9800.00',
                                    total_renewal: '100.00',
                                    total_standard: '9800.00',
                                    total_restruct: '300.00',
                                    total_past_due: '80.00',
                                    total_interest: '1000.00',
                                    total_advanced_payment_amortized: '70.00',
                                    total_advanced_payment_lumpsum: '20.00',
                                    total_fines: '15.00',
                                    total_total: '11395.00',
                                    total_advance_pay: '90.00',
                                },
                            },
                        ],
                        total_per: {
                            total_current: '21800.00',
                            total_renewal: '300.00',
                            total_standard: '21800.00',
                            total_restruct: '800.00',
                            total_past_due: '230.00',
                            total_interest: '2200.00',
                            total_advanced_payment_amortized: '170.00',
                            total_advanced_payment_lumpsum: '70.00',
                            total_fines: '40.00',
                            total_total: '25420.00',
                            total_advance_pay: '240.00',
                        },
                    },
                    {
                        group_title: 'ACCOUNT 2',
                        group_name: 'ACCOUNT',
                        sub_groups: [
                            {
                                group_title: 'POBLACION',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-003',
                                        member_fullname: 'Pedro Reyes',
                                        cv_no: 'CV-003',
                                        release_date: '2024-10-03',
                                        due_date: '2025-10-03',
                                        current: '19000.00',
                                        renewal: '400.00',
                                        standard: '19000.00',
                                        restruct: '900.00',
                                        past_due: '250.00',
                                        interest: '2000.00',
                                        advanced_payment_amortized: '120.00',
                                        advanced_payment_lumpsum: '80.00',
                                        fines: '60.00',
                                        total: '22730.00',
                                        advance_pay: '200.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '19000.00',
                                    total_renewal: '400.00',
                                    total_standard: '19000.00',
                                    total_restruct: '900.00',
                                    total_past_due: '250.00',
                                    total_interest: '2000.00',
                                    total_advanced_payment_amortized: '120.00',
                                    total_advanced_payment_lumpsum: '80.00',
                                    total_fines: '60.00',
                                    total_total: '22730.00',
                                    total_advance_pay: '200.00',
                                },
                            },
                        ],
                        total_per: {
                            total_current: '19000.00',
                            total_renewal: '400.00',
                            total_standard: '19000.00',
                            total_restruct: '900.00',
                            total_past_due: '250.00',
                            total_interest: '2000.00',
                            total_advanced_payment_amortized: '120.00',
                            total_advanced_payment_lumpsum: '80.00',
                            total_fines: '60.00',
                            total_total: '22730.00',
                            total_advance_pay: '200.00',
                        },
                    },
                ],
                total_per: {
                    total_current: '40800.00',
                    total_renewal: '700.00',
                    total_standard: '40800.00',
                    total_restruct: '1700.00',
                    total_past_due: '480.00',
                    total_interest: '4200.00',
                    total_advanced_payment_amortized: '290.00',
                    total_advanced_payment_lumpsum: '150.00',
                    total_fines: '100.00',
                    total_total: '48150.00',
                    total_advance_pay: '440.00',
                },
            },
            {
                group_title: 'REGULAR',
                group_name: 'MEMBER TYPE',
                sub_groups: [
                    {
                        group_title: 'ACCOUNT 2',
                        group_name: 'ACCOUNT',
                        sub_groups: [
                            {
                                group_title: 'MALIGAYA',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-004',
                                        member_fullname: 'Ana Bautista',
                                        cv_no: 'CV-004',
                                        release_date: '2024-10-04',
                                        due_date: '2025-10-04',
                                        current: '8750.00',
                                        renewal: '150.00',
                                        standard: '8750.00',
                                        restruct: '250.00',
                                        past_due: '95.00',
                                        interest: '900.00',
                                        advanced_payment_amortized: '60.00',
                                        advanced_payment_lumpsum: '40.00',
                                        fines: '20.00',
                                        total: '10225.00',
                                        advance_pay: '100.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '8750.00',
                                    total_renewal: '150.00',
                                    total_standard: '8750.00',
                                    total_restruct: '250.00',
                                    total_past_due: '95.00',
                                    total_interest: '900.00',
                                    total_advanced_payment_amortized: '60.00',
                                    total_advanced_payment_lumpsum: '40.00',
                                    total_fines: '20.00',
                                    total_total: '10225.00',
                                    total_advance_pay: '100.00',
                                },
                            },
                        ],
                        total_per: {
                            total_current: '8750.00',
                            total_renewal: '150.00',
                            total_standard: '8750.00',
                            total_restruct: '250.00',
                            total_past_due: '95.00',
                            total_interest: '900.00',
                            total_advanced_payment_amortized: '60.00',
                            total_advanced_payment_lumpsum: '40.00',
                            total_fines: '20.00',
                            total_total: '10225.00',
                            total_advance_pay: '100.00',
                        },
                    },
                    {
                        group_title: 'ACCOUNT 3',
                        group_name: 'ACCOUNT',
                        sub_groups: [
                            {
                                group_title: 'BUKAL',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-005',
                                        member_fullname: 'Leo Ramos',
                                        cv_no: 'CV-005',
                                        release_date: '2024-10-05',
                                        due_date: '2025-10-05',
                                        current: '14300.00',
                                        renewal: '300.00',
                                        standard: '14300.00',
                                        restruct: '650.00',
                                        past_due: '175.00',
                                        interest: '1500.00',
                                        advanced_payment_amortized: '90.00',
                                        advanced_payment_lumpsum: '35.00',
                                        fines: '45.00',
                                        total: '17060.00',
                                        advance_pay: '125.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '14300.00',
                                    total_renewal: '300.00',
                                    total_standard: '14300.00',
                                    total_restruct: '650.00',
                                    total_past_due: '175.00',
                                    total_interest: '1500.00',
                                    total_advanced_payment_amortized: '90.00',
                                    total_advanced_payment_lumpsum: '35.00',
                                    total_fines: '45.00',
                                    total_total: '17060.00',
                                    total_advance_pay: '125.00',
                                },
                            },
                            {
                                group_title: 'LUNGSOD',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        passbook: 'PB-006',
                                        member_fullname: 'Nina Flores',
                                        cv_no: 'CV-006',
                                        release_date: '2024-10-06',
                                        due_date: '2025-10-06',
                                        current: '11050.00',
                                        renewal: '250.00',
                                        standard: '11050.00',
                                        restruct: '400.00',
                                        past_due: '120.00',
                                        interest: '1100.00',
                                        advanced_payment_amortized: '75.00',
                                        advanced_payment_lumpsum: '25.00',
                                        fines: '30.00',
                                        total: '13050.00',
                                        advance_pay: '95.00',
                                    },
                                ],
                                total_per: {
                                    total_current: '11050.00',
                                    total_renewal: '250.00',
                                    total_standard: '11050.00',
                                    total_restruct: '400.00',
                                    total_past_due: '120.00',
                                    total_interest: '1100.00',
                                    total_advanced_payment_amortized: '75.00',
                                    total_advanced_payment_lumpsum: '25.00',
                                    total_fines: '30.00',
                                    total_total: '13050.00',
                                    total_advance_pay: '95.00',
                                },
                            },
                        ],
                        total_per: {
                            total_current: '25350.00',
                            total_renewal: '550.00',
                            total_standard: '25350.00',
                            total_restruct: '1050.00',
                            total_past_due: '295.00',
                            total_interest: '2600.00',
                            total_advanced_payment_amortized: '165.00',
                            total_advanced_payment_lumpsum: '60.00',
                            total_fines: '75.00',
                            total_total: '30110.00',
                            total_advance_pay: '220.00',
                        },
                    },
                ],
                total_per: {
                    total_current: '34100.00',
                    total_renewal: '700.00',
                    total_standard: '34100.00',
                    total_restruct: '1300.00',
                    total_past_due: '390.00',
                    total_interest: '3500.00',
                    total_advanced_payment_amortized: '225.00',
                    total_advanced_payment_lumpsum: '100.00',
                    total_fines: '95.00',
                    total_total: '40335.00',
                    total_advance_pay: '320.00',
                },
            },
        ],

        grand_total: {
            total_current: '74900.00',
            total_renewal: '1400.00',
            total_standard: '74900.00',
            total_restruct: '3000.00',
            total_past_due: '870.00',
            total_interest: '7700.00',
            total_advanced_payment_amortized: '515.00',
            total_advanced_payment_lumpsum: '250.00',
            total_fines: '195.00',
            total_total: '88485.00',
            total_advance_pay: '760.00',
        },

        prepared_by: 'Prepared Person',
        checked_by: 'Checked Person',
        approved_by: 'Approved Person',

        density: 'normal',
    }

export const LOAN_COLLECTION_DETAIL_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILoanCollectionDetailReportTemplate,
    { presentation_style: TPresentationStyle }
>[] = [
    {
        id: 'loan-collection-detail-t1-standard',
        template_name: 'Default (Standard)',
        report_name: 'LoanCollectionDetailReport',
        template: LOAN_COLLECTION_DETAIL_STANDARD_T1,
        template_filter: { presentation_style: 'standard' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...SHARED_LOAN_COLLECTION_DETAIL_PREVIEW_DATA,
            presentation_style: 'standard',
        },
    },
    {
        id: 'loan-collection-detail-t1-simple',
        template_name: 'Default (Simple)',
        report_name: 'LoanCollectionDetailReport',
        template: LOAN_COLLECTION_DETAIL_SIMPLE_T1,
        template_filter: { presentation_style: 'simple' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...SHARED_LOAN_COLLECTION_DETAIL_PREVIEW_DATA,
            presentation_style: 'simple',
        },
    },
]
