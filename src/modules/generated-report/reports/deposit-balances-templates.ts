import {
    GeneratedReportTemplate,
    IBaseReportTemplateCheck,
    IBaseReportTemplateData,
} from '@/modules/generated-report'

import { TEntityId } from '@/types'

import { TDepositBalancesSchema } from '../components/forms/deposit-balances-create-report-form'
import DEPOSIT_BALANCES_COMBINE_T1 from './templates/deposit-balances-templates/dpst-blncs-cmbne-t1.njk?raw'
import DEPOSIT_BALANCES_PER_TABLE_T1 from './templates/deposit-balances-templates/dpst-blncs-per-tbl-t1.njk?raw'

// START DO NOT EDIT
type TDataEntryItem = {
    passbook?: string
    member_name?: string

    // Ito ay based sa showable_account_column_list
    [key: `account_${string}_amount`]: number | string
}

export type TReportGroup = {
    // Gagamitin ko to solo nya <tr> indicator na start of its group
    roup_title: string
    group_name: string

    // If it has sub-groups (3+ levels), this is populated
    sub_groups?: TReportGroup[]
    //Pag leaf to, eto yung data nya meaning wlang sub group
    data_entries?: TDataEntryItem[]

    groupings?: TDepositBalancesSchema['group_by']

    // seto din ididsplay based sa groupings set
    total_per: {
        // Ito ay based sa showable_account_column_list
        [key: `account_${string}_amount`]: number | string
        [key: `account_${string}_total_members`]: number | string
    }
}

export interface IDepositBalancesReportTemplate
    extends IBaseReportTemplateData, IBaseReportTemplateCheck {
    start_date: string
    end_date: string

    mode_of_payment?: string

    grouping: TDepositBalancesSchema['group_by']
    report_type: TDepositBalancesSchema['report_type']

    showable_account_column_list: Array<{
        account_id: TEntityId
        display_entry_type?: 'CR' | 'DR'
        short_name?: string
        name?: string
    }>

    data?: Array<TReportGroup> | Array<TDataEntryItem>

    grand_total: {
        // Ito ay based sa showable_account_column_list
        [key: `account_${string}_amount`]: number | string
        [key: `account_${string}_total_members`]: number | string
    }
}
// END DO NOT EDIT

export const SHARED_DEPOSIT_BALANCES_PREVIEW_DATA: IDepositBalancesReportTemplate =
    {
        header_title: 'SAMPLE COOPERATIVE',
        header_address: '123 Main Street, Sample City',
        tax_number: '000-000-000-000',
        report_title: 'DEPOSIT BALANCES REPORT',

        start_date: '2024-10-01',
        end_date: '2024-10-31',
        mode_of_payment: 'all',
        grouping: 'by_mem_class',
        report_type: 'detail',

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
                roup_title: 'MEMBER CLASS',
                group_name: 'CLASS A',
                groupings: 'by_mem_class',
                sub_groups: [
                    {
                        roup_title: 'AREA',
                        group_name: 'AREA 1',
                        groupings: 'by_area',
                        data_entries: [
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
                        ],
                        total_per: {
                            account_acc_savings_amount: '23200.25',
                            account_acc_share_capital_amount: '6000.00',
                            account_acc_time_deposit_amount: '12000.00',
                        },
                    },
                ],
                total_per: {
                    account_acc_savings_amount: '23200.25',
                    account_acc_share_capital_amount: '6000.00',
                    account_acc_time_deposit_amount: '12000.00',
                },
            },
            {
                roup_title: 'MEMBER CLASS',
                group_name: 'CLASS B',
                groupings: 'by_mem_class',
                data_entries: [
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
                total_per: {
                    account_acc_savings_amount: '13600.75',
                    account_acc_share_capital_amount: '4500.00',
                    account_acc_time_deposit_amount: '5000.00',
                },
            },
        ],

        grand_total: {
            account_acc_savings_amount: '36801.00',
            account_acc_share_capital_amount: '10500.00',
            account_acc_time_deposit_amount: '17000.00',
        },

        density: 'normal',
    }

export const DEPOSIT_BALANCES_REPORT_TEMPLATES: GeneratedReportTemplate<IDepositBalancesReportTemplate>[] =
    [
        {
            id: 'deposit-balances-cmbne-t1',
            template_name: 'Combined',
            report_name: 'DepositBalancesReport',
            template: DEPOSIT_BALANCES_COMBINE_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_DEPOSIT_BALANCES_PREVIEW_DATA,
        },
        {
            id: 'deposit-balances-per-tbl-t1',
            template_name: 'Per Table',
            report_name: 'DepositBalancesReport',
            template: DEPOSIT_BALANCES_PER_TABLE_T1,
            default_unit: 'in',
            width: '13in',
            height: '8.5in',
            density: 'normal',
            orientation: 'landscape',
            preview_data: SHARED_DEPOSIT_BALANCES_PREVIEW_DATA,
        },
    ]
