import { useEffect, useState } from 'react'

import { getTimeDifference } from './utils'

type Props = { hours: number; minutes: number; seconds: number }

const WorkTimeDurationDisplay = ({ hours, minutes, seconds }: Props) => {
    return (
        <div className="flex items-center justify-center gap-x-2">
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg text-accent-foreground dark:bg-accent">
                    {`${hours}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Hours
                </p>
            </div>
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg text-accent-foreground dark:bg-accent">
                    {`${minutes}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Minutes
                </p>
            </div>
            <div className="min-w-[50px] space-y-2">
                <p className="rounded-sm bg-background py-2 text-center text-lg text-accent-foreground dark:bg-accent">
                    {`${seconds}`.padStart(2, '0')}
                </p>
                <p className="text-center text-xs font-light text-muted-foreground">
                    Seconds
                </p>
            </div>
        </div>
    )
}

export const LiveWorkTimeDurationDisplay = ({
    timeIn,
    pollingInterval = 1_000,
}: {
    timeIn: Date | string
    pollingInterval?: number
}) => {
    const [values, setValues] = useState(getTimeDifference(timeIn, new Date()))

    useEffect(() => {
        const interval = setInterval(() => {
            const timeProgress = getTimeDifference(timeIn, new Date())
            setValues(timeProgress)
        }, pollingInterval)

        return () => clearInterval(interval)
    }, [pollingInterval, timeIn])

    return <WorkTimeDurationDisplay {...values} />
}

export default WorkTimeDurationDisplay
