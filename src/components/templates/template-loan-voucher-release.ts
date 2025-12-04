import { TemplateOptions } from '@/modules/generated-report'

export const LoanVoucherReleaseTemplates: TemplateOptions[] = [
    {
        value: '/reports/loan-release-voucher/lrv-statement.hbs',
        label: 'Bank Statement',
        defaultSize: 'STATEMENT',
        description: 'Traditional loan release voucher format',
    },
    {
        value: '/reports/loan-release-voucher/lrv-A5.hbs',
        label: 'Modern Voucher',
        defaultSize: 'A5',
        description: 'Clean and contemporary design',
    },
    {
        value: '/reports/loan-release-voucher/lrv-bankbook.hbs',
        label: 'Bank Book',
        defaultSize: 'BANKBOOK',
        description: 'Space-efficient layout',
    },
    {
        defaultSize: 'A4',
        value: '/reports/loan-release-voucher/lrv-custom.hbs',
        label: 'Custom',
        description: 'Define your own paper size dimensions',
    },
] as const
