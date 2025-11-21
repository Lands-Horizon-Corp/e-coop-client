import { cn } from '@/helpers'
import {
    dateAgo,
    toReadableDate,
    toReadableDateTime,
} from '@/helpers/date-utils'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'

import {
    CakeIcon,
    CalendarNumberIcon,
    IdCardIcon,
    PhoneIcon,
    RefreshIcon,
    TicketIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextDisplay from '@/components/text-display'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    ILoanTransaction,
    ILoanTransactionSummary,
} from '../../loan-transaction.types'
import { LoanAmortizationModal } from '../loan-amortization'
import { LoanDetails } from './loan-details'

// Header component
const LoanLedgerHeader = ({
    className,
    loanTransaction,
    loanTransactionSummary,

    isRefetching,
    canRefresh,
    handleRefresh,
}: IClassProps & {
    loanTransaction: ILoanTransaction
    loanTransactionSummary?: ILoanTransactionSummary

    isProcessing?: boolean
    isRefetching?: boolean
    canRefresh?: boolean
    canProcess?: boolean
    handleProcess?: () => void
    handleRefresh?: () => void
}) => {
    return (
        <div className={cn('', className)}>
            <div className="flex gap-4 w-full">
                <div className="flex shrink-0 max-w-[600px] flex-col space-y-4">
                    <div className="flex flex-1 min-w-0 grow justify-between gap-4 bg-gradient-to-r from-primary/20 to-card dark:to-card/10 border border-input dark:border-input/60 rounded-xl p-4">
                        <div className="space-y-2 min-w-0 grow">
                            <div className="flex gap-x-2 min-w-0 items-center">
                                <div className="flex-shrink-0">
                                    <PreviewMediaWrapper
                                        media={
                                            loanTransaction.member_profile
                                                ?.media
                                        }
                                    >
                                        <ImageDisplay
                                            className="size-14 rounded-lg"
                                            // fallback={memberProfile.first_name.charAt(0) ?? '-'}
                                            fallback="S"
                                            src={
                                                loanTransaction.member_profile
                                                    ?.media?.download_url
                                            }
                                        />
                                    </PreviewMediaWrapper>
                                </div>
                                <div className="flex min-w-0 gap-x-2 flex-1">
                                    <p className="text-lg truncate flex-1">
                                        {loanTransaction.member_profile
                                            ?.full_name || '...'}
                                    </p>
                                    <GeneralStatusBadge generalStatus="verified" />
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="shrink-0">
                                    <h3 className="font-medium text-muted-foreground">
                                        Contact Number
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="400 size-3" />
                                        <span>
                                            {loanTransaction.member_profile
                                                ?.contact_number ? (
                                                <CopyWrapper>
                                                    {
                                                        loanTransaction
                                                            .member_profile
                                                            .contact_number
                                                    }
                                                </CopyWrapper>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    ...
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <h3 className="font-medium text-muted-foreground">
                                        Passbook Number
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <IdCardIcon className="size-3" />
                                        <span className="font-mono text-xs">
                                            {loanTransaction.member_profile
                                                ?.passbook ? (
                                                <CopyWrapper>
                                                    {
                                                        loanTransaction
                                                            .member_profile
                                                            .passbook
                                                    }
                                                </CopyWrapper>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    ...
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <h3 className="font-medium text-muted-foreground">
                                        Birthday
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <CakeIcon className="size-3" />
                                        <span>
                                            {loanTransaction.member_profile
                                                ?.birthdate ? (
                                                <CopyWrapper>
                                                    {toReadableDate(
                                                        loanTransaction
                                                            .member_profile
                                                            .birthdate
                                                    )}
                                                </CopyWrapper>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    ...
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <h3 className="font-medium text-muted-foreground">
                                        Member Type
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="size-3" />
                                        <span>
                                            {loanTransaction.member_profile
                                                ?.member_type?.name ? (
                                                <CopyWrapper>
                                                    {
                                                        loanTransaction
                                                            .member_profile
                                                            .member_type.name
                                                    }
                                                </CopyWrapper>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    ...
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-popover border h-full border-input dark:border-input/60 flex-1 px-4 py-2 rounded-xl">
                            <p className="text-xs text-muted-foreground">
                                <TicketIcon className="inline size-4 mr-1" />
                                Check Voucher
                            </p>
                            <TextDisplay
                                noValueText="No Voucher Set..."
                                withCopy
                            >
                                {loanTransaction.check_number}
                            </TextDisplay>
                            <span className="text-xs text-muted-foreground block">
                                Voucher Set for this Loan
                            </span>
                        </div>
                        <div className="bg-popover border h-full border-input dark:border-input/60 flex-1 px-4 py-2 rounded-xl">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    <CalendarNumberIcon className="size-4 inline mr-1" />
                                    Released
                                </p>
                            </div>
                            <TextDisplay noValueText="no voucher number set">
                                {loanTransaction.released_date
                                    ? `${dateAgo(loanTransaction.released_date)}`
                                    : undefined}
                            </TextDisplay>
                            <span className="text-xs text-muted-foreground block">
                                {loanTransaction.released_date
                                    ? `${toReadableDateTime(loanTransaction.released_date)}`
                                    : undefined}
                            </span>
                        </div>
                    </div>
                    <div className="bg-popover sticky top-5 right-5 border border-input dark:border-input/60 rounded-xl p-3 space-y-2">
                        <div className="flex justify-start gap-2  items-center">
                            <Button
                                className="flex-1"
                                disabled={!canRefresh}
                                hoverVariant="primary"
                                onClick={handleRefresh}
                                size="sm"
                                variant="outline"
                            >
                                {isRefetching ? (
                                    <LoadingSpinner className="size-3" />
                                ) : (
                                    <RefreshIcon />
                                )}{' '}
                                Refresh
                            </Button>
                            <AmortSection
                                loanTransactionId={loanTransaction.id}
                            />
                        </div>
                    </div>
                </div>
                <LoanDetails
                    className="flex-1"
                    loanTransaction={loanTransaction}
                    loanTransactionSummary={loanTransactionSummary}
                />
            </div>
        </div>
    )
}

const AmortSection = ({
    loanTransactionId,
}: {
    loanTransactionId: TEntityId
}) => {
    const loanAmortizationModalState = useModalState()
    return (
        <>
            <LoanAmortizationModal
                {...loanAmortizationModalState}
                loanTransactionId={loanTransactionId}
            />
            <Button
                className="items-center flex-1"
                hoverVariant="primary"
                onClick={() => loanAmortizationModalState.onOpenChange(true)}
                size="sm"
                variant="outline"
            >
                <CalendarNumberIcon className="inline size-3" /> View Amort.
            </Button>
        </>
    )
}

export default LoanLedgerHeader
