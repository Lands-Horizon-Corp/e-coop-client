import { TemplateOptions } from '@/modules/generated-report'

export const CashCheckVoucherTemplates: TemplateOptions[] = [
    {
        value: '/reports/cash-check-disbursement/hbs-cash-check-disbursement.hbs',
        label: 'Bank Statement',
        defaultSize: 'STATEMENT',
        description: 'Traditional loan release voucher format',
    },
    {
        value: '/reports/cash-check-disbursement/hbs-cash-check-disbursement.hbs',
        label: 'Modern Voucher',
        defaultSize: 'A5',
        description: 'Clean and contemporary design',
    },
    {
        value: '/reports/cash-check-disbursement/hbs-cash-check-disbursement.hbs',
        label: 'Bank Book',
        defaultSize: 'BANKBOOK',
        description: 'Space-efficient layout',
    },
] as const
