import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'

import LoadingSpinner from '@/components/spinners/loading-spinner'

import { InfoFillCircleIcon } from '../../../components/icons'
import InfoTooltip from '../../../components/tooltips/info-tooltip'
import { Button } from '../../../components/ui/button'
import { useCancelTimeMachineTime } from '../user-organization.service'

type Props = {
    timeMachineTime?: string
    className?: string
}

const TimeMachineTimeStatusBar = ({ className, timeMachineTime }: Props) => {
    const { mutateAsync, isPending } = useCancelTimeMachineTime()

    if (!timeMachineTime) return null

    return (
        <div
            className={cn(
                'flex items-center px-3 py-1 gap-x-4 shadow-md bg-primary backdrop-blur-sm text-sm text-primary-foreground',
                className
            )}
        >
            <InfoTooltip
                align="start"
                content={
                    <div className="max-w-[50vw] text-pretty rounded-xl p-2 text-sm">
                        <p>
                            The time machine will only affect loan, debit,
                            credit, payment, transaction batch, cash check
                            voucher, journal voucher, and adjustment entry.
                            Fields such as created at, updated at, and others
                            will not be affected, as they are secured by world
                            time
                        </p>
                    </div>
                }
            >
                <p className="flex-1">
                    <InfoFillCircleIcon className="inline mr-2" />
                    Currently in Time Machine — Time frozen at{' '}
                    <span className="font-bold">
                        {toReadableDateTime(timeMachineTime)}
                    </span>
                </p>
            </InfoTooltip>
            <Button
                className=""
                disabled={isPending}
                onClick={() =>
                    toast.promise(mutateAsync(), {
                        loading: 'Cancelling Time Machine...',
                        success: 'Time Machine cancelled',
                        error: 'Error cancelling Time Machine',
                    })
                }
                size="sm"
                variant="secondary"
            >
                {isPending ? <LoadingSpinner /> : 'Cancel Time Machine'}
            </Button>
        </div>
    )
}

export default TimeMachineTimeStatusBar
