import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import { TLedgerCreateReportSchema } from '../components/forms/ledger-create-report-form'
import LEDGER_COMBINE_T1 from './templates/account-balance-templates/act-blnce-t1.njk?raw'

// START DO NOT EDIT

type TPresentationStyle = 'mode1' | 'mode2'

export interface ILedgerReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment?: string
    barangay?: string

    all_accounts?: TLedgerCreateReportSchema['all_accounts']

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type?: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    // pag per account -> then member
    data?: Array<{
        member_name?: string
        pasbook_number?: string

        // fill this if all_accounts is loans
        // presentation style mode 1 & mode 2
        address?: string
        share_capital?: string | number
        release_date?: string
        maturity_date?: string
        // end mode desu

        // presentation style = mode2 specific
        payment_mode?: string
        amortization?: string | number
        // end mode desu

        ledger_entries?: Array<{
            ref_no?: string | number
            date?: string

            debit?: string | number
            credit?: string | number
            balance?: string | number

            type?: string
            employee_name?: string

            // fill this if all_accounts is 'loans'
            interest?: string | number
            interest_balance?: string | number
            fines?: string | number
            fines_balance?: string | number
            // endd desu

            // fill this if all_accounts is 'loans' and presentation style = mode2
            arrears?: string | number
        }>
    }>

    grand_total: {
        // Ito ay based sa showable_account_column_list
        [key: `account_${string}_amount`]: number | string

        //
        total_members?: number | string
    }
}
// END DO NOT EDIT

export const SHARED_LEDGER_PREVIEW_DATA: ILedgerReportTemplate = {
    header_title: 'SAMPLE COOPERATIVE',
    header_address: '123 Main Street, Sample City',
    tax_number: '000-000-000-000',
    report_title: 'DEPOSIT BALANCES REPORT',

    start_date: '2024-10-01',
    end_date: '2024-10-31',
    mode_of_payment: 'all',

    showable_account_column_list: [
        {
            account_id: 'acc_savings',
            display_entry_type: 'CR',
            short_name: 'SAV',
            name: 'Savings Deposit',
        },
        {
            account_id: 'acc_share_capital',
            display_entry_type: 'CR',
            short_name: 'SC',
            name: 'Share Capital',
        },
        {
            account_id: 'acc_time_deposit',
            display_entry_type: 'DR',
            short_name: 'TD',
            name: 'Time Deposit',
        },
    ],

    data: [
        {
            passbook: 'PB-0001',
            member_name: 'Juan Dela Cruz',
            account_acc_savings_amount: '15000.25',
            account_acc_share_capital_amount: '3500.00',
            account_acc_time_deposit_amount: '0.00',
        },
        {
            passbook: 'PB-0002',
            member_name: 'Maria Santos',
            account_acc_savings_amount: '8200.00',
            account_acc_share_capital_amount: '2500.00',
            account_acc_time_deposit_amount: '12000.00',
        },
        {
            passbook: 'PB-0101',
            member_name: 'Pedro Reyes',
            account_acc_savings_amount: '4000.00',
            account_acc_share_capital_amount: '1500.00',
            account_acc_time_deposit_amount: '5000.00',
        },
        {
            passbook: 'PB-0102',
            member_name: 'Ana Lim',
            account_acc_savings_amount: '9600.75',
            account_acc_share_capital_amount: '3000.00',
            account_acc_time_deposit_amount: '0.00',
        },
    ],

    grand_total: {
        account_acc_savings_amount: '36801.00',
        account_acc_share_capital_amount: '10500.00',
        account_acc_time_deposit_amount: '17000.00',
        total_members: '4',
    },

    density: 'normal',
}

export const LEDGER_REPORT_TEMPLATES: GeneratedReportTemplate<
    ILedgerReportTemplate,
    { presentation_style?: TPresentationStyle }
>[] = [
    {
        id: 'deposit-balances-cmbne-t1',
        template_name: 'Combined',
        report_name: 'DepositBalancesReport',
        template: LEDGER_COMBINE_T1,
        template_filter : { presentation_style : 'mode1' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LEDGER_PREVIEW_DATA,
    },
    {
        id: 'deposit-balances-cmbne-t1',
        template_name: 'Combined',
        report_name: 'DepositBalancesReport',
        template: LEDGER_COMBINE_T1,
        template_filter : { presentation_style : 'mode1' },
        default_unit: 'in',
        width: '13in',
        height: '8.5in',
        density: 'normal',
        orientation: 'landscape',
        preview_data: SHARED_LEDGER_PREVIEW_DATA,
    },
]
