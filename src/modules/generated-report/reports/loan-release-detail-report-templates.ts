import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TLoanReleaseDetailSchema } from '../components/forms/loan-release-detail-create-report-form'
import LOAN_RELEASE_DETAIL_T1 from './templates/loan-release-detail-templates/ln-rls-detail-t1.njk?raw'

type TDataEntryItem = {
    passbook: string
    member_fullname: string
    account_short_name: string
    cv_no: string
    release_date: string
    due_date: string
    firt_pay_date: string
    terms: string
    mode_of_payment: string

    amortization: string | number
    current?: string | number
    restructured?: string | number
    renewal?: string | number
}

// START DO NOT EDIT
export interface ILoanReleaseDetailReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment: string

    grouping: TLoanReleaseDetailSchema['groupings']

    // by mem type
    by_member_type_data_entry: Array<{
        member_type: string
        data_entries: TDataEntryItem[]
    }>

    // by mem class
    by_member_class_data_entry: Array<{
        member_class: string
        data_entries: TDataEntryItem[]
    }>

    // by coll
    by_collection_data_entry: Array<{
        collection_name: string
        data_entries: TDataEntryItem[]
    }>

    // Signatures
    prepared_by?: string
    checked_by?: string
    approved_by?: string
}
// END DO NOT EDIT

export const SHARED_LOAN_RELEASE_DETAIL_PREVIEW_DATA: ILoanReleaseDetailReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'LOAN RELEASE DETAIL REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',
        mode_of_payment: 'all',
        grouping: 'by_mtype_acct',

        by_member_type_data_entry: [
            {
                member_type: 'REGULAR MEMBER',
                data_entries: [
                    {
                        passbook: 'PB-1001',
                        member_fullname: 'Juan Dela Cruz',
                        account_short_name: 'SAL',
                        cv_no: 'CV-24001',
                        release_date: '2024-10-02',
                        due_date: '2025-10-02',
                        firt_pay_date: '2024-11-02',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '1,250.00',
                        current: '15,000.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                    {
                        passbook: 'PB-1002',
                        member_fullname: 'Maria Santos',
                        account_short_name: 'EMR',
                        cv_no: 'CV-24002',
                        release_date: '2024-10-04',
                        due_date: '2025-04-04',
                        firt_pay_date: '2024-11-04',
                        terms: '6',
                        mode_of_payment: 'Monthly',
                        amortization: '2,100.00',
                        current: '12,600.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
            {
                member_type: 'ASSOCIATE MEMBER',
                data_entries: [
                    {
                        passbook: 'PB-2001',
                        member_fullname: 'Carlos Mendoza',
                        account_short_name: 'AGR',
                        cv_no: 'CV-24009',
                        release_date: '2024-10-15',
                        due_date: '2025-10-15',
                        firt_pay_date: '2024-11-15',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '950.00',
                        current: '11,400.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
        ],

        by_member_class_data_entry: [
            {
                member_class: 'A CLASS',
                data_entries: [
                    {
                        passbook: 'PB-1001',
                        member_fullname: 'Juan Dela Cruz',
                        account_short_name: 'SAL',
                        cv_no: 'CV-24001',
                        release_date: '2024-10-02',
                        due_date: '2025-10-02',
                        firt_pay_date: '2024-11-02',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '1,250.00',
                        current: '15,000.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
            {
                member_class: 'B CLASS',
                data_entries: [
                    {
                        passbook: 'PB-2001',
                        member_fullname: 'Carlos Mendoza',
                        account_short_name: 'AGR',
                        cv_no: 'CV-24009',
                        release_date: '2024-10-15',
                        due_date: '2025-10-15',
                        firt_pay_date: '2024-11-15',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '950.00',
                        current: '11,400.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
        ],

        by_collection_data_entry: [
            {
                collection_name: 'COLLECTOR A',
                data_entries: [
                    {
                        passbook: 'PB-1002',
                        member_fullname: 'Maria Santos',
                        account_short_name: 'EMR',
                        cv_no: 'CV-24002',
                        release_date: '2024-10-04',
                        due_date: '2025-04-04',
                        firt_pay_date: '2024-11-04',
                        terms: '6',
                        mode_of_payment: 'Monthly',
                        amortization: '2,100.00',
                        current: '12,600.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
            {
                collection_name: 'COLLECTOR B',
                data_entries: [
                    {
                        passbook: 'PB-1001',
                        member_fullname: 'Juan Dela Cruz',
                        account_short_name: 'SAL',
                        cv_no: 'CV-24001',
                        release_date: '2024-10-02',
                        due_date: '2025-10-02',
                        firt_pay_date: '2024-11-02',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '1,250.00',
                        current: '15,000.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                    {
                        passbook: 'PB-2001',
                        member_fullname: 'Carlos Mendoza',
                        account_short_name: 'AGR',
                        cv_no: 'CV-24009',
                        release_date: '2024-10-15',
                        due_date: '2025-10-15',
                        firt_pay_date: '2024-11-15',
                        terms: '12',
                        mode_of_payment: 'Monthly',
                        amortization: '950.00',
                        current: '11,400.00',
                        restructured: '0.00',
                        renewal: '0.00',
                    },
                ],
            },
        ],

        prepared_by: 'Prepared Person',
        checked_by: 'Checked Person',
        approved_by: 'Approved Person',

        density: 'normal',
    }

export const LOAN_RELEASE_DETAIL_REPORT_TEMPLATES: GeneratedReportTemplate<ILoanReleaseDetailReportTemplate>[] =
    [
        {
            id: 'loan-release-detail-t1',
            template_name: 'Default',
            report_name: 'LoanReleaseDetailReport',
            template: LOAN_RELEASE_DETAIL_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_LOAN_RELEASE_DETAIL_PREVIEW_DATA,
        },
    ]
