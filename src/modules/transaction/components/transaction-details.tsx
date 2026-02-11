import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency/currency.utils'
import { ITransaction } from '@/modules/transaction'

import ImageDisplay from '@/components/image-display'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { TransactionCardItem } from './transaction-card-item'

type TransactionCardListItemProps = {
    item: ITransaction
    onClick?: () => void
}

const TransactionDetails = ({
    item,
    onClick,
}: TransactionCardListItemProps) => {
    return (
        <div
            className={cn(
                'w-full min-w-0 max-w-full cursor-pointer flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors border-l-[3px]'
            )}
            onClick={() => onClick?.()}
        >
            {/* LEFT ICON / AVATAR */}
            <Sheet>
                <SheetTrigger asChild>
                    <ImageDisplay
                        className="rounded-xl size-11 flex items-center justify-center shrink-0"
                        src={item.member_profile?.media?.download_url}
                    />
                </SheetTrigger>

                <SheetContent className="min-w-full max-w-[400px] md:min-w-[500px] overflow-y-auto ecoop-scroll p-0 border m-5 pt-4 rounded-lg">
                    <TransactionCardItem transaction={item} />
                </SheetContent>
            </Sheet>

            {/* CENTER CONTENT */}
            <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm font-medium truncate">
                    {item.member_profile?.full_name || 'Unknown Member'}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {item.reference_number && (
                        <span className="text-[10px] text-muted-foreground">
                            #{item.reference_number}
                        </span>
                    )}
                </div>

                <p className="text-[11px] text-muted-foreground">
                    {toReadableDateTime(item.created_at)}
                </p>
            </div>

            {/* RIGHT AMOUNT */}
            <div className="shrink-0 text-right space-y-0.5">
                <div className="flex items-center justify-end gap-1">
                    <p className={cn('text-sm font-semibold tabular-nums')}>
                        {currencyFormat(item.amount, {
                            currency: item.currency,
                            showSymbol: !!item.currency,
                        })}
                    </p>
                </div>

                <p className="text-[11px] text-muted-foreground">
                    {dateAgo(item.created_at)}
                </p>
            </div>
        </div>
    )
}

export default TransactionDetails
