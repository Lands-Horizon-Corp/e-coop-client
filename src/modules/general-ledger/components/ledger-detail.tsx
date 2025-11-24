import {
    dateAgo,
    toReadableDate,
    toReadableDateTime,
} from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { currencyFormat } from '@/modules/currency'

import {
    ErrorIcon,
    MoneyCheckIcon,
    ReloadIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    UserIcon,
    WarningCircleIcon,
} from '@/components/icons'
import { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { TEntityId } from '@/types'

import { useGetGeneralLedgerById } from '../general-ledger.service'
import { IGeneralLedger } from '../general-ledger.types'

interface LedgerDetailProps {
    ledgerId: TEntityId
    defaultLedgerValue?: IGeneralLedger
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-20" />
        </div>

        <div className="py-4 space-y-6">
            {/* Financial Summary Skeleton */}
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                    <div className="space-y-2" key={i}>
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                ))}
            </div>

            <Separator />

            {/* Entry Details Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div className="flex justify-between items-center" key={i}>
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>

            <Separator />

            {/* Activity Skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-3 w-16" />
                {[1, 2].map((i) => (
                    <div className="flex justify-between items-start" key={i}>
                        <Skeleton className="h-3 w-20" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

const ErrorState = ({
    error,
    onRetry,
}: {
    error: string
    onRetry: () => void
}) => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <ErrorIcon className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
            Failed to Load Entry
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {error || 'An error occurred while fetching the ledger entry.'}
        </p>
        <Button className="gap-2" onClick={onRetry} size="sm" variant="outline">
            <ReloadIcon className="h-4 w-4" />
            Try Again
        </Button>
    </div>
)

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
            <WarningCircleIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
            No Entry Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
            The requested ledger entry could not be found or does not exist.
        </p>
    </div>
)

export const LedgerDetail = ({
    ledgerId,
    defaultLedgerValue,
}: LedgerDetailProps) => {
    const {
        data: entry,
        isPending,
        isRefetching,
        refetch,
        error: fetchError,
    } = useGetGeneralLedgerById({
        id: ledgerId,
        options: {
            initialData: defaultLedgerValue,
            enabled: !!ledgerId,
        },
    })

    const error =
        serverRequestErrExtractor({ error: fetchError }) || !ledgerId
            ? 'No provided ledger to view'
            : undefined

    if (isPending || isRefetching) {
        return <LoadingSkeleton />
    }

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />
    }

    if (!entry) {
        return <EmptyState />
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <p className="">
                        <MoneyCheckIcon className="text-primary inline" />{' '}
                        Ledger Entry
                    </p>

                    <p className="bg-accent text-xs text-accent-foreground px-1 py-0.5 rounded-md">
                        {' '}
                        <span>Source: </span>
                        {entry.source.toUpperCase()}
                    </p>
                </div>
                <div className="text-xs text-muted-foreground/70">
                    <CopyWrapper
                        copyMsg="Copied Ledger ID"
                        textToCopy={entry.id}
                    >
                        ID:
                        <span className="inline ml-1 text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                            {entry.id}
                        </span>
                    </CopyWrapper>
                </div>
            </div>

            <div className="w-full py-4 space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/10 p-4 backdrop-blur-sm transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-500/5 blur-2xl" />
                        <div className="relative space-y-2">
                            <div className="flex items-center gap-1.5 dark:text-rose-400/70 text-rose-600">
                                <TrendingDownIcon className="size-3.5" />
                                <span className="text-xs font-medium">
                                    Debit
                                </span>
                            </div>
                            <p className="text-lg text-right font-bold tracking-tight text-foreground">
                                {currencyFormat(entry.debit, {
                                    currency: entry.currency,
                                    showSymbol: !!entry.currency,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 p-4 backdrop-blur-sm transition-all hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/5 blur-2xl" />
                        <div className="relative space-y-2">
                            <div className="flex items-center gap-1.5 text-green-600/70">
                                <TrendingUpIcon className="size-3.5" />
                                <span className="text-xs font-medium">
                                    Credit
                                </span>
                            </div>
                            <p className="text-lg text-right font-bold tracking-tight text-foreground">
                                {currencyFormat(entry.credit, {
                                    currency: entry.currency,
                                    showSymbol: !!entry.currency,
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4 text-sm">
                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            Entry Date
                        </p>
                        <p className="text-xs">
                            {toReadableDate(entry.entry_date)}
                        </p>
                    </div>

                    {entry.reference_number && (
                        <div className="flex items-center w-full justify-between">
                            <p className="text-muted-foreground text-xs">
                                Reference Number
                            </p>
                            <div className="text-xs text-muted-foreground/70">
                                <CopyWrapper
                                    textToCopy={entry.reference_number}
                                >
                                    <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                        {entry.reference_number}
                                    </span>
                                </CopyWrapper>
                            </div>
                        </div>
                    )}

                    {entry.transaction_reference_number && (
                        <div className="flex items-center w-full justify-between">
                            <p className="text-muted-foreground text-xs">
                                Transaction Ref
                            </p>
                            <div className="text-xs text-muted-foreground/70">
                                <CopyWrapper
                                    textToCopy={
                                        entry.transaction_reference_number
                                    }
                                >
                                    <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                        {entry.transaction_reference_number}
                                    </span>
                                </CopyWrapper>
                            </div>
                        </div>
                    )}

                    {entry.bank_reference_number && (
                        <div className="flex items-center w-full justify-between">
                            <p className="text-muted-foreground text-xs">
                                Bank Reference
                            </p>
                            <div className="text-xs text-muted-foreground/70">
                                <CopyWrapper
                                    textToCopy={entry.bank_reference_number}
                                >
                                    <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                        {entry.bank_reference_number}
                                    </span>
                                </CopyWrapper>
                            </div>
                        </div>
                    )}

                    {entry.description && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground/70">
                                Description
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {entry.description}
                            </p>
                        </div>
                    )}
                </div>

                {entry.account && (
                    <>
                        <Separator />
                        <div className="space-y-4 text-sm">
                            <p className="text-xs font-semibold text-muted-foreground/70">
                                Account
                            </p>
                            <div className="flex items-center w-full justify-between">
                                <p className="text-muted-foreground text-xs">
                                    Account Name
                                </p>
                                <p className="text-xs">
                                    {entry.account.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {(entry.payment_type || entry.bank) && (
                    <>
                        <Separator />
                        <div className="space-y-4 text-sm">
                            <p className="text-xs font-semibold text-muted-foreground/70">
                                Payment
                            </p>
                            {entry.payment_type && (
                                <div className="flex items-center w-full justify-between">
                                    <p className="text-muted-foreground text-xs">
                                        Payment Type
                                    </p>
                                    <p className="text-xs">
                                        {entry.payment_type.name || 'N/A'}
                                    </p>
                                </div>
                            )}
                            {entry.bank && (
                                <div className="flex items-center w-full justify-between">
                                    <p className="text-muted-foreground text-xs">
                                        Bank
                                    </p>
                                    <p className="text-xs">
                                        {entry.bank.name || 'N/A'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {(entry.organization || entry.branch) && (
                    <>
                        <Separator />
                        <div className="space-y-4 text-sm">
                            <p className="text-xs font-semibold text-muted-foreground/70">
                                Organization
                            </p>
                            {entry.organization && (
                                <div className="flex items-center w-full justify-between">
                                    <p className="text-muted-foreground text-xs">
                                        Organization
                                    </p>
                                    <p className="text-xs">
                                        {entry.organization.name || 'N/A'}
                                    </p>
                                </div>
                            )}
                            {entry.branch && (
                                <div className="flex items-center w-full justify-between">
                                    <p className="text-muted-foreground text-xs">
                                        Branch
                                    </p>
                                    <p className="text-xs">
                                        {entry.branch.name || 'N/A'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <Separator />

                <div className="space-y-4 text-sm">
                    <p className="text-xs font-semibold text-muted-foreground/70">
                        Activity
                    </p>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">Created</p>
                        <div className="text-right">
                            <p className="text-xs">
                                {toReadableDateTime(
                                    entry.created_at,
                                    "MMM dd yyyy '•' hh:mm a"
                                )}{' '}
                                <span className="text-muted-foreground">
                                    {dateAgo(entry.created_at)}
                                </span>
                            </p>
                            {entry.created_by && (
                                <p className="text-xs text-muted-foreground/70 mt-0.5">
                                    by{' '}
                                    {entry.created_by.full_name ||
                                        entry.created_by.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {entry.updated_at && (
                        <div className="flex items-center w-full justify-between">
                            <p className="text-muted-foreground text-xs">
                                Updated
                            </p>
                            <div className="text-right">
                                <p className="text-xs">
                                    {toReadableDateTime(
                                        entry.updated_at,
                                        "MMM dd yyyy '•' hh:mm a"
                                    )}{' '}
                                    <span className="text-muted-foreground">
                                        {dateAgo(entry.created_at)}
                                    </span>
                                </p>
                                {entry.updated_by && (
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        by{'-'}
                                        {entry.updated_by?.full_name ||
                                            entry.updated_by.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {entry.deleted_at && (
                        <div className="flex items-center w-full justify-between">
                            <p className="text-muted-foreground text-xs">
                                Deleted
                            </p>
                            <div className="text-right">
                                <p className="text-xs text-destructive">
                                    {toReadableDateTime(
                                        entry.deleted_at,
                                        "MMM dd yyyy '•' hh:mm a"
                                    )}{' '}
                                    <span className="text-muted-foreground">
                                        {dateAgo(entry.deleted_at)}
                                    </span>
                                </p>
                                {entry.deleted_by && (
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                                        by{' '}
                                        {entry.deleted_by?.full_name ||
                                            entry.deleted_by.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {entry.created_by && (
                    <>
                        <Separator />
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-muted p-2">
                                <UserIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-semibold text-muted-foreground/80">
                                    Created By
                                </p>
                                <p>
                                    {entry.created_by.full_name ||
                                        entry.created_by.email ||
                                        'Unknown User'}
                                </p>
                                <div className="text-xs text-muted-foreground/70">
                                    <CopyWrapper
                                        copyMsg="Copied User ID"
                                        textToCopy={entry.created_by.id}
                                    >
                                        <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                            Copy User ID
                                        </span>
                                    </CopyWrapper>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default LedgerDetail

interface GeneralLedgerSheetProps
    extends Pick<IModalProps, 'open' | 'onOpenChange'> {
    ledgerId: TEntityId
    defaultLedgerValue?: IGeneralLedger
}

export const GeneralLedgerViewSheet = ({
    ledgerId,
    defaultLedgerValue,
    onOpenChange,
    open,
}: GeneralLedgerSheetProps) => {
    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent
                className="!max-w-lg bg-transparent shadow-none p-2 focus:outline-none border-none"
                side="right"
            >
                <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                    <LedgerDetail
                        defaultLedgerValue={defaultLedgerValue}
                        ledgerId={ledgerId}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
