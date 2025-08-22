import { ReactNode } from 'react'

import { toReadableDate } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import { AccountTypeBadge } from '@/components/badges/account-type-badge'
import { ComputationTypeBadge } from '@/components/badges/computation-type-badge'
import { GeneralLedgerTypeBadge } from '@/components/badges/general-ledger-type-badge'
import CopyTextButton from '@/components/copy-text-button'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import NumberFilter from '@/components/data-table/data-table-filters/number-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import {
    ArrowUpLong,
    FaCheckIcon,
    FaTimesIcon,
    PushPinSlashIcon,
    RenderIcon,
    TIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { IAccount, InterestDeductionEnum } from '../../account.types'

export const accountsGlobalSearchTargets: IGlobalSearchTargets<IAccount>[] = [
    { field: 'accountCode', displayText: 'Account Code' },
    { field: 'description', displayText: 'Description' },
    { field: 'altDescription', displayText: 'Alternative Description' },
    { field: 'type', displayText: 'Account Type' },
    { field: 'maxAmount', displayText: 'Max Amount' },
    { field: 'minAmount', displayText: 'Min Amount' },
    { field: 'computationType', displayText: 'Computation Type' },
    {
        field: 'earnedUnearnedInterest',
        displayText: 'Earned/Unearned Interest',
    },
    {
        field: 'otherInformationOfAnAccount',
        displayText: 'Other Information',
    },
    { field: 'name', displayText: 'Name' },
    { field: 'isInternal', displayText: 'Internal Account' },
    { field: 'cashOnHand', displayText: 'Cash On Hand' },
    { field: 'paidUpShareCapital', displayText: 'Paid Up Share Capital' },
    { field: 'finesAmort', displayText: 'Fines Amortization' },
    { field: 'finesMaturity', displayText: 'Fines Maturity' },
    { field: 'interestStandard', displayText: 'Interest Standard' },
    { field: 'interestSecured', displayText: 'Interest Secured' },
    {
        field: 'financialStatementType',
        displayText: 'Financial Statement Type',
    },
    { field: 'generalLedgerType', displayText: 'General Ledger Type' },
    {
        field: 'finesGracePeriodAmortization',
        displayText: 'Fines Grace Period (Amort.)',
    },
    {
        field: 'additionalGracePeriod',
        displayText: 'Additional Grace Period',
    },
    { field: 'numberGracePeriodDaily', displayText: 'Daily Grace Period' },
    {
        field: 'finesGracePeriodMaturity',
        displayText: 'Fines Grace Period (Maturity)',
    },
    {
        field: 'yearlySubscriptionFee',
        displayText: 'Yearly Subscription Fee',
    },
    { field: 'loanCutOffDays', displayText: 'Loan Cut-Off Days' },
    {
        field: 'lumpsumComputationType',
        displayText: 'Lumpsum Computation Type',
    },
    {
        field: 'interestFinesComputationDiminishing',
        displayText: 'Interest Fines Computation (Dim.)',
    },
    { field: 'loanSavingType', displayText: 'Loan Saving Type' },
    { field: 'interestDeduction', displayText: 'Interest Deduction' },
    { field: 'otherDeductionEntry', displayText: 'Other Deduction Entry' },
    {
        field: 'interestSavingTypeDiminishingStraight',
        displayText: 'Interest Saving Type (Dim. Straight)',
    },
    {
        field: 'generalLedgerGroupingExcludeAccount',
        displayText: 'Exclude from GL Grouping',
    },
]

export interface IAccountsTableActionComponentProp {
    row: Row<IAccount>
}

export interface IAccountsTableColumnProps {
    actionComponent?: (props: IAccountsTableActionComponentProp) => ReactNode
}

export const EnabledDisabled = ({ isEnabled }: { isEnabled?: boolean }) => {
    return (
        <div className="flex items-center justify-center">
            <Badge
                className={cn(
                    'py-0.01 text-[10.5px]',
                    isEnabled
                        ? 'bg-yellow-400 text-yellow-800 hover:bg-transparent dark:border-yellow-400 dark:bg-transparent dark:text-yellow-500'
                        : 'bg-gray-400 text-gray-800 hover:bg-gray-400'
                )}
            >
                {isEnabled ? (
                    <div className="flex items-center gap-x-2">
                        <FaCheckIcon size={10} className="text-primary" />
                        <p>enabled</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-1">
                        <FaTimesIcon size={10} className="text-gray-500" />
                        <p>disabled</p>
                    </div>
                )}
            </Badge>
        </div>
    )
}

