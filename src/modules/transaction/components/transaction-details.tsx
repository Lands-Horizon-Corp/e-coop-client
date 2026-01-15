import { toReadableDateTime } from '@/helpers/date-utils'
import { dateAgo } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency/currency.utils'
import { ITransaction } from '@/modules/transaction'

import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { TransactionCardItem } from './transaction-card-item'

type TransactionCardListItemProps = {
    item: ITransaction
    onClick?: () => void
}

export const TransactionDetails = ({
    item,
    onClick,
}: TransactionCardListItemProps) => {
    return (
        <div className="w-full space-x-2 cursor-pointer flex flex-row border items-center p-3 rounded-xl bg-muted/30">
            <div className="icon">
                <Sheet>
                    <SheetTrigger asChild className="text-xs">
                        <ImageDisplay
                            className="size-12 w-full rounded-xl"
                            src={item.member_profile?.media?.download_url}
                        />
                    </SheetTrigger>
                    <SheetContent className="min-w-full max-w-[400px] md:min-w-[500px] p-0 border m-5 pt-4 rounded-lg ">
                        <TransactionCardItem transaction={item} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="content grow">
                <p onClick={() => onClick?.()}>
                    {item.member_profile?.full_name || 'Unknown Member'}
                    {item.reference_number !== '' && (
                        <Button
                            className="text-xs rounded-sm hover:!bg-transparent text-muted-foreground "
                            size={'sm'}
                            variant="ghost"
                        >
                            - {item.reference_number}
                        </Button>
                    )}
                    <span className="italic text-xs">{item.source}</span>
                </p>
                <div className="flex">
                    <p className="text-[11px] text-muted-foreground">
                        {toReadableDateTime(item.created_at)}
                    </p>
                </div>
            </div>
            <div className="actions text-xs text-end">
                <p className="font-bold text-primary dark:text-primary">
                    {currencyFormat(item.amount, {
                        currency: item.currency,
                        showSymbol: !!item.currency,
                    })}
                </p>
                <p className="text-xs text-muted-foreground">
                    {dateAgo(item.created_at)}
                </p>
            </div>
        </div>
    )
}
export default TransactionDetails
