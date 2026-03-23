import { currencyFormat } from '@/modules/currency'

import { useCheckWarehousingSummary } from '../check-warehousing.service'

interface Props {
    className?: string
}

export const CheckWarehousingSummaryBar = ({ className }: Props) => {
    const { data, isLoading } = useCheckWarehousingSummary()

    return (
        <div
            className={`w-full border  bg-linear-to-tr from-card/20 to-primary/10 rounded-lg overflow-hidden shadow-sm ${className}`}
        >
            <div className="px-4 py-2 text-sm flex justify-between text-muted-foreground">
                <span>
                    Total Amount:{' '}
                    <strong>{currencyFormat(data?.total_amount || 0)}</strong>
                </span>
                <span>
                    Cleared Amount:{' '}
                    <strong>
                        {isLoading
                            ? '...'
                            : currencyFormat(data?.total_cleared_amount || 0)}
                    </strong>
                </span>
                <span>
                    Checks:{' '}
                    <strong>
                        {data?.total_checks_cleared_count || 0}/
                        {data?.total_checks_count || 0}
                    </strong>
                </span>
            </div>
        </div>
    )
}
