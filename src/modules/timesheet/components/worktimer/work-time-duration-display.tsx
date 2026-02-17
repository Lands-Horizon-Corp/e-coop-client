import { useEffect, useState } from 'react'

import { getTimeDifference } from './utils'

type Props = { hours: number; minutes: number; seconds: number }

const WorkTimeDurationDisplay = ({ hours, minutes, seconds }: Props) => {
    return (
        <div className="flex items-center justify-center gap-x-2">
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg  dark:bg-accent">
                    {`${hours}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Hours
                </p>
            </div>
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg  dark:bg-accent">
                    {`${minutes}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Minutes
                </p>
            </div>
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg  dark:bg-accent">
                    {`${seconds}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Seconds
                </p>
            </div>
        </div>
    )
}

const useLiveTimeTicker = ({
    timeIn,
    pollingInterval = 1_000,
    onTick,
}: {
    timeIn: Date | string
    pollingInterval?: number
    onTick?: (timeValue: Props) => void
}) => {
    const [values, setValues] = useState(getTimeDifference(timeIn, new Date()))

    useEffect(() => {
        const interval = setInterval(() => {
            const timeProgress = getTimeDifference(timeIn, new Date())
            onTick?.(timeProgress)
            setValues(timeProgress)
        }, pollingInterval)

        return () => clearInterval(interval)
    }, [onTick, pollingInterval, timeIn])

    return values
}

export const LiveWorkTimeDurationDisplay = ({
    timeIn,
    pollingInterval = 1_000,
    onTick,
}: {
    timeIn: Date | string
    pollingInterval?: number
    onTick?: (timeValue: Props) => void
}) => {
    const values = useLiveTimeTicker({ timeIn, pollingInterval, onTick })

    return <WorkTimeDurationDisplay {...values} />
}

export const LiveWorkTimeDurationDisplayMini = ({
    timeIn,
    pollingInterval = 1_000,
    onTick,
}: {
    timeIn: Date | string
    pollingInterval?: number
    onTick?: (timeValue: Props) => void
}) => {
    const values = useLiveTimeTicker({ timeIn, pollingInterval, onTick })

    const hour = `${values?.hours}`.padStart(1, '0')
    const mins = `${values?.minutes}`.padStart(2, '0')
    const secs = `${values?.seconds}`.padStart(2, '0')

    return (
        <div className="inline-flex items-center text-xs justify-center gap-x-2 rounded-sm px-2">
            <p className="text-center">{`${hour}:${mins}:${secs}`}</p>
        </div>
    )
}

export default WorkTimeDurationDisplay
