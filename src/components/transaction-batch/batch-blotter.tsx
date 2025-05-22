import { EyeNoneIcon } from '../icons'

import {
    IClassProps,
    ITransactionBatch,
    ITransactionBatchMinimal,
} from '@/types'
import { Button } from '@/components/ui/button'
import { useTransactionBatchRequestBlotterView } from '@/hooks/api-hooks/use-transaction-batch'
import LoadingSpinner from '../spinners/loading-spinner'
import useActionSecurityStore from '@/store/action-security-store'
import { toReadableDate } from '@/utils'

interface Props extends IClassProps {
    transaction_batch: ITransactionBatch
    onBatchUpdate?: (data: ITransactionBatch | ITransactionBatchMinimal) => void
}

const BatchBlotter = ({ transaction_batch, onBatchUpdate }: Props) => {
    const { mutate: requestBlotterView, isPending: isRequestingView } =
        useTransactionBatchRequestBlotterView({ onSuccess: onBatchUpdate })

    const { onOpenSecurityAction } = useActionSecurityStore()

    return (
        <div className="relative flex-1 rounded-2xl border bg-background p-4">
            {!transaction_batch?.can_view ? (
                <div className="flex size-full flex-col items-center justify-center gap-y-3 p-4">
                    {transaction_batch?.request_view ? (
                        <>
                            <EyeNoneIcon className="size-12 text-muted-foreground/40" />
                            <p>Blotter View Request Pending</p>
                            <p className="text-center text-sm text-muted-foreground/80">
                                Requested access on{' '}
                                <span className="rounded-sm bg-accent p-0.5 px-1 text-accent-foreground">
                                    {toReadableDate(
                                        transaction_batch.request_view,
                                        "MM-dd-yyyy 'at' hh:mm a"
                                    )}
                                </span>
                                . Please wait for the authorized person to
                                approve your request.
                            </p>
                        </>
                    ) : (
                        <>
                            <EyeNoneIcon className="size-12 text-muted-foreground/40" />
                            <p>Transaction Batch Blotter Hidden</p>
                            <p className="text-center text-sm text-muted-foreground/80">
                                You can request view and your manager will
                                confirm or decline
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={
                                    isRequestingView ||
                                    !!transaction_batch?.request_view
                                }
                                onClick={() =>
                                    onOpenSecurityAction({
                                        title: 'Request Blotter View',
                                        description:
                                            'You are requesting blotter view, please confirm if it is really you.',
                                        onSuccess: () =>
                                            requestBlotterView(
                                                transaction_batch.id
                                            ),
                                    })
                                }
                            >
                                {isRequestingView ? (
                                    <LoadingSpinner />
                                ) : (
                                    'Request View'
                                )}
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-center font-medium">
                        Transaction Batch Summary (Blotter)
                    </p>
                    <div className="w-full space-y-2">
                        <p>Collection</p>
                        <div className="rounded-xl bg-accent">
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    OR Collection
                                </p>
                                <p>1,400</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Deposit Entry
                                </p>
                                <p>5,800</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Teller Beginning Balance
                                </p>
                                <p>100</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-2">
                        <p>Less (Disbursements)</p>
                        <div className="rounded-xl bg-accent">
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Savings Withdrawal
                                </p>
                                <p>8000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Time Dep. Withdrawal
                                </p>
                                <p>3,800</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Loan Releases
                                </p>
                                <p>15,000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Petty Cash
                                </p>
                                <p>850</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Commercial Check
                                </p>
                                <p>4,000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Transfer RF
                                </p>
                                <p>100</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-2">
                        <p>Summary</p>
                        <div className="rounded-xl bg-accent">
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Total Supposed Remittance
                                </p>
                                <p>4,000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Total Cash on Hand
                                </p>
                                <p>30,000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Total Check Remitance
                                </p>
                                <p>15,000</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Total Deposit in Bank
                                </p>
                                <p>850</p>
                            </div>
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Total Actual Remittance
                                </p>
                                <p>4,000</p>
                            </div>
                        </div>
                        <div className="flex justify-between rounded-xl bg-accent p-4 text-primary">
                            <p className="">Balanced</p>
                            <p className="">0.00</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BatchBlotter