const AccountsTableColumns = (
    opts?: IAccountsTableColumnProps
): ColumnDef<IAccount>[] => {
    return [
        {
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <HeaderToggleSelect table={table} />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            onClick={() => column.pin('left')}
                            className="mr-2 size-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                            title="Pin column to left"
                        />
                    )}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex w-fit items-center gap-x-1 px-0">
                    <Checkbox
                        aria-label="Select row"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        className="mr-2"
                    />
                    {opts?.actionComponent?.({ row })}{' '}
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: 80,
            minSize: 80,
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Account Name">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="name"
                            displayText="Account Name"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { name, icon },
                },
            }) => (
                <div className="font-medium flex items-center text-gray-600 dark:text-gray-400">
                    {icon && icon.length > 0 && (
                        <span className="mr-2">
                            <RenderIcon icon={icon as TIcon} />
                        </span>
                    )}
                    {name}
                </div>
            ),
            enableMultiSort: true,
            size: 200,
        },
        {
            id: 'accountCode',
            accessorKey: 'alternative_code',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Code">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="alternative_code"
                            displayText="Account Code"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { alternative_code },
                },
            }) => (
                <div className="flex items-center justify-between gap-x-2 text-sm">
                    <p className="w-full rounded-lg bg-background p-1 px-2 text-xs">
                        {' '}
                        {alternative_code}
                    </p>
                    <CopyTextButton
                        className="size-5"
                        textContent={alternative_code ?? ''}
                    />
                </div>
            ),
            enableMultiSort: true,
            size: 120,
        },
        {
            id: 'type',
            accessorKey: 'type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { type },
                },
            }) => <AccountTypeBadge type={type} />,
            enableSorting: true,
            size: 150,
        },

        // 3. Key Financial/Descriptive Details (Important secondary info)
        {
            id: 'description',
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Description">
                    <ColumnActions {...props}>
                        <TextFilter
                            field="description"
                            displayText="Description"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => (
                <div className="line-clamp-1 text-xs text-gray-500">
                    <PlainTextEditor content={description ?? ''} />
                </div>
            ),
            enableMultiSort: true,
            size: 250,
        },
        {
            id: 'minAmount',
            accessorKey: 'minAmount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Min Amount">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="minAmount"
                            displayText="Min Amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { minAmount },
                },
            }) => (
                <div className="text-right font-mono">
                    {minAmount !== undefined
                        ? minAmount.toLocaleString()
                        : 'N/A'}
                </div>
            ), // Format as currency
            enableSorting: true,
            size: 120,
        },
        {
            id: 'maxAmount',
            accessorKey: 'maxAmount',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Max Amount">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="maxAmount"
                            displayText="Max Amount"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { maxAmount },
                },
            }) => (
                <div className="text-right font-mono">
                    {maxAmount !== undefined
                        ? maxAmount.toLocaleString()
                        : 'N/A'}
                </div>
            ), // Format as currency
            enableSorting: true,
            size: 120,
        },
        {
            id: 'interestStandard',
            accessorKey: 'interest_standard',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Std. Interest">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="interest_standard"
                            displayText="Interest Standard"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest_standard },
                },
            }) => (
                <div className="text-right">
                    {interest_standard !== undefined
                        ? `${(interest_standard * 100).toFixed(2)}%`
                        : 'N/A'}
                </div>
            ), // Format as percentage
            enableSorting: true,
            size: 100,
        },
        {
            id: 'interestSecured',
            accessorKey: 'interest_secured',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Secured Interest">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="interest_secured"
                            displayText="Interest Secured"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest_secured },
                },
            }) => (
                <div className="text-right">
                    {interest_secured !== undefined
                        ? `${(interest_secured * 100).toFixed(2)}%`
                        : 'N/A'}
                </div>
            ), // Format as percentage
            enableSorting: true,
            size: 120,
        },
        {
            id: 'isInternal',
            accessorKey: 'is_internal',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Internal?">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { is_internal },
                },
            }) => <EnabledDisabled isEnabled={is_internal} />,
            enableSorting: true,
            size: 120,
        },

        // 4. Operational Details (Less frequently needed, but still important)
        {
            id: 'computationType',
            accessorKey: 'computation_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Computation Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { computation_type },
                },
            }) => (
                <>
                    {computation_type ? (
                        <ComputationTypeBadge type={computation_type} />
                    ) : (
                        'N/A'
                    )}
                </>
            ),
            enableSorting: true,
            size: 180,
        },
        {
            id: 'earnedUnearnedInterest',
            accessorKey: 'earned_unearned_interest',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Interest Recognition">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { earned_unearned_interest },
                },
            }) => <div className="text-xs">{earned_unearned_interest}</div>,
            enableSorting: true,
            size: 180,
        },
        {
            id: 'generalLedgerType',
            accessorKey: 'general_ledger_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="GL Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { general_ledger_type },
                },
            }) => (
                <>
                    {general_ledger_type ? (
                        <GeneralLedgerTypeBadge type={general_ledger_type} />
                    ) : (
                        'N/A'
                    )}
                </>
            ),
            enableSorting: true,
            size: 180,
        },
        {
            id: 'createdAt',
            accessorKey: 'created_at', // Use 'created_at' as accessorKey if that's the field name in IAccount
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}>
                        <DateFilter<IAccount>
                            displayText="Date Created"
                            field="created_at"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div className="text-xs">{toReadableDate(created_at)}</div>,
            enableMultiSort: true,
            size: 150,
        },

        // 5. Less Common/Detailed Fields (Can be hidden by default or appear later)
        {
            id: 'altDescription', // Kept for demonstration, but "description" might suffice
            accessorKey: 'description',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Alternative Description (Same as Description)"
                >
                    <ColumnActions {...props}>
                        <TextFilter
                            field="description"
                            displayText="Alternative Description"
                            defaultMode="contains"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { description },
                },
            }) => (
                <div className="line-clamp-1 text-xs text-gray-500">
                    <PlainTextEditor content={description ?? ''} />
                </div>
            ),
            enableMultiSort: true,
            enableHiding: true, // Good candidate for hiding by default
            size: 200,
        },
        {
            id: 'otherInformationOfAnAccount',
            accessorKey: 'other_information_of_an_account',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Other Info">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { other_information_of_an_account },
                },
            }) => (
                <div className="text-xs">
                    {other_information_of_an_account || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 200,
        },
        {
            id: 'finesAmort',
            accessorKey: 'fines_amort',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Fines Amort. (%)">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="fines_amort"
                            displayText="Fines Amortization"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fines_amort },
                },
            }) => (
                <div className="text-right text-xs">
                    {fines_amort !== undefined
                        ? `${(fines_amort * 100).toFixed(2)}%`
                        : 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 100,
        },
        {
            id: 'finesMaturity',
            accessorKey: 'fines_maturity',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Fines Maturity (%)">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="fines_maturity"
                            displayText="Fines Maturity"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fines_maturity },
                },
            }) => (
                <div className="text-right text-xs">
                    {fines_maturity !== undefined
                        ? `${(fines_maturity * 100).toFixed(2)}%`
                        : 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 100,
        },
        {
            id: 'cashOnHand',
            accessorKey: 'cash_on_hand',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Cash On Hand">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { cash_on_hand },
                },
            }) => (
                <div className="flex items-center justify-center">
                    {cash_on_hand ? (
                        <FaCheckIcon size={18} className="text-primary" />
                    ) : (
                        <FaTimesIcon
                            size={18}
                            className="text-destructive/70"
                        />
                    )}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 100,
        },
        {
            id: 'paidUpShareCapital',
            accessorKey: 'paid_up_share_capital',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Paid Up Share Capital">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { paid_up_share_capital },
                },
            }) => <EnabledDisabled isEnabled={paid_up_share_capital} />,
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'finesGracePeriodAmortization',
            accessorKey: 'fines_grace_period_amortization',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Amort. Grace Period">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="fines_grace_period_amortization"
                            displayText="Amort. Grace Period"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fines_grace_period_amortization },
                },
            }) => (
                <div className="text-right text-xs">
                    {fines_grace_period_amortization || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'additionalGracePeriod',
            accessorKey: 'additional_grace_period',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Addl. Grace Period">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="additional_grace_period"
                            displayText="Additional Grace Period"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { additional_grace_period },
                },
            }) => (
                <div className="text-right text-xs">
                    {additional_grace_period || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'numberGracePeriodDaily',
            accessorKey: 'number_grace_period_daily',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Daily Grace Period">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { number_grace_period_daily },
                },
            }) => <EnabledDisabled isEnabled={number_grace_period_daily} />,
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'finesGracePeriodMaturity',
            accessorKey: 'fines_grace_period_maturity',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Maturity Grace Period">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="fines_grace_period_maturity"
                            displayText="Maturity Grace Period"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fines_grace_period_maturity },
                },
            }) => (
                <div className="text-right text-xs">
                    {fines_grace_period_maturity || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'yearlySubscriptionFee',
            accessorKey: 'yearly_subscription_fee',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Annual Fee">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="yearly_subscription_fee"
                            displayText="Yearly Subscription Fee"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { yearly_subscription_fee },
                },
            }) => (
                <div className="text-right text-xs">
                    {yearly_subscription_fee?.toLocaleString() || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 100,
        },
        {
            id: 'loanCutOffDays',
            accessorKey: 'loan_cut_off_days',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Loan Cut-Off Days">
                    <ColumnActions {...props}>
                        <NumberFilter
                            field="loan_cut_off_days"
                            displayText="Loan Cut-Off Days"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { loan_cut_off_days },
                },
            }) => (
                <div className="text-right text-xs">
                    {loan_cut_off_days || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 120,
        },
        {
            id: 'lumpsumComputationType',
            accessorKey: 'lumpsum_computation_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Lumpsum Comp. Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { lumpsum_computation_type },
                },
            }) => (
                <div className="text-xs">
                    {lumpsum_computation_type || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'interestFinesComputationDiminishing',
            accessorKey: 'interest_fines_computation_diminishing',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Interest Fines Comp. (Dim.)"
                >
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest_fines_computation_diminishing },
                },
            }) => (
                <div className="text-xs">
                    {interest_fines_computation_diminishing || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 200,
        },
        {
            id: 'loanSavingType',
            accessorKey: 'loan_saving_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Loan Saving Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { loan_saving_type },
                },
            }) => <div className="text-xs">{loan_saving_type || 'N/A'}</div>,
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'interestDeduction',
            accessorKey: 'interest_deduction',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Interest Deduction">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest_deduction },
                },
            }) => (
                <div className="flex items-center justify-start gap-x-1 text-xs">
                    <p
                        className={cn(
                            interest_deduction === InterestDeductionEnum.Above
                                ? 'text-blue-500'
                                : 'text-red-400'
                        )}
                    >
                        {interest_deduction}
                    </p>
                    {interest_deduction === InterestDeductionEnum.Above ? (
                        <ArrowUpLong className="text-blue-400" />
                    ) : (
                        <ArrowUpLong className="rotate-180 text-red-400" />
                    )}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 120,
        },
        {
            id: 'otherDeductionEntry',
            accessorKey: 'other_deduction_entry',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Other Deduction Entry">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { other_deduction_entry },
                },
            }) => (
                <div className="text-xs">{other_deduction_entry || 'N/A'}</div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 150,
        },
        {
            id: 'interestSavingTypeDiminishingStraight',
            accessorKey: 'interest_saving_type_diminishing_straight',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Interest Saving Type (Dim. Straight)"
                >
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { interest_saving_type_diminishing_straight },
                },
            }) => (
                <div className="text-xs">
                    {interest_saving_type_diminishing_straight || 'N/A'}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
            size: 200,
        },
        {
            id: 'generalLedgerGroupingExcludeAccount',
            accessorKey: 'general_ledger_grouping_exclude_account',
            header: (props) => (
                <DataTableColumnHeader
                    {...props}
                    title="Exclude from GL Grouping"
                >
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { general_ledger_grouping_exclude_account },
                },
            }) => (
                <EnabledDisabled
                    isEnabled={general_ledger_grouping_exclude_account}
                />
            ),
            enableSorting: true,
            enableHiding: true,
            size: 180,
        },
    ]
}

export default AccountsTableColumns
