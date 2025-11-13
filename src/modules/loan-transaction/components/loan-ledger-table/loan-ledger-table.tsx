import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { AccountTypeBadge, IAccount } from '@/modules/account'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { currencyFormat } from '@/modules/currency'
import {
    IGeneralLedger,
    useGetAllGeneralLedger,
} from '@/modules/general-ledger'
import { Fragment } from 'react/jsx-runtime'

import ImageNameDisplay from '@/components/image-name-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    getAccountTypePriority,
    getLedgerUniqueAccounts,
    loanNormalizeLedgerEntries,
} from './loan-ledger-table.utils'

type Props = {
    className?: string
    view: 'data' | 'skeleton'
    data: IGeneralLedger[]
}

const getColorClass = (i: number) => {
    const colors = [
        'bg-primary/20',
        'bg-blue-400/30 text-blue-800 dark:text-blue-300',
        'bg-orange-400/40 text-orange-900 dark:text-orange-300',
        'bg-accent/70 text-accent-foreground',
        'bg-card-400 text-card-700',
        'bg-warning text-warning-foreground',
    ]

    return colors[i % colors.length]
}

const mappAccountColor = (accounts: IAccount[]) => {
    const colorMap: Record<TEntityId, string> = {}

    accounts.forEach((account, index) => {
        colorMap[account.id] = getColorClass(index)
    })

    return colorMap
}

