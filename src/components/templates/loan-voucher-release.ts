import { TemplateOptions } from '@/modules/generated-report'

export const LoanVoucherReleaseTemplates: TemplateOptions[] = [
    {
        value: '/reports/loan-release-voucher/template-responsive.hbs',
        label: 'Bank Statement',
        defaultSize: 'STATEMENT',
        description: 'Traditional loan release voucher format',
    },
    {
        value: '/reports/loan-release-voucher/template-responsive.hbs',
        label: 'Modern Voucher',
        defaultSize: 'A5',
        description: 'Clean and contemporary design',
    },
    {
        value: '/reports/loan-release-voucher/template-responsive.hbs',
        label: 'Bank Book',
        defaultSize: 'BANKBOOK',
        description: 'Space-efficient layout',
    },
] as const
