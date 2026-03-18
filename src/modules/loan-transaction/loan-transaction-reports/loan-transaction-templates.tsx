import { GeneratedReportTemplate } from '@/modules/generated-report'

import { ILoanTransaction } from '../loan-transaction.types'

export const LOAN_TRANSACTION_VOUCHER_RELEASE_TEMPLATES: GeneratedReportTemplate<ILoanTransaction>[] =
    [
        {
            id: 'lrv',
            name: 'Verbose template',

            template: () => import('./templates/lt-lrv-a.njk?raw'),

            max_width: 11,
            max_height: 14,
            min_width: 8,
            min_height: 10,

            default_unit: 'in',

            width: '8.5in',
            height: '11in',

            preview_data: {
                header_title: 'SAMPLE COOPERATIVE',
                header_address: '123 Main Street, Sample City',
                tax_number: '000-000-000-000',
                report_title: 'LOAN RELEASE VOUCHER',
                pay_to: 'Juan Dela Cruz',
                account_number: '12345678',
                contact: '09171234567',
                voucher_no: 'LRV-2024-001',
                date_release: '2024-01-15',
                terms: '12',
                mode_of_payment: 'Monthly',
                processor: 'Maria Santos',
                due_date: '2025-01-15',
                loan_transaction_entries: [
                    {
                        account_title: 'Loans Receivable',
                        debit: '50,000.00',
                        credit: '',
                    },
                    {
                        account_title: 'Service Fee Income',
                        debit: '',
                        credit: '1,500.00',
                    },
                    {
                        account_title: 'Insurance Fund',
                        debit: '',
                        credit: '500.00',
                    },
                    {
                        account_title: 'Share Capital',
                        debit: '',
                        credit: '2,000.00',
                    },
                ],
                cash_on_hand_total_debit: '',
                cash_on_hand_total_credit: '46,000.00',
                total_debit: '50,000.00',
                total_credit: '50,000.00',
                total_amount_in_words: 'FORTY-SIX THOUSAND PESOS',
                prepared_by: '',
                payeee: '',
                cetified_correct: '',
                paid_by: '',
                approved_for_payment: '',
            } as unknown as ILoanTransaction,
        },
    ]
