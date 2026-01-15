import { TemplateOptions } from '@/modules/generated-report'

export const JournalVoucherTemplates: TemplateOptions[] = [
    {
        value: '/reports/journal-entry/hbs-journal-entry.hbs',
        label: 'Bank Statement',
        defaultSize: 'STATEMENT',
        description: 'Traditional loan release voucher format',
    },
    {
        value: '/reports/journal-entry/hbs-journal-entry.hbs',
        label: 'Modern Voucher',
        defaultSize: 'A5',
        description: 'Clean and contemporary design',
    },
    {
        value: '/reports/journal-entry/hbs-journal-entry.hbs',
        label: 'Bank Book',
        defaultSize: 'BANKBOOK',
        description: 'Space-efficient layout',
    },
] as const