export const LoanLedgerTable = ({ data = [], className, view }: Props) => {
    const uniqueAccounts = getLedgerUniqueAccounts({
        ledgerEntries: data,
    }).uniqueAccountsArray.sort(
        (a, b) =>
            getAccountTypePriority(a.type) - getAccountTypePriority(b.type)
    )

    const accountColorMap = mappAccountColor(uniqueAccounts)

    const normalizedLedgerData = loanNormalizeLedgerEntries({
        ledgerEntries: data,
    })

    if (view === 'skeleton') {
        return (
            <div className="w-full flex-1  grid gap-x-4 grid-cols-4 p-4 rounded-2xl bg-accent/40">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full size-8 shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full size-8 shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full size-8 shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full size-8 shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="h-8 w-[20%] shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="h-8 w-[20%] shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="h-8 w-[20%] shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="h-8 w-[20%] shrink-0 rounded-full" />
                        <Skeleton className="w-full h-8 rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    // Get currency from first entry if available
    const currency = normalizedLedgerData[0]?.currency

    return (
        <div className={cn('min-h-0 h-full', className)}>
            <Table
                className="table-auto"
                wrapperClassName="max-w-full min-h-full bg-card border max-h-full min-w-0 ecoop-scroll overflow-auto rounded-xl"
            >
                <TableHeader className="sticky top-0 rounded-t-2xl overflow-clip z-10 bg-muted/90 backdrop-blur-xs">
                    <TableRow className="!hover:bg-muted">
                        <TableHead colSpan={2} />
                        {uniqueAccounts.map((account) => (
                            <TableHead
                                className={cn(
                                    'text-center h-fit py-1',
                                    accountColorMap[account.id]
                                )}
                                colSpan={3}
                                key={account.id}
                            >
                                <AccountColumnHeader
                                    account={account}
                                    accountHistoryId={
                                        account.account_history_id
                                    }
                                />
                            </TableHead>
                        ))}
                        <TableHead />
                    </TableRow>
                    <TableRow className="!hover:bg-muted">
                        <TableHead className="sticky text-nowrap left-0 backdrop-blur-sm bg-background/60 align-middle">
                            Reference #
                        </TableHead>
                        <TableHead className="align-middle text-nowrap">
                            Entry Date
                        </TableHead>
                        {uniqueAccounts.map((account) => (
                            <Fragment key={account.id}>
                                <TableHead
                                    className={cn(
                                        'text-right opacity-70 w-[150px]',
                                        accountColorMap[account.id]
                                    )}
                                >
                                    Debit
                                </TableHead>
                                <TableHead
                                    className={cn(
                                        'text-right  opacity-80 w-[150px]',
                                        accountColorMap[account.id]
                                    )}
                                >
                                    Credit
                                </TableHead>
                                <TableHead
                                    className={cn(
                                        'text-right w-[150px]',
                                        accountColorMap[account.id]
                                    )}
                                >
                                    Balance
                                </TableHead>
                            </Fragment>
                        ))}
                        <TableHead className="align-middle">Teller</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {normalizedLedgerData.map((ledgerEntry: IGeneralLedger) => {
                        return (
                            <TableRow
                                className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50"
                                key={ledgerEntry.id}
                            >
                                <TableCell className="text-sm sticky text-nowrap left-0 backdrop-blur-sm bg-background/60">
                                    {ledgerEntry.reference_number || (
                                        <span className="text-sm text-muted-foreground">
                                            No reference
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-nowrap">
                                    {ledgerEntry.entry_date && (
                                        <>
                                            {`${toReadableDate(ledgerEntry.entry_date)}`}
                                            <span className="text-xs text-muted-foreground block">
                                                {dateAgo(
                                                    ledgerEntry.entry_date
                                                )}
                                            </span>
                                        </>
                                    )}
                                </TableCell>
                                {uniqueAccounts.map((account) => {
                                    const debit =
                                        ledgerEntry[
                                            `${account.id}_debit` as keyof IGeneralLedger
                                        ] || 0
                                    const credit =
                                        ledgerEntry[
                                            `${account.id}_credit` as keyof IGeneralLedger
                                        ] || 0
                                    const balance =
                                        ledgerEntry[
                                            `${account.id}_balance` as keyof IGeneralLedger
                                        ] || 0

                                    return (
                                        <Fragment key={account.id}>
                                            <TableCell
                                                className={cn(
                                                    'text-right  opacity-70 font-mono',
                                                    accountColorMap[account.id]
                                                )}
                                            >
                                                {currencyFormat(
                                                    debit as number,
                                                    {
                                                        currency,
                                                        showSymbol: !!currency,
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right opacity-80 font-mono',
                                                    accountColorMap[account.id]
                                                )}
                                            >
                                                {currencyFormat(
                                                    credit as number,
                                                    {
                                                        currency,
                                                        showSymbol: !!currency,
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right font-mono',
                                                    accountColorMap[account.id]
                                                )}
                                            >
                                                {currencyFormat(
                                                    balance as number,
                                                    {
                                                        currency,
                                                        showSymbol: !!currency,
                                                    }
                                                )}
                                            </TableCell>
                                        </Fragment>
                                    )
                                })}
                                <TableCell className="text-sm">
                                    {ledgerEntry.employee_user && (
                                        <ImageNameDisplay
                                            name={
                                                ledgerEntry.employee_user
                                                    .full_name
                                            }
                                            src={
                                                ledgerEntry.employee_user.media
                                                    ?.download_url
                                            }
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

const AccountColumnHeader = ({
    account,
    accountHistoryId,
}: {
    accountHistoryId: TEntityId
    account: IAccount
}) => {
    const accountViewModal = useModalState()

    return (
        <>
            <AccountViewerModal
                {...accountViewModal}
                accountViewerProps={{
                    isHistoryAccount: true,
                    accountId: accountHistoryId,
                }}
            />
            <div
                className="items-center justify-center flex gap-x-2"
                onClick={() => accountViewModal.onOpenChange(true)}
            >
                <AccountTypeBadge
                    className="inline"
                    size={'xs'}
                    type={account.type}
                />
                <ActionTooltip tooltipContent={account.name}>
                    <p className="text-center text-nowrap max-w-[150px] truncate">
                        {account.name}
                    </p>
                </ActionTooltip>
            </div>
        </>
    )
}

const LoanLedgerTableView = ({
    loanTransactionId,
    className,
}: {
    loanTransactionId: TEntityId
} & IClassProps) => {
    const { data = [], isPending } = useGetAllGeneralLedger({
        mode: 'loan-transaction',
        loanTransactionId,
        options: {
            enabled: !!loanTransactionId,
        },
    })

    return (
        <div className={cn('', className)}>
            <LoanLedgerTable
                data={data}
                view={isPending ? 'skeleton' : 'data'}
            />
        </div>
    )
}

export default LoanLedgerTableView
