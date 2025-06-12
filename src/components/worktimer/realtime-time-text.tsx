import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    formatString?: string
    updateInterval?: number
}

const RealtimeTimeText = ({
    className,
    updateInterval = 1_000,
    formatString = 'MMM d yyyy, h:mm:ss a',
}: Props) => {
    const [currentTime, setCurrentTime] = useState(() =>
        format(new Date(), formatString)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(format(new Date(), formatString))
        }, updateInterval)
        return () => clearInterval(interval)
    }, [formatString, updateInterval])

    return <span className={cn('', className)}>{currentTime}</span>
}

export default RealtimeTimeText
