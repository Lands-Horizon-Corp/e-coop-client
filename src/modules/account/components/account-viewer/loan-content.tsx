import { cn } from '@/helpers'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'

import {
    BookThickIcon,
    BriefcaseMedicalIcon,
    CalculatorIcon,
    CalendarNumberIcon,
    ClockIcon,
    ColumnIcon,
    FileFillIcon,
    GridIcon,
    MinusIcon,
    RenderIcon,
} from '@/components/icons'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { useGetAllAccount } from '../../account.service'
import { IAccount } from '../../account.types'
import AccountTypeBadge from '../badges/account-type-badge'
import { AccountViewerModal } from './account-viewer'

export const LoanAccountContent = ({
    account,
    className,
}: {
    account: IAccount & { account?: IAccount }
    className?: string
}) => {
    return (
        <div className={cn('space-y-4 p-4 bg-popover rounded-2xl', className)}>
            <p className="text-sm text-popover-foreground/40 font-semibold">
                Loan Configuration
            </p>

            {/* Computation Type */}
            {/* <ComputationTypeDisplay
                computationType={account.computation_type}
            /> */}

            {/* Computation Scheme & Loan Saving Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Computation Scheme */}
                <div className="flex flex-col space-y-2">
                    <p className="font-medium text-sm">Computation Scheme</p>
                    <div
                        className={cn(
                            'relative flex w-full flex-1 items-center gap-3 rounded-2xl border px-2 py-2',
                            account.computation_sheet_id
                                ? 'border-primary bg-primary/20'
                                : 'border-input bg-muted/30'
                        )}
                    >
                        <div className="flex size-fit shrink-0 items-center justify-start p-2 rounded-lg bg-background border">
                            <CalculatorIcon />
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-medium">
                                {account.computation_sheet
                                    ? account.computation_sheet.name
                                    : 'No Scheme'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {account.computation_sheet?.description
                                    ? account.computation_sheet.description
                                    : 'No Description'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loan Saving Type */}
                <div className="space-y-2 flex flex-col">
                    <p className="font-medium text-sm">Loan Saving Type</p>
                    <div
                        className={cn(
                            'relative flex flex-1 w-full items-center gap-3 rounded-2xl border px-2 py-2',
                            account.loan_saving_type
                                ? 'border-primary bg-primary/20'
                                : 'border-input bg-muted/30'
                        )}
                    >
                        <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                            {account.loan_saving_type === 'Separate' && (
                                <GridIcon className="inline" />
                            )}
                            {account.loan_saving_type === 'Single Ledger' && (
                                <FileFillIcon className="inline" />
                            )}
                            {account.loan_saving_type ===
                                'Single Ledger if Not Zero' && (
                                <BookThickIcon className="inline" />
                            )}
                            {account.loan_saving_type ===
                                'Single Ledger Semi (15/30)' && (
                                <CalendarNumberIcon className="inline" />
                            )}
                            {account.loan_saving_type ===
                                'Single Ledger Semi Within Maturity' && (
                                <ClockIcon className="inline" />
                            )}
                            {!account.loan_saving_type && (
                                <ColumnIcon className="inline" />
                            )}
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-medium">
                                {account.loan_saving_type || 'Not Set'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {account.loan_saving_type === 'Separate' &&
                                    'Loans and savings are managed in separate ledgers.'}
                                {account.loan_saving_type === 'Single Ledger' &&
                                    'Loans and savings are managed in a single combined ledger.'}
                                {account.loan_saving_type ===
                                    'Single Ledger if Not Zero' &&
                                    'Loans and savings are managed in a single ledger with semi-monthly (15/30) entries.'}
                                {account.loan_saving_type ===
                                    'Single Ledger Semi (15/30)' &&
                                    'Single ledger with semi-monthly entries on the 15th and 30th.'}
                                {account.loan_saving_type ===
                                    'Single Ledger Semi Within Maturity' &&
                                    'Single ledger with semi-monthly entries within maturity period.'}
                                {!account.loan_saving_type &&
                                    'No loan saving type specified'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Deduction Entry */}
            <div className="space-y-2">
                <p className="font-medium text-sm">Other Deduction Entry</p>
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3',
                        account.other_deduction_entry &&
                            account.other_deduction_entry !== 'None'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                        {account.other_deduction_entry === 'Health Care' && (
                            <BriefcaseMedicalIcon className="inline" />
                        )}
                        {(account.other_deduction_entry === 'None' ||
                            !account.other_deduction_entry) && (
                            <MinusIcon className="inline" />
                        )}
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">
                            {account.other_deduction_entry || 'None'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {account.other_deduction_entry === 'None' &&
                                'No additional deductions will be applied.'}
                            {account.other_deduction_entry === 'Health Care' &&
                                'Health care deductions will be applied to this loan.'}
                            {!account.other_deduction_entry &&
                                'No deduction entry specified'}
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Account Connection */}
            <div className="space-y-3">
                <div>
                    <p className="font-medium text-sm">Account Connection</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        These accounts that are connected may affect how
                        interest, fines, and other charges are computed for this
                        loan account.
                    </p>
                </div>

                <LoanConnectedAccountsConnected
                    accountId={
                        (account?.account?.id as TEntityId) || account.id
                    }
                />
            </div>
        </div>
    )
}

export const LoanConnectedAccountsConnected = ({
    accountId,
    className,
}: {
    accountId: TEntityId
    className?: string
}) => {
    const { data: connectedAccounts, isPending } = useGetAllAccount({
        mode: 'loan-account-connections',
        accountId,
    })

    return (
        <div
            className={cn(
                'rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3',
                className
            )}
        >
            {isPending ? (
                <>
                    {/* Show 2 skeleton loaders when loading */}
                    <ConnectedAccountSkeleton />
                    <ConnectedAccountSkeleton />
                </>
            ) : connectedAccounts && connectedAccounts.length > 0 ? (
                connectedAccounts.map((account) => (
                    <ConnectedAccountItem account={account} key={account.id} />
                ))
            ) : (
                <div className="col-span-full text-center py-8">
                    <p className="text-sm text-muted-foreground">
                        No connected accounts found
                    </p>
                </div>
            )}
        </div>
    )
}

const ConnectedAccountSkeleton = () => {
    return (
        <div className="relative flex w-full items-center gap-3 rounded-2xl border border-input bg-muted/30 px-3 py-3">
            <Skeleton className="h-6 w-12 rounded-md" />
            <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
            </div>
        </div>
    )
}

const ConnectedAccountItem = ({ account }: { account: IAccount }) => {
    const viewModalState = useModalState()

    return (
        <div
            className={cn(
                'relative w-full space-y-1 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 text-accent-foreground border px-3 py-3 border-primary'
            )}
        >
            <div className="flex gap-2 items-center">
                <AccountViewerModal
                    {...viewModalState}
                    accountViewerProps={{ accountId: account.id }}
                />
                {account.currency && (
                    <CurrencyBadge
                        currency={account?.currency}
                        displayFormat="code"
                        size="sm"
                    />
                )}
                <div className="flex-1 text-sm min-w-0">
                    <p
                        className="font-medium truncate hover:underline"
                        onClick={() => viewModalState.onOpenChange(true)}
                    >
                        {account.icon && (
                            <RenderIcon
                                className="inline text-primary"
                                icon={account.icon}
                            />
                        )}{' '}
                        {account.name}
                    </p>
                </div>
                <AccountTypeBadge size="xs" type={account.type} />
            </div>
            <p className="text-xs text-muted-foreground truncate">
                {account.description}
            </p>
        </div>
    )
}
