import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

// Account General Ledger Template 1
import ACCOUNT_GL_T1 from './templates/acct_ldgr_t1.njk?raw'

type TAccountGeneralLedgerEntry = {
    description: string

    debit?: number | string
    credit?: number | string
    balance?: number | string

    is_bold: boolean
}

export interface IAccountGeneralLedgerReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    page_title: string

    is_per_page: boolean

    all_data_entries?: Array<TAccountGeneralLedgerEntry>

    per_page_data?: Array<{
        account_name: string
        data_entries: Array<TAccountGeneralLedgerEntry>
    }>
}

export const SHARED_ACCOUNT_GENERAL_LEDGER_PREVIEW_DATA: IAccountGeneralLedgerReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'ACCOUNT GENERAL LEDGER',
        start_date: '2024-10-01',
        end_date: '2024-10-31',
        page_title: 'Account General Ledger',
        is_per_page: false,

        all_data_entries: [
            {
                description: 'PETTY CASH FUND',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/01/2025 = OPENING BALANCE',
                debit: '',
                credit: '',
                balance: 5000,
                is_bold: false,
            },
            {
                description: '10/05/2025 = PCV#001 OFFICE SUPPLIES',
                debit: '',
                credit: 450,
                balance: 4550,
                is_bold: false,
            },
            {
                description: '10/12/2025 = PCV#002 TRANSPORTATION',
                debit: '',
                credit: 200,
                balance: 4350,
                is_bold: false,
            },
            {
                description: '10/20/2025 = PCV#003 REPAIRS',
                debit: '',
                credit: 1200,
                balance: 3150,
                is_bold: false,
            },
            {
                description: '10/30/2025 = REPLENISHMENT',
                debit: 1850,
                credit: '',
                balance: 5000,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [PETTY CASH]',
                debit: 1850,
                credit: 1850,
                balance: '',
                is_bold: true,
            },

            {
                description: 'CASH IN BANK - LBP',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/01/2025 = BEG. BALANCE',
                debit: '',
                credit: '',
                balance: 450000.75,
                is_bold: false,
            },
            {
                description: '10/03/2025 = OR#5501 MEMBER DEPOSIT',
                debit: 25000,
                credit: '',
                balance: 475000.75,
                is_bold: false,
            },
            {
                description: '10/04/2025 = CV#2001 LOAN RELEASE',
                debit: '',
                credit: 100000,
                balance: 375000.75,
                is_bold: false,
            },
            {
                description: '10/06/2025 = OR#5502 LOAN PAYMENT',
                debit: 12500,
                credit: '',
                balance: 387500.75,
                is_bold: false,
            },
            {
                description: '10/08/2025 = CV#2002 UTILITIES',
                debit: '',
                credit: 8450,
                balance: 379050.75,
                is_bold: false,
            },
            {
                description: '10/10/2025 = OR#5503 SHARE CAPITAL',
                debit: 5000,
                credit: '',
                balance: 384050.75,
                is_bold: false,
            },
            {
                description: '10/15/2025 = CV#2003 SALARIES',
                debit: '',
                credit: 65000,
                balance: 319050.75,
                is_bold: false,
            },
            {
                description: '10/18/2025 = OR#5504 MEMBER DEPOSIT',
                debit: 15000,
                credit: '',
                balance: 334050.75,
                is_bold: false,
            },
            {
                description: '10/22/2025 = CV#2004 RENT',
                debit: '',
                credit: 20000,
                balance: 314050.75,
                is_bold: false,
            },
            {
                description: '10/25/2025 = OR#5505 LOAN PAYMENT',
                debit: 8200,
                credit: '',
                balance: 322250.75,
                is_bold: false,
            },
            {
                description: '10/28/2025 = CV#2005 BIR TAXES',
                debit: '',
                credit: 3200,
                balance: 319050.75,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [CASH IN BANK]',
                debit: 65700,
                credit: 196650,
                balance: '',
                is_bold: true,
            },

            {
                description: 'LOANS RECEIVABLE - PRODUCTIVE',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/01/2025 = BEG. BALANCE',
                debit: '',
                credit: '',
                balance: 1250000,
                is_bold: false,
            },
            {
                description: '10/05/2025 = NEW LOANS ISSUED',
                debit: 150000,
                credit: '',
                balance: 1400000,
                is_bold: false,
            },
            {
                description: '10/15/2025 = COLLECTIONS (JV-01)',
                debit: '',
                credit: 45000,
                balance: 1355000,
                is_bold: false,
            },
            {
                description: '10/25/2025 = COLLECTIONS (JV-08)',
                debit: '',
                credit: 32000,
                balance: 1323000,
                is_bold: false,
            },
            {
                description: '10/30/2025 = NEW LOANS ISSUED',
                debit: 75000,
                credit: '',
                balance: 1398000,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [LOANS]',
                debit: 225000,
                credit: 77000,
                balance: '',
                is_bold: true,
            },

            {
                description: 'SAVINGS DEPOSITS',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/01/2025 = BEG. BALANCE',
                debit: '',
                credit: '',
                balance: 890450,
                is_bold: false,
            },
            {
                description: '10/05/2025 = MEMBER WITHDRAWALS',
                debit: 12000,
                credit: '',
                balance: 878450,
                is_bold: false,
            },
            {
                description: '10/12/2025 = DEPOSITS (OR#5510-5520)',
                debit: '',
                credit: 45000,
                balance: 923450,
                is_bold: false,
            },
            {
                description: '10/20/2025 = MEMBER WITHDRAWALS',
                debit: 5000,
                credit: '',
                balance: 918450,
                is_bold: false,
            },
            {
                description: '10/31/2025 = INTEREST CREDITED',
                debit: '',
                credit: 1200,
                balance: 919650,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [SAVINGS]',
                debit: 17000,
                credit: 46200,
                balance: '',
                is_bold: true,
            },

            // --- 4. REVENUE ---
            {
                description: 'INTEREST INCOME FROM LOANS',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/15/2025 = OCT 1-15 ACCRUAL',
                debit: '',
                credit: 18450,
                balance: 18450,
                is_bold: false,
            },
            {
                description: '10/31/2025 = OCT 16-31 ACCRUAL',
                debit: '',
                credit: 22100,
                balance: 40550,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [INTEREST INCOME]',
                debit: '',
                credit: 40550,
                balance: '',
                is_bold: true,
            },

            {
                description: 'SERVICE FEES',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/05/2025 = LOAN PROCESSING FEES',
                debit: '',
                credit: 1500,
                balance: 1500,
                is_bold: false,
            },
            {
                description: '10/30/2025 = LOAN PROCESSING FEES',
                debit: '',
                credit: 750,
                balance: 2250,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [SERVICE FEES]',
                debit: '',
                credit: 2250,
                balance: '',
                is_bold: true,
            },

            {
                description: 'SALARIES AND WAGES',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/15/2025 = 1ST QUINCENA PAYROLL',
                debit: 32500,
                credit: '',
                balance: 32500,
                is_bold: false,
            },
            {
                description: '10/30/2025 = 2ND QUINCENA PAYROLL',
                debit: 32500,
                credit: '',
                balance: 65000,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [SALARIES]',
                debit: 65000,
                credit: '',
                balance: '',
                is_bold: true,
            },

            {
                description: 'TRAVEL & TRANSPORTATION',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/04/2025 = FUEL - J. CRUZ',
                debit: 1200,
                credit: '',
                balance: 1200,
                is_bold: false,
            },
            {
                description: '10/08/2025 = FARE - FIELD VISIT',
                debit: 350,
                credit: '',
                balance: 1550,
                is_bold: false,
            },
            {
                description: '10/15/2025 = FUEL - R. SANTOS',
                debit: 1500,
                credit: '',
                balance: 3050,
                is_bold: false,
            },
            {
                description: '10/22/2025 = PARKING FEES',
                debit: 120,
                credit: '',
                balance: 3170,
                is_bold: false,
            },
            {
                description: '10/29/2025 = FUEL - J. CRUZ',
                debit: 1400,
                credit: '',
                balance: 4570,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [TRAVEL]',
                debit: 4570,
                credit: '',
                balance: '',
                is_bold: true,
            },

            {
                description: 'OFFICE SUPPLIES EXPENSE',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/02/2025 = BOND PAPER & INK',
                debit: 2450,
                credit: '',
                balance: 2450,
                is_bold: false,
            },
            {
                description: '10/14/2025 = ENVELOPES/FOLDERS',
                debit: 850,
                credit: '',
                balance: 3300,
                is_bold: false,
            },
            {
                description: '10/28/2025 = REPAIR OF PRINTER',
                debit: 1500,
                credit: '',
                balance: 4800,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [SUPPLIES]',
                debit: 4800,
                credit: '',
                balance: '',
                is_bold: true,
            },

            {
                description: 'COMMUNICATION EXPENSE',
                debit: '',
                credit: '',
                balance: '',
                is_bold: true,
            },
            {
                description: '10/10/2025 = INTERNET BILL',
                debit: 2899,
                credit: '',
                balance: 2899,
                is_bold: false,
            },
            {
                description: '10/12/2025 = MOBILE PREPAID LOAD',
                debit: 1000,
                credit: '',
                balance: 3899,
                is_bold: false,
            },
            {
                description: 'SUBTOTAL [COMMUNICATION]',
                debit: 3899,
                credit: '',
                balance: '',
                is_bold: true,
            },

            {
                description: 'REPORT MONTH-END TOTALS',
                debit: 390519,
                credit: 362650,
                balance: '',
                is_bold: true,
            },
        ],

        // PER PAGE DATA
        per_page_data: [
            {
                account_name: 'ACCRUED EXPENSES',
                data_entries: [
                    { description: 'OCTOBER', is_bold: true },
                    {
                        description: '10/09/2025 = 100902 CDV',
                        debit: 4000,
                        credit: '',
                        balance: 4000,
                        is_bold: false,
                    },
                    {
                        description: '10/10/2025 = 101002 CDV',
                        debit: 500,
                        credit: '',
                        balance: 4500,
                        is_bold: false,
                    },
                    {
                        description: '10/24/2025 = 102402 CDV',
                        debit: 500,
                        credit: '',
                        balance: 5000,
                        is_bold: false,
                    },
                    {
                        description: 'OCTOBER MONTH-END BALANCE',
                        debit: 5000,
                        credit: '',
                        balance: '',
                        is_bold: true,
                    },
                ],
            },
            {
                account_name: 'CASH IN BANK - LBP',
                data_entries: [
                    { description: 'OCTOBER', is_bold: true },
                    {
                        description: '10/01/2025 = BEGINNING BALANCE',
                        debit: 250000,
                        credit: '',
                        balance: 250000,
                        is_bold: false,
                    },
                    {
                        description: '10/05/2025 = 200501 OR',
                        debit: 15000,
                        credit: '',
                        balance: 265000,
                        is_bold: false,
                    },
                    {
                        description: '10/12/2025 = 301201 CV',
                        debit: '',
                        credit: 50000,
                        balance: 215000,
                        is_bold: false,
                    },
                    {
                        description: '10/28/2025 = 202805 OR',
                        debit: 25000,
                        credit: '',
                        balance: 240000,
                        is_bold: false,
                    },
                    {
                        description: 'OCTOBER MONTH-END BALANCE',
                        debit: '',
                        credit: '',
                        balance: 240000,
                        is_bold: true,
                    },
                ],
            },
            {
                account_name: 'INTEREST INCOME FROM LOANS',
                data_entries: [
                    { description: 'OCTOBER', is_bold: true },
                    {
                        description: '10/15/2025 = JV-2025-10-01',
                        debit: '',
                        credit: 12500,
                        balance: 12500,
                        is_bold: false,
                    },
                    {
                        description: '10/30/2025 = JV-2025-10-30',
                        debit: '',
                        credit: 8400,
                        balance: 20900,
                        is_bold: false,
                    },
                    {
                        description: 'OCTOBER MONTH-END BALANCE',
                        debit: '',
                        credit: 20900,
                        balance: '',
                        is_bold: true,
                    },
                ],
            },
            {
                account_name: 'OFFICE SUPPLIES EXPENSE',
                data_entries: [
                    { description: 'OCTOBER', is_bold: true },
                    {
                        description: '10/05/2025 = PCV-001',
                        debit: 1200,
                        credit: '',
                        balance: 1200,
                        is_bold: false,
                    },
                    {
                        description: '10/18/2025 = PCV-002',
                        debit: 850,
                        credit: '',
                        balance: 2050,
                        is_bold: false,
                    },
                    {
                        description: 'OCTOBER MONTH-END BALANCE',
                        debit: 2050,
                        credit: '',
                        balance: '',
                        is_bold: true,
                    },
                ],
            },
        ],

        check_date: '2024-10-15',
        check_number: '000123',
        print_count: 1,
        density: 'normal',
    }

export const ACCOUNT_GENERAL_LEDGER_REPORT_TEMPLATES: GeneratedReportTemplate<IAccountGeneralLedgerReportTemplate>[] =
    [
        {
            id: 'account-general-ledger-t1',
            template_name: 'Account General Ledger Report',
            report_name: 'AccountLedgerReport',
            template: ACCOUNT_GL_T1,
            default_unit: 'in',
            width: '8.5in',
            height: '11in',
            density: 'normal',
            orientation: 'portrait',
            preview_data: SHARED_ACCOUNT_GENERAL_LEDGER_PREVIEW_DATA,
        },
    ]
