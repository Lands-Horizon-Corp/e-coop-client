import { cn, formatCurrency } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { JournalVoucherTagChip } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import TransactionUserInfoGrid from '@/modules/transaction/components/transaction-user-info-grid'

import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { IJournalVoucher } from '../journal-voucher.types'
import JournalVoucherCreateUpdateFormModal from './forms/journal-voucher-create-update-modal'
import JournalVoucherStatusIndicator from './journal-voucher-status-indicator'

type TJournalVoucherCardProps = {
    journalVoucher: IJournalVoucher
    className?: string
}
export const JournalVoucherCard = ({
    journalVoucher,
    className,
}: TJournalVoucherCardProps) => {
    const journalVoucherModalState = useModalState(false)
    return (
        <div
            className={cn(
                'group space-y-2 relative rounded-xl border-border py-2 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <JournalVoucherCreateUpdateFormModal
                {...journalVoucherModalState}
                formProps={{
                    defaultValues: journalVoucher,
                    readOnly: true,
                }}
            />
            <div className="flex justify-between items-start ">
                <p className="truncate text-lg font-bold text-foreground/95">
                    {journalVoucher.name ||
                        journalVoucher.cash_voucher_number ||
                        'JV-Unknown'}
                </p>
                <div className="flex items-center gap-1">
                    <InfoTooltip content="View Journal Voucher Details">
                        <Button
                            onClick={() => {
                                journalVoucherModalState.onOpenChange(true)
                            }}
                            size="sm"
                            variant="ghost"
                        >
                            <EyeIcon />
                        </Button>
                    </InfoTooltip>
                    <JournalVoucherStatusIndicator
                        className="flex-shrink-0"
                        journalVoucher={journalVoucher}
                    />
                </div>
            </div>
            <TransactionUserInfoGrid
                data={[
                    {
                        label: 'Total Debit',
                        value: formatCurrency(journalVoucher.total_debit),
                    },
                    {
                        label: 'Total Credit',
                        value: formatCurrency(journalVoucher.total_credit),
                    },
                    {
                        label: 'Description',
                        value: journalVoucher.description || '-',
                    },
                    {
                        label: 'Print Number',
                        value: journalVoucher.print_number
                            ? journalVoucher.print_number.toString()
                            : '',
                    },
                    {
                        label: 'Reference',
                        value: journalVoucher.reference || '-',
                    },
                    {
                        label: 'Date',
                        value: journalVoucher.date
                            ? new Date(journalVoucher.date).toLocaleDateString(
                                  undefined,
                                  {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  }
                              )
                            : '-',
                    },
                    {
                        label: 'Created By',
                        value: (
                            <div className="flex items-center gap-2 justify-start">
                                {journalVoucher.created_by?.media
                                    ?.download_url && (
                                    <ImageDisplay
                                        className="size-8 rounded-full"
                                        src={
                                            journalVoucher?.created_by?.media
                                                ?.download_url
                                        }
                                    />
                                )}
                                <InfoTooltip
                                    content={`created by ${journalVoucher.created_by?.full_name}`}
                                >
                                    <div className="text-right max-w-[200px] shrink">
                                        <p className="truncate font-medium text-sm text-foreground/90">
                                            {
                                                journalVoucher.created_by
                                                    ?.full_name
                                            }
                                        </p>
                                        <p className="text-xs text-start text-muted-foreground/70 truncate">
                                            @
                                            {journalVoucher.created_by
                                                ?.user_name ?? '-'}{' '}
                                        </p>
                                    </div>
                                </InfoTooltip>
                            </div>
                        ),
                    },
                    {
                        label: 'Posted By',
                        value: journalVoucher.posted_by?.full_name || '-',
                    },
                ]}
                title="Journal Voucher Summary"
            />
            <TransactionUserInfoGrid
                data={[
                    {
                        label: 'Print Number',
                        value: journalVoucher.print_number
                            ? journalVoucher.print_number.toString()
                            : '',
                    },
                    {
                        label: 'Print Date',
                        value: journalVoucher.printed_date
                            ? toReadableDate(journalVoucher.printed_date)
                            : '-',
                    },
                ]}
                title="Print Information"
            />
            {journalVoucher.journal_voucher_tags && (
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: '',
                            value: (
                                <div className="w-full flex flex-wrap gap-1 max-h-16 overflow-x-auto ">
                                    {journalVoucher?.journal_voucher_tags?.map(
                                        (tag) => (
                                            <JournalVoucherTagChip
                                                key={tag.id}
                                                tag={tag}
                                            />
                                        )
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    title="Tags"
                />
            )}
            <p className="text-xs text-end text-muted-foreground/70 truncate">
                {dateAgo(journalVoucher.date)}
            </p>
        </div>
    )
}
