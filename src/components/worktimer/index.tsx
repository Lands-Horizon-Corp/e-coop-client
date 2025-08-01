import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import ARTWORK_TIME_IN_OUT from '@/assets/artworks/artwork-time-in-out.svg'
import ARTWORK_TIMED_IN from '@/assets/artworks/artwork-timed-in.svg'
import { cn } from '@/lib'
import useActionSecurityStore from '@/store/action-security-store'
import { toReadableDateTime } from '@/utils'
import { Link } from '@tanstack/react-router'

import { useCurrentTimesheet } from '@/hooks/api-hooks/use-timesheet'

import { IClassProps, ITimesheet } from '@/types'

import { ArrowUpIcon, PlayIcon, StopIcon } from '../icons'
import ImageDisplay from '../image-display'
import LoadingSpinner from '../spinners/loading-spinner'
import { Button } from '../ui/button'
import TimeInOut from './time-in-out'
import { LiveWorkTimeDurationDisplay } from './work-time-duration-display'

interface Props extends IClassProps {}

const WorkTimer = ({ className }: Props) => {
    const queryClient = useQueryClient()
    const { onOpenSecurityAction } = useActionSecurityStore()
    const [showTimeInOut, setShowTimeInOut] = useState(false)
    const { data: timesheet, isPending } = useCurrentTimesheet()

    return (
        <div
            className={cn(
                'ecoop-scroll relative flex max-h-[90vh] min-w-[430px] flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-secondary p-4 ring-offset-1 dark:bg-popover',
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
            <p className="mx-auto max-w-72 text-center text-xs text-muted-foreground">
                Log your time-in and time-out to track your work hours
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
                    <p className="!-mb-4 text-lg">Ready to Start Your Day?</p>
                    <p className="text-sm text-muted-foreground">
                        Begin your shift and let the system track your working
                        time
                    </p>
                </div>
            )}
            {showTimeInOut ? (
                <TimeInOut
                    timesheet={timesheet}
                    onCancel={() => setShowTimeInOut(false)}
                    onSuccess={(data) => {
                        setShowTimeInOut(false)
                        if (data.time_out) {
                            return queryClient.invalidateQueries({
                                exact: true,
                                queryKey: ['timesheet', 'current'],
                            })
                        }

                        return queryClient.setQueryData<ITimesheet>(
                            ['timesheet', 'current'],
                            data
                        )
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
            <p className="mx-auto max-w-72 text-center text-xs text-muted-foreground">
                You can view your past timesheet/work time histories in{' '}
                <Link
                    to={
                        '/org/$orgname/branch/$branchname/my-timesheet' as string
                    }
                    className="text-foreground/60 underline duration-150 hover:text-foreground"
                >
                    My Timesheet Page{' '}
                    <ArrowUpIcon className="inline size-2 rotate-45" />
                </Link>
            </p>
        </div>
    )
}

export default WorkTimer
