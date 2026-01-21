import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { currencyFormat } from '@/modules/currency'
import { MemberOverallInfoModal } from '@/modules/member-profile/components/member-infos/view-member-info'

import {
    BuildingIcon,
    CalendarIcon,
    ClockIcon,
    CreditCardIcon,
    ErrorIcon,
    HashIcon,
    LandmarkIcon,
    PencilFillIcon,
    PrinterIcon,
    ReloadIcon,
    RenderIcon,
    TextFileFillIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    UserIcon,
    WalletIcon,
    WarningCircleIcon,
    WeightScaleIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { useGetGeneralLedgerById } from '../general-ledger.service'
import { IGeneralLedger } from '../general-ledger.types'
import { GeneralLedgerSourceBadge } from './general-ledger-source-badge'

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
        refetch,
        error: fetchError,
    } = useGetGeneralLedgerById({
        id: ledgerId,
        options: {
            initialData: defaultLedgerValue,
            enabled: !!ledgerId,
        },
    })

    const viewAccountModal = useModalState()
    const viewMemberModal = useModalState()

    const error =
        serverRequestErrExtractor({ error: fetchError }) || !ledgerId
            ? 'No provided ledger to view'
            : undefined

    if (isPending) {
        return <LoadingSkeleton />
    }

    if (!entry && error) {
        return <ErrorState error={error} onRetry={refetch} />
    }

    if (!entry) {
        return <EmptyState />
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                            <WalletIcon className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold leading-tight">
                                Ledger Entry
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                General Ledger Record
                            </p>
                        </div>
                    </div>
                    <GeneralLedgerSourceBadge source={entry.source} />
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <CopyWrapper
                        copyMsg="Ledger ID copied"
                        textToCopy={entry.id}
                    >
                        <span className="font-mono">{entry.id}</span>
                    </CopyWrapper>

                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <PrinterIcon className="size-3" />
                        Printed {entry.print_number}
                    </span>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
                {/* Debit Card */}
                <div className="relative overflow-hidden rounded-xl border border-rose-200/50 bg-gradient-to-br from-rose-50 to-rose-100/50 p-3 dark:border-rose-900/30 dark:from-rose-950/30 dark:to-rose-900/20">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                            <TrendingDownIcon className="size-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Debit
                            </span>
                        </div>
                        <p className="text-base font-bold tabular-nums tracking-tight">
                            {currencyFormat(entry.debit, {
                                currency: entry.currency,
                                showSymbol: true,
                            })}
                        </p>
                    </div>
                </div>

                {/* Credit Card */}
                <div className="relative overflow-hidden rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-emerald-900/20">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <TrendingUpIcon className="size-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Credit
                            </span>
                        </div>
                        <p className="text-base font-bold tabular-nums tracking-tight">
                            {currencyFormat(entry.credit, {
                                currency: entry.currency,
                                showSymbol: true,
                            })}
                        </p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-3">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-primary">
                            <WeightScaleIcon className="size-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Balance
                            </span>
                        </div>
                        <p className="text-base font-bold tabular-nums tracking-tight">
                            {currencyFormat(entry.balance, {
                                currency: entry.currency,
                                showSymbol: true,
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Currency Badge */}
            {entry.currency && (
                <div className="flex items-center gap-2">
                    <Badge className="gap-1.5 font-normal" variant="outline">
                        <LandmarkIcon className="size-3" />
                        {entry.currency.name} ({entry.currency.country})
                    </Badge>
                </div>
            )}

            <Separator />

            {/* Entry Details */}
            <LedgerDetailSection
                icon={<CalendarIcon className="size-4" />}
                title="Entry Details"
            >
                <DetailRow
                    label="Entry Date"
                    value={`${toReadableDateTime(entry.entry_date)} - ${dateAgo(entry.entry_date)}`}
                />
                {entry.reference_number && (
                    <DetailRow
                        label="Reference No."
                        value={
                            <CopyWrapper textToCopy={entry.reference_number}>
                                <span className="font-mono text-xs">
                                    {entry.reference_number}
                                </span>
                            </CopyWrapper>
                        }
                    />
                )}
                {entry.transaction_reference_number && (
                    <DetailRow
                        label="Transaction Ref"
                        value={
                            <CopyWrapper
                                textToCopy={entry.transaction_reference_number}
                            >
                                <span className="font-mono text-xs">
                                    {entry.transaction_reference_number}
                                </span>
                            </CopyWrapper>
                        }
                    />
                )}
                {entry.bank_reference_number && (
                    <DetailRow
                        label="Bank Reference"
                        value={
                            <CopyWrapper
                                textToCopy={entry.bank_reference_number}
                            >
                                <span className="font-mono text-xs">
                                    {entry.bank_reference_number}
                                </span>
                            </CopyWrapper>
                        }
                    />
                )}
                {entry.journal_voucher_id && (
                    <DetailRow
                        label="Journal Voucher"
                        value={
                            <CopyWrapper textToCopy={entry.journal_voucher_id}>
                                <span className="font-mono text-xs">
                                    {entry.journal_voucher_id}
                                </span>
                            </CopyWrapper>
                        }
                    />
                )}
            </LedgerDetailSection>

            {entry.description && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<TextFileFillIcon className="size-4" />}
                        title="Description"
                    >
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {entry.description}
                        </p>
                    </LedgerDetailSection>
                </>
            )}

            {entry.account && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<HashIcon className="size-4" />}
                        title="Account"
                    >
                        <AccountViewerModal
                            {...viewAccountModal}
                            accountViewerProps={{
                                accountId: entry.account_id,
                            }}
                        />
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className="font-medium cursor-pointer"
                                        onClick={() =>
                                            viewAccountModal.onOpenChange(true)
                                        }
                                    >
                                        {entry.account.icon && (
                                            <RenderIcon
                                                className="inline mr-1"
                                                icon={entry.account.icon}
                                            />
                                        )}
                                        {entry.account.name}
                                    </p>
                                    {entry.account.index && (
                                        <p className="text-xs text-muted-foreground">
                                            Index: {entry.account.index}
                                        </p>
                                    )}
                                </div>
                                <CopyWrapper
                                    copyMsg="Account ID copied"
                                    textToCopy={entry.account_id}
                                >
                                    <Badge
                                        className="font-mono text-[10px]"
                                        variant="secondary"
                                    >
                                        {entry.account_id.slice(0, 12)}...
                                    </Badge>
                                </CopyWrapper>
                            </div>
                        </div>
                    </LedgerDetailSection>
                </>
            )}

            {(entry.member_profile || entry.member_joint_account) && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<UserIcon className="size-4" />}
                        title="Member"
                    >
                        {entry.member_profile && (
                            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                                <ImageDisplay
                                    src={
                                        entry.member_profile.media?.download_url
                                    }
                                />
                                <MemberOverallInfoModal
                                    {...viewMemberModal}
                                    overallInfoProps={{
                                        memberProfileId:
                                            entry.member_profile_id,
                                        defaultMemberProfile:
                                            entry.member_profile,
                                    }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p
                                        className="font-medium cursor-pointer"
                                        onClick={() =>
                                            viewMemberModal.onOpenChange(true)
                                        }
                                    >
                                        {entry.member_profile.full_name ||
                                            'Unknown Member'}
                                    </p>
                                    {entry.member_profile.passbook && (
                                        <p className="text-xs text-muted-foreground">
                                            {entry.member_profile.passbook}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {entry.member_joint_account && (
                            <DetailRow
                                label="Joint Account"
                                value={entry.member_joint_account.full_name}
                            />
                        )}
                    </LedgerDetailSection>
                </>
            )}

            {entry.employee_user && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<UserIcon className="size-4" />}
                        title="Employee"
                    >
                        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                            <ImageDisplay
                                src={entry.employee_user.media?.download_url}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                    {entry.employee_user.full_name ||
                                        'Unknown Employee'}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {entry.employee_user.email}
                                </p>
                            </div>
                        </div>
                    </LedgerDetailSection>
                </>
            )}

            {(entry.payment_type || entry.bank) && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<CreditCardIcon className="size-4" />}
                        title="Payment Details"
                    >
                        {entry.payment_type && (
                            <DetailRow
                                label="Payment Type"
                                value={entry.payment_type.name}
                            />
                        )}
                        {entry.type_of_payment_type && (
                            <DetailRow
                                label="Payment Method"
                                value={
                                    <Badge
                                        className="capitalize"
                                        variant="outline"
                                    >
                                        {entry.type_of_payment_type}
                                    </Badge>
                                }
                            />
                        )}
                        {entry.bank && (
                            <DetailRow label="Bank" value={entry.bank.name} />
                        )}
                    </LedgerDetailSection>
                </>
            )}

            {entry.transaction && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<HashIcon className="size-4" />}
                        title="Transaction"
                    >
                        <DetailRow
                            label="Transaction ID"
                            value={
                                <CopyWrapper textToCopy={entry.transaction_id}>
                                    <span className="font-mono text-xs">
                                        {entry.transaction_id.slice(0, 16)}...
                                    </span>
                                </CopyWrapper>
                            }
                        />
                        {entry.transaction.reference_number && (
                            <DetailRow
                                label="Reference"
                                value={entry.transaction.reference_number}
                            />
                        )}
                        {entry.transaction_batch && (
                            <DetailRow
                                label="Batch"
                                value={entry.transaction_batch.id}
                            />
                        )}
                    </LedgerDetailSection>
                </>
            )}

            {(entry.organization || entry.branch) && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<BuildingIcon className="size-4" />}
                        title="Organization"
                    >
                        {entry.organization && (
                            <DetailRow
                                label="Organization"
                                value={entry.organization.name}
                            />
                        )}
                        {entry.branch && (
                            <DetailRow
                                label="Branch"
                                value={entry.branch.name}
                            />
                        )}
                    </LedgerDetailSection>
                </>
            )}

            {(entry.signature_media || entry.proof_of_payment_media) && (
                <>
                    <Separator />
                    <LedgerDetailSection
                        icon={<PencilFillIcon className="size-4" />}
                        title="Attachments"
                    >
                        <div className="space-y-3">
                            {entry.signature_media && (
                                <ImageDisplay
                                    src={entry.signature_media.download_url}
                                />
                            )}
                            {entry.proof_of_payment_media && (
                                <ImageDisplay
                                    src={
                                        entry.proof_of_payment_media
                                            .download_url
                                    }
                                />
                            )}
                        </div>
                    </LedgerDetailSection>
                </>
            )}

            <Separator />

            {/* Activity Timeline */}
            <LedgerDetailSection
                icon={<ClockIcon className="size-4" />}
                title="Activity"
            >
                <div className="relative space-y-4 pl-4 before:absolute before:left-[3px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                    {/* Created */}
                    <div className="relative">
                        <div className="absolute -left-4 top-1.5 size-2 rounded-full bg-emerald-500 ring-4 ring-background" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium">Created</p>
                            <p className="text-xs text-muted-foreground">
                                {toReadableDateTime(entry.created_at)}{' '}
                                <span className="text-muted-foreground/70">
                                    • {dateAgo(entry.created_at)}
                                </span>
                            </p>
                            {entry.created_by && (
                                <p className="text-xs text-muted-foreground/70">
                                    by{' '}
                                    {entry.created_by.full_name ||
                                        entry.created_by.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Updated */}
                    {entry.updated_at &&
                        entry.updated_at !== entry.created_at && (
                            <div className="relative">
                                <div className="absolute -left-4 top-1.5 size-2 rounded-full bg-blue-500 ring-4 ring-background" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">
                                        Updated
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {toReadableDateTime(entry.updated_at)}{' '}
                                        <span className="text-muted-foreground/70">
                                            • {dateAgo(entry.updated_at)}
                                        </span>
                                    </p>
                                    {entry.updated_by && (
                                        <p className="text-xs text-muted-foreground/70">
                                            by{' '}
                                            {entry.updated_by.full_name ||
                                                entry.updated_by.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Deleted */}
                    {entry.deleted_at && (
                        <div className="relative">
                            <div className="absolute -left-4 top-1.5 size-2 rounded-full bg-destructive ring-4 ring-background" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-destructive">
                                    Deleted
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {toReadableDateTime(entry.deleted_at)}{' '}
                                    <span className="text-muted-foreground/70">
                                        • {dateAgo(entry.deleted_at)}
                                    </span>
                                </p>
                                {entry.deleted_by && (
                                    <p className="text-xs text-muted-foreground/70">
                                        by{' '}
                                        {entry.deleted_by.full_name ||
                                            entry.deleted_by.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </LedgerDetailSection>
        </div>
    )
}

interface LedgerDetailSectionProps {
    title: string
    icon?: ReactNode
    children: ReactNode
    className?: string
}

export const LedgerDetailSection = ({
    title,
    icon,
    children,
    className,
}: LedgerDetailSectionProps) => {
    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {title}
                </h4>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    )
}

interface DetailRowProps {
    label: string
    value: ReactNode
    className?: string
}

export const DetailRow = ({ label, value, className }: DetailRowProps) => {
    if (!value) return null

    return (
        <div
            className={cn('flex items-start justify-between gap-4', className)}
        >
            <span className="text-xs text-muted-foreground shrink-0">
                {label}
            </span>
            <span className="text-xs text-right font-medium">{value}</span>
        </div>
    )
}

export default LedgerDetail

interface GeneralLedgerSheetProps extends Pick<
    IModalProps,
    'open' | 'onOpenChange'
> {
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
