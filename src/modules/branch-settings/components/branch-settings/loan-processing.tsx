import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import {
    LoanProcessingEventResponse,
    useProcessAllLoanTransaction,
} from '@/modules/loan-transaction'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { FilesIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

type Props = {
    branchId?: TEntityId
}

const LoanProcessing = ({ branchId }: Props) => {
    const [processingState, setProcessingState] = useState<
        'processing' | undefined
    >()

    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const resolvedBranchId = branchId || user_organization?.branch_id

    const { isPending, mutateAsync } = useProcessAllLoanTransaction()

    return (
        <div className="space-y-3 p-4 bg-popover rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex items-center flex-1 gap-2">
                    <FilesIcon className="size-5 text-accent-foreground" />
                    <h3 className="font-semibold"> Loan Processing</h3>
                </div>
                <Button
                    disabled={isPending || processingState === 'processing'}
                    onClick={() => {
                        toast.promise(mutateAsync, {
                            loading: 'Triggering loan process...',
                            error: 'Error processing loans',
                            success: 'All loans are now being processed',
                        })
                    }}
                    size="sm"
                    type="button"
                >
                    Process All Loans
                </Button>
            </div>
            <ProcessingProgress
                onProgressChange={setProcessingState}
                subscriptionKey={`loan.process.branch.${resolvedBranchId}`}
            />
            <AnimatePresence mode="wait">
                <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground rounded-xl !mt-1"
                    exit={{ opacity: 0, y: -5 }}
                    initial={{ opacity: 0, y: 5 }}
                    key={processingState || 'idle'}
                    transition={{
                        duration: 0.3,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                >
                    {processingState === 'processing'
                        ? 'System is currently processing loans, this might take a while...'
                        : 'By clicking "Process", this loan will be processed up to the selected date — including any deleted transactions linked to it — to ensure that delinquencies are properly recorded. Loans that have already been processed will not be processed again. The processing will use the current system time or the frozen time setting (if Time Machine mode is active).'}
                </motion.p>
            </AnimatePresence>
        </div>
    )
}

const ProcessingProgress = ({
    subscriptionKey,
    onProgressChange,
}: {
    subscriptionKey?: string
    onProgressChange?: (progressState: 'processing' | undefined) => void
}) => {
    // const [iter, setIter] = useState(0)
    const [status, setStatus] = useState<
        'processing' | 'complete' | undefined
    >()
    const [data, setData] = useState<LoanProcessingEventResponse | undefined>(
        undefined
    )
    const [shouldShow, setShouldShow] = useState(false)
    const [prevData, setPrevData] = useState<
        LoanProcessingEventResponse | undefined
    >(undefined)

    useSubscribe<LoanProcessingEventResponse | undefined>(
        subscriptionKey || 'null',
        (data) => {
            setData(data)
            // setIter((prev) => prev + 1)
            // if (iter < 10) setData(data)
            // else setData(undefined)
        }
    )

    const progressPercent = data?.total
        ? Math.round((data.processed / data.total) * 100)
        : status === 'complete'
          ? 100
          : 0

    useEffect(() => {
        if (prevData === undefined && data !== undefined && data !== null) {
            setStatus('processing')
            setShouldShow(true)
            onProgressChange?.('processing')
        }

        if (prevData !== undefined && (data === undefined || data === null)) {
            setStatus('complete')
            setTimeout(() => {
                setShouldShow(false)
                setTimeout(() => {
                    setStatus(undefined)
                    onProgressChange?.(undefined)
                }, 500)
            }, 1000)
        }

        setPrevData(data)
    }, [data, onProgressChange, prevData])

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.3 },
                    }}
                >
                    <div className="flex items-center gap-x-1">
                        <Progress
                            className="h-1.5 flex-1 border"
                            indicatorClassName="rounded-r-md duration-500"
                            value={progressPercent || 1}
                        />
                        {status === 'processing' && (
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                className="size-1.5 my-2.5 mx-1 rounded-full bg-primary"
                                key={data?.processed}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.4, 0.0, 0.2, 1],
                                }}
                            />
                        )}
                        {status === 'complete' && (
                            <motion.div
                                animate={{ scale: 1, opacity: 1 }}
                                initial={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 15,
                                }}
                            >
                                <Check className="size-4 text-primary" />
                            </motion.div>
                        )}
                        <p className="text-xs shrink-0 bg-accent rounded-sm px-1 py-px text-accent-foreground">
                            <strong>{progressPercent}%</strong> •{' '}
                            {status === 'complete'
                                ? 'complete'
                                : `${data?.processed || 0} out of ${data?.total || 0}`}{' '}
                        </p>
                        {status === 'processing' && data?.start_time && (
                            <p className="text-xs bg-accent px-1 py-px rounded-sm text-accent-foreground shrink-0 ">
                                ETA:{' '}
                                {calculateETA(
                                    data.total,
                                    data.processed,
                                    data.start_time
                                )}
                            </p>
                        )}
                    </div>

                    {data && (
                        <div className="flex items-center gap-x-2 justify-end">
                            {data.start_time && (
                                <p className="text-xs text-muted-foreground">
                                    {toReadableDate(data.start_time)} -{' '}
                                    {dateAgo(data.start_time)}
                                </p>
                            )}
                            {data.member_name && data.account_name && (
                                <p className="text-xs bg-accent rounded-sm px-1 py-px text-primary">
                                    {data.member_name} - {data.account_name}
                                </p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const calculateETA = (
    total: number,
    processed: number,
    startTime: string
): string => {
    if (processed === 0 || processed >= total) return 'Calculating...'

    const start = new Date(startTime).getTime()
    const now = Date.now()
    const elapsed = now - start

    const averageTimePerItem = elapsed / processed
    const remainingItems = total - processed
    const estimatedRemainingTime = averageTimePerItem * remainingItems

    const seconds = Math.floor(estimatedRemainingTime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`
    } else {
        return `${seconds}s`
    }
}

export default LoanProcessing
