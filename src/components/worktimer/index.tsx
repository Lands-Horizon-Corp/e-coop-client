import { useState } from 'react'

import { Button } from '../ui/button'
import TimeInOut from './time-in-out'
import ImageDisplay from '../image-display'
import { Separator } from '../ui/separator'
import { PlayIcon, StopIcon } from '../icons'
import LoadingSpinner from '../spinners/loading-spinner'

import { cn } from '@/lib'
import { toReadableDateTime } from '@/utils'
import { useCurrentTimesheet } from '@/hooks/api-hooks/use-timesheet'

import ARTWORK_TIMED_IN from '@/assets/artworks/artwork-timed-in.svg'
import ARTWORK_TIME_IN_OUT from '@/assets/artworks/artwork-time-in-out.svg'

import { IClassProps } from '@/types'
import { LiveWorkTimeDurationDisplay } from './work-time-duration-display'
import useActionSecurityStore from '@/store/action-security-store'

interface Props extends IClassProps {}

const WorkTimer = ({ className }: Props) => {
    const { onOpenSecurityAction } = useActionSecurityStore()
    const [showTimeInOut, setShowTimeInOut] = useState(false)
    const { data: timesheet, isPending } = useCurrentTimesheet()

    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] min-w-[430px] flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-secondary p-4 ring-offset-1 dark:bg-popover',
                'shadow-xl',
                className
            )}
        >
            <p
                className={cn(
                    'mx-auto w-fit rounded-md p-1 px-4 text-sm',
                    !timesheet &&
                        'bg-amber-200/50 text-orange-500 dark:bg-amber-400/10 dark:text-orange-400',
                    timesheet && 'bg-primary/10 text-primary'
                )}
            >
                {timesheet ? 'Timed In' : 'Timed Out'}
            </p>
            {timesheet && (
                <div className="flex flex-col items-center gap-y-4">
                    {!showTimeInOut && (
                        <ImageDisplay
                            className="size-48 rounded-xl"
                            src={ARTWORK_TIMED_IN}
                        />
                    )}
                    <LiveWorkTimeDurationDisplay timeIn={timesheet.time_in} />
                    <p className="text-center text-sm font-light text-muted-foreground">
                        Timed in at{' '}
                        <span className="text-foreground">
                            {toReadableDateTime(timesheet.time_in)}
                        </span>
                    </p>
                </div>
            )}
            {!timesheet && !isPending && !showTimeInOut && (
                <div className="flex flex-col items-center justify-center gap-y-4 py-4">
                    <ImageDisplay
                        className="size-48 rounded-xl"
                        src={ARTWORK_TIME_IN_OUT}
                    />
                    <p className="text-lg">Ready to Start Your Day?</p>
                    <p className="text-sm text-muted-foreground">
                        Begin your shift and let the system track your working
                        time
                    </p>
                </div>
            )}
            {showTimeInOut ? (
                <TimeInOut
                    onCancel={() => setShowTimeInOut(false)}
                    onSuccess={() => {
                        setShowTimeInOut(false)
                    }}
                />
            ) : (
                <Button
                    className="gap-x-2"
                    onClick={() =>
                        onOpenSecurityAction({
                            title: 'Time In / Time Out',
                            onSuccess: () => {
                                setShowTimeInOut((prev) => !prev)
                            },
                        })
                    }
                >
                    {timesheet ? (
                        <>
                            <StopIcon />
                            Time Out
                        </>
                    ) : (
                        <>
                            <PlayIcon />
                            Time In
                        </>
                    )}
                </Button>
            )}
            {isPending && <LoadingSpinner />}
            <Separator />
            <Button variant="outline" hoverVariant="primary">
                My Timesheets
            </Button>
        </div>
    )
}

export default WorkTimer
