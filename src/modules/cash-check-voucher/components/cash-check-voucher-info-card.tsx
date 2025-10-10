import { cn, formatCurrency } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import TransactionUserInfoGrid from '@/modules/transaction/components/transaction-user-info-grid'

import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { CashCheckVoucherTagChip } from '../../cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import { ICashCheckVoucher } from '../cash-check-voucher.types'
import CashCheckVoucherStatusIndicator from './cash-check-status-indicator'
import CashCheckVoucherCreateUpdateFormModal from './forms/cash-check-voucher-create-udate-form-modal'

type TCashCheckVoucherCardProps = {
    cashCheckVoucher: ICashCheckVoucher
    className?: string
}

export const CashCheckVoucherCard = ({
    cashCheckVoucher,
    className,
}: TCashCheckVoucherCardProps) => {
    const cashCheckVoucherModalState = useModalState(false)
    return (
        <div
            className={cn(
                'group space-y-2 relative rounded-xl border-border py-2 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <CashCheckVoucherCreateUpdateFormModal
                {...cashCheckVoucherModalState}
                formProps={{
                    defaultValues: cashCheckVoucher,
                    readOnly: true,
                }}
            />
            <div className="flex justify-between items-start ">
                <p className="truncate text-lg font-bold text-foreground/95">
                    {cashCheckVoucher.name ||
                        cashCheckVoucher.cash_voucher_number ||
                        'CCV-Unknown'}
                </p>
                <div className="flex items-center gap-1">
                    <InfoTooltip content="View Cash Check Voucher Details">
                        <Button
                            onClick={() => {
                                cashCheckVoucherModalState.onOpenChange(true)
                            }}
                            size="sm"
                            variant="ghost"
                        >
                            <EyeIcon />
                        </Button>
                    </InfoTooltip>
                    <CashCheckVoucherStatusIndicator
                        cashCheckVoucher={cashCheckVoucher}
                        className="flex-shrink-0"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: 'Voucher No.',
                            value: cashCheckVoucher.cash_voucher_number || '-',
                        },
                        {
                            label: 'Pay To',
                            value: cashCheckVoucher.pay_to || '-',
                        },
                        {
                            label: 'Total Debit',
                            value: formatCurrency(
                                cashCheckVoucher.total_debit ?? 0
                            ),
                        },
                        {
                            label: 'Total Credit',
                            value: formatCurrency(
                                cashCheckVoucher.total_credit ?? 0
                            ),
                        },
                        {
                            label: 'Description',
                            value: cashCheckVoucher.description || '-',
                        },
                        {
                            label: 'Reference',
                            value: cashCheckVoucher.reference || '-',
                        },
                        {
                            label: 'Date',
                            value: cashCheckVoucher.date
                                ? new Date(
                                      cashCheckVoucher.date
                                  ).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  })
                                : '-',
                        },
                        {
                            label: 'Created By',
                            value: (
                                <div className="flex items-center gap-2 justify-start">
                                    {cashCheckVoucher.created_by?.media
                                        ?.download_url && (
                                        <ImageDisplay
                                            className="size-8 rounded-full"
                                            src={
                                                cashCheckVoucher.created_by
                                                    ?.media?.download_url
                                            }
                                        />
                                    )}
                                    <InfoTooltip
                                        content={`created by ${cashCheckVoucher.created_by?.full_name}`}
                                    >
                                        <div className="text-right max-w-[200px] shrink">
                                            <p className="truncate font-medium text-sm text-foreground/90">
                                                {
                                                    cashCheckVoucher.created_by
                                                        ?.full_name
                                                }
                                            </p>
                                            <p className="text-xs text-start text-muted-foreground/70 truncate">
                                                @
                                                {cashCheckVoucher.created_by
                                                    ?.user_name ?? '-'}{' '}
                                            </p>
                                        </div>
                                    </InfoTooltip>
                                </div>
                            ),
                        },
                    ]}
                    title="Cash Check Voucher Summary"
                />
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: 'Check No.',
                            value:
                                cashCheckVoucher.check_entry_check_number ||
                                '-',
                        },
                        {
                            label: 'Check Date',
                            value: cashCheckVoucher.check_entry_check_date
                                ? toReadableDate(
                                      cashCheckVoucher.check_entry_check_date
                                  )
                                : '-',
                        },
                        {
                            label: 'Check Amount',
                            value: formatCurrency(
                                cashCheckVoucher.check_entry_amount ?? 0
                            ),
                        },
                        {
                            label: 'Bank Account',
                            value:
                                cashCheckVoucher.check_entry_account?.name ||
                                '-',
                        },
                    ]}
                    title="Check Information"
                />
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: 'Print Count',
                            value:
                                cashCheckVoucher.print_count?.toString() || '0',
                        },
                        {
                            label: 'Printed Date',
                            value: cashCheckVoucher.printed_date
                                ? toReadableDate(cashCheckVoucher.printed_date)
                                : '-',
                        },
                        {
                            label: 'Printed By',
                            value:
                                cashCheckVoucher.printed_by?.full_name || '-',
                        },
                    ]}
                    title="Print Information"
                />
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: 'Approved By',
                            value:
                                cashCheckVoucher.approved_by?.full_name || '-',
                        },
                        {
                            label: 'Approved Date',
                            value: cashCheckVoucher.approved_date
                                ? toReadableDate(cashCheckVoucher.approved_date)
                                : '-',
                        },
                        {
                            label: 'Released By',
                            value:
                                cashCheckVoucher.released_by?.full_name || '-',
                        },
                        {
                            label: 'Released Date',
                            value: cashCheckVoucher.released_date
                                ? toReadableDate(cashCheckVoucher.released_date)
                                : '-',
                        },
                    ]}
                    title="Approval/Release Information"
                />
            </div>
            {cashCheckVoucher.cash_check_voucher_tags && (
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: '',
                            value: (
                                <div className="w-full flex flex-wrap gap-1 max-h-16 overflow-x-auto ">
                                    {cashCheckVoucher.cash_check_voucher_tags.map(
                                        (tag) => (
                                            <CashCheckVoucherTagChip
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
                {dateAgo(cashCheckVoucher.date)}
            </p>
        </div>
    )
}
