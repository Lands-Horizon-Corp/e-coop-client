import { GeneratedReportTemplate } from '@/modules/generated-report'

import NUMBER_TAG_BL_T1 from './templates/number-tag-templates/nmbr-tg-bl-t1.njk?raw'
import NUMBER_TAG_BR_T1 from './templates/number-tag-templates/nmbr-tg-br-t1.njk?raw'

// START DO NOT EDIT
export interface INumberTagReportTemplate {
    start_number: number
    end_number: number
}
// END DO NOT EDIT

export const NUMBER_TAG_PREVIEW_DATA: INumberTagReportTemplate = {
    start_number: 1,
    end_number: 15,
}

export const NUMBER_TAG_REPORT_TEMPLATES: GeneratedReportTemplate<INumberTagReportTemplate>[] =
    [
        {
            id: 'number-tag-br-t1',
            template_name: 'NT Bottom Right',
            report_name: 'none',
            template: NUMBER_TAG_BR_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: NUMBER_TAG_PREVIEW_DATA,
        },
        {
            id: 'number-tag-bl-t1',
            template_name: 'NT Bottom Left',
            report_name: 'none',
            template: NUMBER_TAG_BL_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: NUMBER_TAG_PREVIEW_DATA,
        },
    ]
