import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import MEMBER_CLOSE_ACCOUNT_T1 from './templates/close-account-templates/cls-accnt-t1.njk?raw'

// START DO NOT EDIT
export interface IMemberCloseAccountReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    data_entries: Array<{
        passbook?: string
        name?: string
        occupation?: string
        date_closed: string
    }>
}
// END DO NOT EDIT

export const SHARED_MEMBER_CLOSE_ACCOUNT_PREVIEW_DATA: IMemberCloseAccountReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'CLOSE ACCOUNT REPORT',

        start_date: '2026-01-01',
        end_date: '2026-03-31',

        data_entries: [
            {
                passbook: 'PB-0001',
                name: 'Juan Dela Cruz',
                occupation: 'Farmer',
                date_closed: '2026-01-15',
            },
            {
                passbook: 'PB-0002',
                name: 'Maria Santos',
                occupation: 'Vendor',
                date_closed: '2026-02-03',
            },
            {
                passbook: 'PB-0003',
                name: 'Pedro Reyes',
                occupation: 'Driver',
                date_closed: '2026-03-11',
            },
        ],

        density: 'normal',
    }

export const MEMBER_CLOSE_ACCOUNT_REPORT_TEMPLATES: GeneratedReportTemplate<IMemberCloseAccountReportTemplate>[] =
    [
        {
            id: 'member-close-account-t1',
            template_name: 'Default',
            report_name: 'CloseAccountReport',
            template: MEMBER_CLOSE_ACCOUNT_T1,
            default_unit: 'in',
            width: '8.5in',
            height: '13in',
            density: 'normal',
            orientation: 'portrait',
            preview_data: SHARED_MEMBER_CLOSE_ACCOUNT_PREVIEW_DATA,
        },
    ]
