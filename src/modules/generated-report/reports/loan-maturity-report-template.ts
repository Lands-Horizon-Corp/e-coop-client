import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanCollectionDetailSchema } from '../components/forms/loan-collection-detail-create-report-form'
import { TLoanMaturitySchema } from '../components/forms/loan-maturity-create-report-form'
import LOAN_MATURITY_STAT_ELAPSED_T1 from './templates/loan-maturity-templates/ln-mtrty-stat-elapsed-t1.njk?raw'
import LOAN_MATURITY_STAT_INT_FINES_T1 from './templates/loan-maturity-templates/ln-mtrty-stat-int-fines-t1.njk?raw'
import LOAN_MATURITY_STAT_MEMBER_SHARE_DEMOG_T1 from './templates/loan-maturity-templates/ln-mtrty-stat-member-share-demog-t1.njk?raw'
import LOAN_MATURITY_STAT_T1 from './templates/loan-maturity-templates/ln-mtrty-stat-t1.njk?raw'

// START DO NOT EDIT
type TDataEntryItem = {
    // groupings is set to 'mem_class_area_mtype_grp'
    mem_class_area_type_grp_data?: {
        member_name?: string
        loan_type?: string
        date_release?: string
        terms?: string
        payment_mode?: string
        loan_granted?: string | number
        first_pay?: string | number
        amort?: string | number
        loan_balance?: string | number
    }
    // then if mem_class_area_mtype_grp skip mo na wag kana mag fill sa baba

    // fill moto if grouping ay naka set sa 'brgy_act_ltype_pd_by_prev_mos'
    brgy_act_ltype_pd_by_prev_mos_data?: {
        passbook?: string
        member_name?: string
        account_short_name?: string
        cv_no?: string
        due_date?: string
        date_release?: string
        standard?: string | number
        restruct?: string | number
        renewal?: string | number
        pas_due?: string
    }
    // then wag mo na fill nasa baba skip na

    // for loan-stat presentation style
    loan_stat_data?: {
        passbook?: string
        member_name?: string
        cv_no?: string
        due_date?: string
        date_release?: string
        standard?: string | number
        restruct?: string | number
        renewal?: string | number
    }

    // for loan-stat-member-share-demog
    loan_stat_member_share_demog_data?: {
        passbook?: string
        share?: string | number
        due_date?: string
        date_release?: string
        amount?: string | number
        interest?: string | number
        address?: string | number
    }

    // for loan-stat-elapsed
    loan_stat_elapsed_data?: {
        passbook?: string
        member_name?: string
        date_of_loan?: string
        due_date?: string
        days_lapsed?: string | number
    }

    // for loan-stat-int-fines
    loan_stat_int_fines?: {
        passbook?: string
        member_name?: string
        cv_no?: string
        due_date?: string
        date_release?: string
        standard?: string | number
        restruct?: string | number
        renewal?: string | number
        interest?: string | number
        fines?: string | number
    }
}

type TDataEntryTotals = {
    // Fill these totals when grouping is 'mem_class_area_mtype_grp'.
    total_loan_granted?: string | number
    total_first_pay?: string | number
    total_amort?: string | number
    total_loan_balance?: string | number

    // Fill these totals when grouping is 'brgy_act_ltype_pd_by_prev_mos'.
    total_standard?: string | number
    total_restruct?: string | number
    total_renewal?: string | number

    // Fill these totals for loan-stat presentation style.
    loan_stat_total_standard?: string | number
    loan_stat_total_restruct?: string | number
    loan_stat_total_renewal?: string | number

    // Fill these totals for loan-stat-member-share-demog presentation style.
    total_share?: string | number
    total_amount?: string | number
    total_interest?: string | number
    total_address?: string | number

    // Fill these totals for loan-stat-elapsed presentation style.
    total_days_lapsed?: string | number

    // Fill these totals for loan-stat-int-fines presentation style.
    int_fines_total_standard?: string | number
    int_fines_total_restruct?: string | number
    int_fines_total_renewal?: string | number
    int_fines_total_interest?: string | number
    int_fines_total_fines?: string | number

    // Allow legacy/template-specific total keys not covered above.
    [total_key: string]: string | number | undefined
}

