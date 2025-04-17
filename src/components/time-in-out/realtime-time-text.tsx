import { cn } from '@/lib/utils'
import { IClassProps } from '@/types/components'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

interface Props extends IClassProps {
    formatString?: string
    updateInterval?: number
}

const RealtimeTimeText = ({
    className,
    updateInterval = 5_000,
    formatString = 'MMM d yyyy, h:mm a',
}: Props) => {
    const [currentTime, setCurrentTime] = useState('')

    const updateTime = useCallback(
        (date: Date) => {
            setCurrentTime(format(date, formatString))
        },
        [formatString]
    )

    useEffect(() => {
        updateTime(new Date())
        const updater = setInterval(() => {
            const currentDate = new Date()
            updateTime(currentDate)
        }, updateInterval)

        return () => clearInterval(updater)
    }, [])

    return <span className={cn('', className)}>{currentTime}</span>
}

export default RealtimeTimeText
