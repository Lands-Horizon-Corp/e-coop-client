import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { AccountTypeBadge, IAccount } from '@/modules/account'
import {
    mapAccountColor,
    sortAccountsByTypePriority,
} from '@/modules/account/account.utils'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { currencyFormat } from '@/modules/currency'
import { IGeneralLedger } from '@/modules/general-ledger'
import { TLoanLedgerNormalized } from '@/modules/loan-transaction/loan-transaction.types'
import { Fragment } from 'react/jsx-runtime'

import { EyeIcon } from '@/components/icons'
import ImageNameDisplay from '@/components/image-name-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
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
    getLedgerUniqueAccounts,
    loanNormalizeLedgerEntries,
} from './loan-ledger-table.utils'

type Props = {
    className?: string
    view?: 'data' | 'skeleton'
    data: IGeneralLedger[]
} & IClassProps

export const LoanLedgerTable = ({
    data = [],
    className,
    view = 'skeleton',
}: Props) => {
    const [selectedAccountId, setSelectedAccountId] = useState<
        TEntityId | undefined
    >()

    const { accountColorMap, uniqueAccounts, normalizedLedgerData } =
        useMemo(() => {
            const uniqueAccounts = getLedgerUniqueAccounts({
                ledgerEntries: data,
            }).uniqueAccountsArray.sort(sortAccountsByTypePriority)
            const accountColorMap = mapAccountColor(uniqueAccounts)

            const normalizedLedgerData = loanNormalizeLedgerEntries({
                ledgerEntries: data,
            })

            return { uniqueAccounts, accountColorMap, normalizedLedgerData }
        }, [data])

    useEffect(() => {
        if (selectedAccountId) return

        setSelectedAccountId(uniqueAccounts[0]?.id)
    }, [selectedAccountId, uniqueAccounts])

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

    return (
        <div className={cn('min-h-0 h-full', className)}>
            <Table
                className="table-auto"
                wrapperClassName="max-w-full min-h-full bg-card border max-h-full min-w-0 ecoop-scroll overflow-auto rounded-xl"
            >
                <TableHeader className="sticky top-0 rounded-t-2xl overflow-clip z-10 bg-muted/90 backdrop-blur-xs">
                    <TableRow className="!hover:bg-muted">
                        {uniqueAccounts.map((account) => (
                            <TableHead
                                className={cn(
                                    'text-center',
                                    accountColorMap[account.id]
                                )}
                                colSpan={
                                    selectedAccountId === account.id ? 6 : 3
                                }
                                key={account.id}
                                onClick={() => setSelectedAccountId(account.id)}
                            >
                                <AccountColumnHeader
                                    account={account}
                                    accountHistoryId={
                                        account.account_history_id
                                    }
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                    <TableRow className="!hover:bg-muted">
                        {uniqueAccounts.map((account) => (
                            <Fragment key={account.id}>
                                {selectedAccountId === account.id && (
                                    <>
                                        <TableHead className="text-nowrap bg-background/60 align-middle">
                                            Reference #
                                        </TableHead>
                                        <TableHead className="align-middle text-nowrap">
                                            Entry Date
                                        </TableHead>
                                        <TableHead className="align-middle">
                                            Teller
                                        </TableHead>
                                    </>
                                )}
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
                                        'text-right opacity-80 w-[150px]',
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {normalizedLedgerData.map(
                        (ledgerEntry: TLoanLedgerNormalized) => {
                            return (
                                <TableRow
                                    className="border-none bg-secondary hover:bg-transparent"
                                    key={ledgerEntry.uid}
                                >
                                    {uniqueAccounts.map((account) => {
                                        const ledger =
                                            ledgerEntry[`${account.id}_ledger`]
                                        const credit = ledger?.credit || 0
                                        const debit = ledger?.debit || 0
                                        const balance = ledger?.balance || 0
                                        const currency =
                                            ledger?.account?.currency
                                        const entry_date = ledger?.entry_date

                                        const reference_number =
                                            ledger?.reference_number
                                        const teller = ledger?.employee_user

                                        return (
                                            <Fragment key={account.id}>
                                                {selectedAccountId ===
                                                    account.id && (
                                                    <>
                                                        <TableCell className="text-sm bg-background/60 text-nowrap">
                                                            {reference_number}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-nowrap">
                                                            {entry_date && (
                                                                <>
                                                                    {`${toReadableDate(entry_date)}`}
                                                                    <span className="text-xs text-muted-foreground block">
                                                                        {dateAgo(
                                                                            entry_date
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {ledgerEntry && (
                                                                <ImageNameDisplay
                                                                    name={
                                                                        teller?.full_name
                                                                    }
                                                                    src={
                                                                        teller
                                                                            ?.media
                                                                            ?.download_url
                                                                    }
                                                                />
                                                            )}
                                                        </TableCell>
                                                    </>
                                                )}
                                                <TableCell
                                                    className={cn(
                                                        'text-right  opacity-70 font-mono',
                                                        accountColorMap[
                                                            account.id
                                                        ]
                                                    )}
                                                >
                                                    <p
                                                        className={cn(
                                                            'opacity-100',
                                                            (debit as number) ===
                                                                0 &&
                                                                'opacity-25'
                                                        )}
                                                    >
                                                        {currencyFormat(
                                                            debit as number,
                                                            {
                                                                currency,
                                                                showSymbol:
                                                                    !!currency,
                                                            }
                                                        )}
                                                    </p>
                                                </TableCell>
                                                <TableCell
                                                    className={cn(
                                                        'text-right opacity-80 font-mono',
                                                        accountColorMap[
                                                            account.id
                                                        ]
                                                    )}
                                                >
                                                    <p
                                                        className={cn(
                                                            'opacity-100',
                                                            (credit as number) ===
                                                                0 &&
                                                                'opacity-25'
                                                        )}
                                                    >
                                                        {currencyFormat(
                                                            credit as number,
                                                            {
                                                                currency,
                                                                showSymbol:
                                                                    !!currency,
                                                            }
                                                        )}
                                                    </p>
                                                </TableCell>
                                                <TableCell
                                                    className={cn(
                                                        'text-right font-mono',
                                                        accountColorMap[
                                                            account.id
                                                        ]
                                                    )}
                                                >
                                                    {currencyFormat(
                                                        balance as number,
                                                        {
                                                            currency,
                                                            showSymbol:
                                                                !!currency,
                                                        }
                                                    )}
                                                </TableCell>
                                            </Fragment>
                                        )
                                    })}
                                </TableRow>
                            )
                        }
                    )}
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
            <div className="items-center justify-center flex gap-x-2">
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
                <Button
                    className="size-fit p-1"
                    onClick={() => accountViewModal.onOpenChange(true)}
                    size="icon"
                    variant="ghost"
                >
                    <EyeIcon className="size-3" />
                </Button>
            </div>
        </>
    )
}

export default LoanLedgerTable