export type TReportGroup = {
    group_title: string
    group_name: string

    // If it has sub-groups (3+ levels), this is populated
    sub_groups?: TReportGroup[]
    //Pag leaf to, eto yung data nya meaning wlang sub group
    data_entries?: TDataEntryItem[]

    groupings?: TLoanMaturitySchema['grouping']

    // seto din ididsplay based sa groupings set
    total_per: TDataEntryTotals
}

type TPresentationStyle =
    | 'loan-stat'
    | 'loan-stat-member-share-demog'
    | 'loan-stat-elapsed'
    | 'loan-stat-int-fines'

export interface ILoanCollectionSummaryReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string
    presentation_style?: TPresentationStyle

    mode_of_payment?: TLoanCollectionDetailSchema['mode_of_payment']
    grouping: TLoanMaturitySchema['grouping']

    grouped_data?: Array<TReportGroup> | Array<TDataEntryItem>

    grand_total: TDataEntryTotals

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const LOAN_MATURITY_PREVIEW_DATA: ILoanCollectionSummaryReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'LOAN MATURITY REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',
        presentation_style: 'loan-stat',
        mode_of_payment: 'all',
        grouping: 'mem_class_area_mtype_grp',

        grouped_data: [
            {
                group_title: 'ASSOCIATE',
                group_name: 'MEMBER TYPE',
                sub_groups: [
                    {
                        group_title: 'NORTH AREA',
                        group_name: 'AREA',
                        sub_groups: [
                            {
                                group_title: 'SAN ROQUE',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Juan Dela Cruz',
                                            loan_type: 'Regular Loan',
                                            date_release: '2024-10-01',
                                            terms: '12 months',
                                            payment_mode: 'Monthly',
                                            loan_granted: 12000,
                                            first_pay: 1000,
                                            amort: 1000,
                                            loan_balance: 9500,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-001',
                                            member_name: 'Juan Dela Cruz',
                                            account_short_name: 'ACC-01',
                                            cv_no: 'CV-001',
                                            due_date: '2024-11-01',
                                            date_release: '2024-10-01',
                                            standard: 7000,
                                            restruct: 1500,
                                            renewal: 800,
                                            pas_due: '200.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-001',
                                            member_name: 'Juan Dela Cruz',
                                            cv_no: 'CV-001',
                                            due_date: '2024-11-01',
                                            date_release: '2024-10-01',
                                            standard: 7000,
                                            restruct: 1500,
                                            renewal: 800,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-001',
                                            share: 1200,
                                            due_date: '2024-11-01',
                                            date_release: '2024-10-01',
                                            amount: 9300,
                                            interest: 320,
                                            address: 'Purok 1',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-001',
                                            member_name: 'Juan Dela Cruz',
                                            date_of_loan: '2024-10-01',
                                            due_date: '2024-11-01',
                                            days_lapsed: 8,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-001',
                                            member_name: 'Juan Dela Cruz',
                                            cv_no: 'CV-001',
                                            due_date: '2024-11-01',
                                            date_release: '2024-10-01',
                                            standard: 7000,
                                            restruct: 1500,
                                            renewal: 800,
                                            interest: 320,
                                            fines: 55,
                                        },
                                    },
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Maria Santos',
                                            loan_type: 'Emergency Loan',
                                            date_release: '2024-10-02',
                                            terms: '10 months',
                                            payment_mode: 'Semi-monthly',
                                            loan_granted: 9000,
                                            first_pay: 900,
                                            amort: 900,
                                            loan_balance: 7200,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-002',
                                            member_name: 'Maria Santos',
                                            account_short_name: 'ACC-01',
                                            cv_no: 'CV-002',
                                            due_date: '2024-11-02',
                                            date_release: '2024-10-02',
                                            standard: 5400,
                                            restruct: 1000,
                                            renewal: 600,
                                            pas_due: '180.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-002',
                                            member_name: 'Maria Santos',
                                            cv_no: 'CV-002',
                                            due_date: '2024-11-02',
                                            date_release: '2024-10-02',
                                            standard: 5400,
                                            restruct: 1000,
                                            renewal: 600,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-002',
                                            share: 900,
                                            due_date: '2024-11-02',
                                            date_release: '2024-10-02',
                                            amount: 7000,
                                            interest: 250,
                                            address: 'Purok 2',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-002',
                                            member_name: 'Maria Santos',
                                            date_of_loan: '2024-10-02',
                                            due_date: '2024-11-02',
                                            days_lapsed: 4,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-002',
                                            member_name: 'Maria Santos',
                                            cv_no: 'CV-002',
                                            due_date: '2024-11-02',
                                            date_release: '2024-10-02',
                                            standard: 5400,
                                            restruct: 1000,
                                            renewal: 600,
                                            interest: 250,
                                            fines: 35,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 21000,
                                    total_first_pay: 1900,
                                    total_amort: 1900,
                                    total_loan_balance: 16700,
                                    total_standard: 12400,
                                    total_restruct: 2500,
                                    total_renewal: 1400,
                                    loan_stat_total_standard: 12400,
                                    loan_stat_total_restruct: 2500,
                                    loan_stat_total_renewal: 1400,
                                    total_share: 2100,
                                    total_amount: 16300,
                                    total_interest: 570,
                                    total_address: 2,
                                    total_days_lapsed: 12,
                                    int_fines_total_standard: 12400,
                                    int_fines_total_restruct: 2500,
                                    int_fines_total_renewal: 1400,
                                    int_fines_total_interest: 570,
                                    int_fines_total_fines: 90,
                                },
                            },
                            {
                                group_title: 'STA CRUZ',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Pedro Reyes',
                                            loan_type: 'Business Loan',
                                            date_release: '2024-10-03',
                                            terms: '18 months',
                                            payment_mode: 'Monthly',
                                            loan_granted: 15000,
                                            first_pay: 1200,
                                            amort: 900,
                                            loan_balance: 13200,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-003',
                                            member_name: 'Pedro Reyes',
                                            account_short_name: 'ACC-02',
                                            cv_no: 'CV-003',
                                            due_date: '2024-11-03',
                                            date_release: '2024-10-03',
                                            standard: 9200,
                                            restruct: 2100,
                                            renewal: 1100,
                                            pas_due: '220.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-003',
                                            member_name: 'Pedro Reyes',
                                            cv_no: 'CV-003',
                                            due_date: '2024-11-03',
                                            date_release: '2024-10-03',
                                            standard: 9200,
                                            restruct: 2100,
                                            renewal: 1100,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-003',
                                            share: 1500,
                                            due_date: '2024-11-03',
                                            date_release: '2024-10-03',
                                            amount: 12400,
                                            interest: 400,
                                            address: 'Purok 3',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-003',
                                            member_name: 'Pedro Reyes',
                                            date_of_loan: '2024-10-03',
                                            due_date: '2024-11-03',
                                            days_lapsed: 2,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-003',
                                            member_name: 'Pedro Reyes',
                                            cv_no: 'CV-003',
                                            due_date: '2024-11-03',
                                            date_release: '2024-10-03',
                                            standard: 9200,
                                            restruct: 2100,
                                            renewal: 1100,
                                            interest: 400,
                                            fines: 45,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 15000,
                                    total_first_pay: 1200,
                                    total_amort: 900,
                                    total_loan_balance: 13200,
                                    total_standard: 9200,
                                    total_restruct: 2100,
                                    total_renewal: 1100,
                                    loan_stat_total_standard: 9200,
                                    loan_stat_total_restruct: 2100,
                                    loan_stat_total_renewal: 1100,
                                    total_share: 1500,
                                    total_amount: 12400,
                                    total_interest: 400,
                                    total_address: 1,
                                    total_days_lapsed: 2,
                                    int_fines_total_standard: 9200,
                                    int_fines_total_restruct: 2100,
                                    int_fines_total_renewal: 1100,
                                    int_fines_total_interest: 400,
                                    int_fines_total_fines: 45,
                                },
                            },
                        ],
                        total_per: {
                            total_loan_granted: 36000,
                            total_first_pay: 3100,
                            total_amort: 2800,
                            total_loan_balance: 29900,
                            total_standard: 21600,
                            total_restruct: 4600,
                            total_renewal: 2500,
                            loan_stat_total_standard: 21600,
                            loan_stat_total_restruct: 4600,
                            loan_stat_total_renewal: 2500,
                            total_share: 3600,
                            total_amount: 28700,
                            total_interest: 970,
                            total_address: 3,
                            total_days_lapsed: 14,
                            int_fines_total_standard: 21600,
                            int_fines_total_restruct: 4600,
                            int_fines_total_renewal: 2500,
                            int_fines_total_interest: 970,
                            int_fines_total_fines: 135,
                        },
                    },
                    {
                        group_title: 'SOUTH AREA',
                        group_name: 'AREA',
                        sub_groups: [
                            {
                                group_title: 'MALIGAYA',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Ana Bautista',
                                            loan_type: 'Salary Loan',
                                            date_release: '2024-10-04',
                                            terms: '8 months',
                                            payment_mode: 'Monthly',
                                            loan_granted: 8000,
                                            first_pay: 800,
                                            amort: 800,
                                            loan_balance: 6400,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-004',
                                            member_name: 'Ana Bautista',
                                            account_short_name: 'ACC-03',
                                            cv_no: 'CV-004',
                                            due_date: '2024-11-04',
                                            date_release: '2024-10-04',
                                            standard: 5000,
                                            restruct: 700,
                                            renewal: 500,
                                            pas_due: '120.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-004',
                                            member_name: 'Ana Bautista',
                                            cv_no: 'CV-004',
                                            due_date: '2024-11-04',
                                            date_release: '2024-10-04',
                                            standard: 5000,
                                            restruct: 700,
                                            renewal: 500,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-004',
                                            share: 700,
                                            due_date: '2024-11-04',
                                            date_release: '2024-10-04',
                                            amount: 6200,
                                            interest: 180,
                                            address: 'Purok 1',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-004',
                                            member_name: 'Ana Bautista',
                                            date_of_loan: '2024-10-04',
                                            due_date: '2024-11-04',
                                            days_lapsed: 7,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-004',
                                            member_name: 'Ana Bautista',
                                            cv_no: 'CV-004',
                                            due_date: '2024-11-04',
                                            date_release: '2024-10-04',
                                            standard: 5000,
                                            restruct: 700,
                                            renewal: 500,
                                            interest: 180,
                                            fines: 20,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 8000,
                                    total_first_pay: 800,
                                    total_amort: 800,
                                    total_loan_balance: 6400,
                                    total_standard: 5000,
                                    total_restruct: 700,
                                    total_renewal: 500,
                                    loan_stat_total_standard: 5000,
                                    loan_stat_total_restruct: 700,
                                    loan_stat_total_renewal: 500,
                                    total_share: 700,
                                    total_amount: 6200,
                                    total_interest: 180,
                                    total_address: 1,
                                    total_days_lapsed: 7,
                                    int_fines_total_standard: 5000,
                                    int_fines_total_restruct: 700,
                                    int_fines_total_renewal: 500,
                                    int_fines_total_interest: 180,
                                    int_fines_total_fines: 20,
                                },
                            },
                        ],
                        total_per: {
                            total_loan_granted: 8000,
                            total_first_pay: 800,
                            total_amort: 800,
                            total_loan_balance: 6400,
                            total_standard: 5000,
                            total_restruct: 700,
                            total_renewal: 500,
                            loan_stat_total_standard: 5000,
                            loan_stat_total_restruct: 700,
                            loan_stat_total_renewal: 500,
                            total_share: 700,
                            total_amount: 6200,
                            total_interest: 180,
                            total_address: 1,
                            total_days_lapsed: 7,
                            int_fines_total_standard: 5000,
                            int_fines_total_restruct: 700,
                            int_fines_total_renewal: 500,
                            int_fines_total_interest: 180,
                            int_fines_total_fines: 20,
                        },
                    },
                ],
                total_per: {
                    total_loan_granted: 44000,
                    total_first_pay: 3900,
                    total_amort: 3600,
                    total_loan_balance: 36300,
                    total_standard: 26600,
                    total_restruct: 5300,
                    total_renewal: 3000,
                    loan_stat_total_standard: 26600,
                    loan_stat_total_restruct: 5300,
                    loan_stat_total_renewal: 3000,
                    total_share: 4300,
                    total_amount: 34900,
                    total_interest: 1150,
                    total_address: 4,
                    total_days_lapsed: 21,
                    int_fines_total_standard: 26600,
                    int_fines_total_restruct: 5300,
                    int_fines_total_renewal: 3000,
                    int_fines_total_interest: 1150,
                    int_fines_total_fines: 155,
                },
            },
            {
                group_title: 'REGULAR',
                group_name: 'MEMBER TYPE',
                sub_groups: [
                    {
                        group_title: 'WEST AREA',
                        group_name: 'AREA',
                        sub_groups: [
                            {
                                group_title: 'LUNGSOD',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Leo Ramos',
                                            loan_type: 'Appliance Loan',
                                            date_release: '2024-10-05',
                                            terms: '12 months',
                                            payment_mode: 'Monthly',
                                            loan_granted: 13000,
                                            first_pay: 1000,
                                            amort: 950,
                                            loan_balance: 11200,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-005',
                                            member_name: 'Leo Ramos',
                                            account_short_name: 'ACC-04',
                                            cv_no: 'CV-005',
                                            due_date: '2024-11-05',
                                            date_release: '2024-10-05',
                                            standard: 7800,
                                            restruct: 1700,
                                            renewal: 900,
                                            pas_due: '140.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-005',
                                            member_name: 'Leo Ramos',
                                            cv_no: 'CV-005',
                                            due_date: '2024-11-05',
                                            date_release: '2024-10-05',
                                            standard: 7800,
                                            restruct: 1700,
                                            renewal: 900,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-005',
                                            share: 1000,
                                            due_date: '2024-11-05',
                                            date_release: '2024-10-05',
                                            amount: 10400,
                                            interest: 300,
                                            address: 'Purok 5',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-005',
                                            member_name: 'Leo Ramos',
                                            date_of_loan: '2024-10-05',
                                            due_date: '2024-11-05',
                                            days_lapsed: 5,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-005',
                                            member_name: 'Leo Ramos',
                                            cv_no: 'CV-005',
                                            due_date: '2024-11-05',
                                            date_release: '2024-10-05',
                                            standard: 7800,
                                            restruct: 1700,
                                            renewal: 900,
                                            interest: 300,
                                            fines: 40,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 13000,
                                    total_first_pay: 1000,
                                    total_amort: 950,
                                    total_loan_balance: 11200,
                                    total_standard: 7800,
                                    total_restruct: 1700,
                                    total_renewal: 900,
                                    loan_stat_total_standard: 7800,
                                    loan_stat_total_restruct: 1700,
                                    loan_stat_total_renewal: 900,
                                    total_share: 1000,
                                    total_amount: 10400,
                                    total_interest: 300,
                                    total_address: 1,
                                    total_days_lapsed: 5,
                                    int_fines_total_standard: 7800,
                                    int_fines_total_restruct: 1700,
                                    int_fines_total_renewal: 900,
                                    int_fines_total_interest: 300,
                                    int_fines_total_fines: 40,
                                },
                            },
                        ],
                        total_per: {
                            total_loan_granted: 13000,
                            total_first_pay: 1000,
                            total_amort: 950,
                            total_loan_balance: 11200,
                            total_standard: 7800,
                            total_restruct: 1700,
                            total_renewal: 900,
                            loan_stat_total_standard: 7800,
                            loan_stat_total_restruct: 1700,
                            loan_stat_total_renewal: 900,
                            total_share: 1000,
                            total_amount: 10400,
                            total_interest: 300,
                            total_address: 1,
                            total_days_lapsed: 5,
                            int_fines_total_standard: 7800,
                            int_fines_total_restruct: 1700,
                            int_fines_total_renewal: 900,
                            int_fines_total_interest: 300,
                            int_fines_total_fines: 40,
                        },
                    },
                    {
                        group_title: 'EAST AREA',
                        group_name: 'AREA',
                        sub_groups: [
                            {
                                group_title: 'BUKAL',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Nina Flores',
                                            loan_type: 'Educational Loan',
                                            date_release: '2024-10-06',
                                            terms: '14 months',
                                            payment_mode: 'Monthly',
                                            loan_granted: 11000,
                                            first_pay: 900,
                                            amort: 850,
                                            loan_balance: 9500,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-006',
                                            member_name: 'Nina Flores',
                                            account_short_name: 'ACC-05',
                                            cv_no: 'CV-006',
                                            due_date: '2024-11-06',
                                            date_release: '2024-10-06',
                                            standard: 6700,
                                            restruct: 1200,
                                            renewal: 900,
                                            pas_due: '110.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-006',
                                            member_name: 'Nina Flores',
                                            cv_no: 'CV-006',
                                            due_date: '2024-11-06',
                                            date_release: '2024-10-06',
                                            standard: 6700,
                                            restruct: 1200,
                                            renewal: 900,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-006',
                                            share: 850,
                                            due_date: '2024-11-06',
                                            date_release: '2024-10-06',
                                            amount: 8800,
                                            interest: 260,
                                            address: 'Purok 4',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-006',
                                            member_name: 'Nina Flores',
                                            date_of_loan: '2024-10-06',
                                            due_date: '2024-11-06',
                                            days_lapsed: 3,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-006',
                                            member_name: 'Nina Flores',
                                            cv_no: 'CV-006',
                                            due_date: '2024-11-06',
                                            date_release: '2024-10-06',
                                            standard: 6700,
                                            restruct: 1200,
                                            renewal: 900,
                                            interest: 260,
                                            fines: 25,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 11000,
                                    total_first_pay: 900,
                                    total_amort: 850,
                                    total_loan_balance: 9500,
                                    total_standard: 6700,
                                    total_restruct: 1200,
                                    total_renewal: 900,
                                    loan_stat_total_standard: 6700,
                                    loan_stat_total_restruct: 1200,
                                    loan_stat_total_renewal: 900,
                                    total_share: 850,
                                    total_amount: 8800,
                                    total_interest: 260,
                                    total_address: 1,
                                    total_days_lapsed: 3,
                                    int_fines_total_standard: 6700,
                                    int_fines_total_restruct: 1200,
                                    int_fines_total_renewal: 900,
                                    int_fines_total_interest: 260,
                                    int_fines_total_fines: 25,
                                },
                            },
                            {
                                group_title: 'LUNGSOD',
                                group_name: 'BARANGAY',
                                data_entries: [
                                    {
                                        mem_class_area_type_grp_data: {
                                            member_name: 'Carlo Medina',
                                            loan_type: 'Regular Loan',
                                            date_release: '2024-10-07',
                                            terms: '10 months',
                                            payment_mode: 'Semi-monthly',
                                            loan_granted: 10000,
                                            first_pay: 850,
                                            amort: 800,
                                            loan_balance: 8700,
                                        },
                                        brgy_act_ltype_pd_by_prev_mos_data: {
                                            passbook: 'PB-007',
                                            member_name: 'Carlo Medina',
                                            account_short_name: 'ACC-05',
                                            cv_no: 'CV-007',
                                            due_date: '2024-11-07',
                                            date_release: '2024-10-07',
                                            standard: 6100,
                                            restruct: 1300,
                                            renewal: 700,
                                            pas_due: '95.00',
                                        },
                                        loan_stat_data: {
                                            passbook: 'PB-007',
                                            member_name: 'Carlo Medina',
                                            cv_no: 'CV-007',
                                            due_date: '2024-11-07',
                                            date_release: '2024-10-07',
                                            standard: 6100,
                                            restruct: 1300,
                                            renewal: 700,
                                        },
                                        loan_stat_member_share_demog_data: {
                                            passbook: 'PB-007',
                                            share: 780,
                                            due_date: '2024-11-07',
                                            date_release: '2024-10-07',
                                            amount: 8100,
                                            interest: 220,
                                            address: 'Purok 6',
                                        },
                                        loan_stat_elapsed_data: {
                                            passbook: 'PB-007',
                                            member_name: 'Carlo Medina',
                                            date_of_loan: '2024-10-07',
                                            due_date: '2024-11-07',
                                            days_lapsed: 1,
                                        },
                                        loan_stat_int_fines: {
                                            passbook: 'PB-007',
                                            member_name: 'Carlo Medina',
                                            cv_no: 'CV-007',
                                            due_date: '2024-11-07',
                                            date_release: '2024-10-07',
                                            standard: 6100,
                                            restruct: 1300,
                                            renewal: 700,
                                            interest: 220,
                                            fines: 18,
                                        },
                                    },
                                ],
                                total_per: {
                                    total_loan_granted: 10000,
                                    total_first_pay: 850,
                                    total_amort: 800,
                                    total_loan_balance: 8700,
                                    total_standard: 6100,
                                    total_restruct: 1300,
                                    total_renewal: 700,
                                    loan_stat_total_standard: 6100,
                                    loan_stat_total_restruct: 1300,
                                    loan_stat_total_renewal: 700,
                                    total_share: 780,
                                    total_amount: 8100,
                                    total_interest: 220,
                                    total_address: 1,
                                    total_days_lapsed: 1,
                                    int_fines_total_standard: 6100,
                                    int_fines_total_restruct: 1300,
                                    int_fines_total_renewal: 700,
                                    int_fines_total_interest: 220,
                                    int_fines_total_fines: 18,
                                },
                            },
                        ],
                        total_per: {
                            total_loan_granted: 21000,
                            total_first_pay: 1750,
                            total_amort: 1650,
                            total_loan_balance: 18200,
                            total_standard: 12800,
                            total_restruct: 2500,
                            total_renewal: 1600,
                            loan_stat_total_standard: 12800,
                            loan_stat_total_restruct: 2500,
                            loan_stat_total_renewal: 1600,
                            total_share: 1630,
                            total_amount: 16900,
                            total_interest: 480,
                            total_address: 2,
                            total_days_lapsed: 4,
                            int_fines_total_standard: 12800,
                            int_fines_total_restruct: 2500,
                            int_fines_total_renewal: 1600,
                            int_fines_total_interest: 480,
                            int_fines_total_fines: 43,
                        },
                    },
                ],
                total_per: {
                    total_loan_granted: 34000,
                    total_first_pay: 2750,
                    total_amort: 2600,
                    total_loan_balance: 29400,
                    total_standard: 20600,
                    total_restruct: 4200,
                    total_renewal: 2500,
                    loan_stat_total_standard: 20600,
                    loan_stat_total_restruct: 4200,
                    loan_stat_total_renewal: 2500,
                    total_share: 2630,
                    total_amount: 27300,
                    total_interest: 780,
                    total_address: 3,
                    total_days_lapsed: 9,
                    int_fines_total_standard: 20600,
                    int_fines_total_restruct: 4200,
                    int_fines_total_renewal: 2500,
                    int_fines_total_interest: 780,
                    int_fines_total_fines: 83,
                },
            },
        ],

        grand_total: {
            total_loan_granted: 78000,
            total_first_pay: 6650,
            total_amort: 6200,
            total_loan_balance: 65700,
            total_standard: 47200,
            total_restruct: 9500,
            total_renewal: 5500,
            loan_stat_total_standard: 47200,
            loan_stat_total_restruct: 9500,
            loan_stat_total_renewal: 5500,
            total_share: 6930,
            total_amount: 62200,
            total_interest: 1930,
            total_address: 7,
            total_days_lapsed: 30,
            int_fines_total_standard: 47200,
            int_fines_total_restruct: 9500,
            int_fines_total_renewal: 5500,
            int_fines_total_interest: 1930,
            int_fines_total_fines: 238,
        },

        prepared_by: 'Prepared Person',
        checked_by: 'Checked Person',
        approved_by: 'Approved Person',

        density: 'normal',
    }

