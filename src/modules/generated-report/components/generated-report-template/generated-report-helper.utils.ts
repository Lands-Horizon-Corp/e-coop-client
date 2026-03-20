import {
    GeneratedReportRegistryKey,
    REPORT_REGISTRY,
} from '../../generated-report-template-registry'
import {
    GeneratedReportTemplate,
    TPaperSizeUnit,
} from '../../generated-report.types'

export function getGeneratedReportTemplates(
    type: GeneratedReportRegistryKey
): GeneratedReportTemplate[] {
    return REPORT_REGISTRY[type] ?? []
}

export function getGeneratedReportTemplate(
    type: GeneratedReportRegistryKey,
    templateId: string
): GeneratedReportTemplate | undefined {
    return REPORT_REGISTRY[type]?.find((t) => t.id === templateId)
}

export function hasGeneratedReportTemplate(
    type: GeneratedReportRegistryKey,
    templateId: string
): boolean {
    return !!getGeneratedReportTemplate(type, templateId)
}

export function getDefaultGeneratedReportTemplate(
    type: GeneratedReportRegistryKey
): GeneratedReportTemplate | undefined {
    return REPORT_REGISTRY[type]?.[0]
}

export const clampMinMax = (val: number, min?: number, max?: number) => {
    if (min != null && val < min) return min
    if (max != null && val > max) return max
    return val
}

/** Approximate conversion of value+unit to CSS px for scaling calculations */
export const toPx = (value: number, unit: TPaperSizeUnit): number => {
    switch (unit) {
        case 'in':
            return value * 96
        case 'cm':
            return value * (96 / 2.54)
        case 'mm':
            return value * (96 / 25.4)
        case 'pt':
            return value * (96 / 72)
        default:
            return value
    }
}