export const LOAN_MATURITY_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILoanCollectionSummaryReportTemplate,
    { presentation_style: TPresentationStyle }
>[] = [
    {
        id: 'loan-maturity-stat-t1',
        template_name: 'Loan Stat (T1)',
        report_name: 'LoanMaturityReport',
        template: LOAN_MATURITY_STAT_T1,
        template_filter: { presentation_style: 'loan-stat' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...LOAN_MATURITY_PREVIEW_DATA,
            presentation_style: 'loan-stat',
        },
    },
    {
        id: 'loan-maturity-stat-member-share-demog-t1',
        template_name: 'Loan Stat Member Share Demog (T1)',
        report_name: 'LoanMaturityReport',
        template: LOAN_MATURITY_STAT_MEMBER_SHARE_DEMOG_T1,
        template_filter: { presentation_style: 'loan-stat-member-share-demog' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...LOAN_MATURITY_PREVIEW_DATA,
            presentation_style: 'loan-stat-member-share-demog',
        },
    },
    {
        id: 'loan-maturity-stat-elapsed-t1',
        template_name: 'Loan Stat Elapsed (T1)',
        report_name: 'LoanMaturityReport',
        template: LOAN_MATURITY_STAT_ELAPSED_T1,
        template_filter: { presentation_style: 'loan-stat-elapsed' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...LOAN_MATURITY_PREVIEW_DATA,
            presentation_style: 'loan-stat-elapsed',
        },
    },
    {
        id: 'loan-maturity-stat-int-fines-t1',
        template_name: 'Loan Stat Int Fines (T1)',
        report_name: 'LoanMaturityReport',
        template: LOAN_MATURITY_STAT_INT_FINES_T1,
        template_filter: { presentation_style: 'loan-stat-int-fines' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: {
            ...LOAN_MATURITY_PREVIEW_DATA,
            presentation_style: 'loan-stat-int-fines',
        },
    },
]
