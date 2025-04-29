import { toast } from 'sonner'
import Webcam from 'react-webcam'
import { useCallback, useRef, useState } from 'react'

import WebCam from '@/components/webcam'
import { ClockIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TimeInCounter from '@/components/time-in-out/time-in-counter'
import RealtimeTimeText from '@/components/time-in-out/realtime-time-text'

import { cn } from '@/lib/utils'
import { IUserData } from '@/types/coop-types'
import { IBaseProps } from '@/types/components'

export type TTImeInEntry = {
    timeStart: Date
    timeEnd?: Date
}

interface Props extends IBaseProps {
    currentUser: IUserData
    timeEntry?: TTImeInEntry
    message?: string
    onTimeInEntry: (timeEntry: TTImeInEntry) => void
    onTimeOut: (timeEntry: TTImeInEntry) => void
}

const TimeInTimeOut = ({
    className,
    timeEntry,
    message,
    onTimeOut,
    onTimeInEntry,
}: Props) => {
    const camRef = useRef<Webcam>(null)
    const [loading, setLoading] = useState(false)

    const captureImage = useCallback(() => {
        if (!camRef.current) return null
        const imageSrc = camRef.current.getScreenshot()
        return imageSrc
    }, [camRef])

    const handleClick = () => {
        setLoading(true)
        const capturedImage = captureImage()

        if (!capturedImage) {
            setLoading(false)
            return toast.error('Sorry, Image was not captured')
        }

        if (!timeEntry) {
            return setTimeout(() => {
                onTimeInEntry({
                    timeStart: new Date('Mon, 07 Oct 2024 06:50:39 GMT'),
                })
            }, 1000)
        }

        return setTimeout(() => {
            onTimeOut({
                timeStart: new Date('Mon, 07 Oct 2024 06:50:39 GMT'),
                timeEnd: new Date(),
            })
        }, 1000)
    }

    return (
        <div className={cn('space-y-4', className)}>
            <div className="relative m-4 mx-auto">
                <WebCam ref={camRef} className="rounded-2xl" />
            </div>
            <div className="flex flex-col items-center gap-y-6 px-4">
                <p
                    style={{ fontFamily: 'cursive' }}
                    className="text-center text-lg italic text-foreground/60"
                >
                    "{message}"
                </p>
                {timeEntry && (
                    <div className="flex w-full items-center justify-between gap-x-2 rounded-xl bg-secondary p-2 dark:bg-background">
                        <span className="text-foreground/70">Work hours</span>{' '}
                        <TimeInCounter
                            className="text-base"
                            timeEntry={timeEntry}
                        />
                    </div>
                )}
                <span className="text-left text-foreground/60">
                    <span>Current : </span>
                    <RealtimeTimeText />
                </span>
            </div>
            <div className="w-full px-4 py-4">
                <Button
                    size="sm"
                    disabled={loading}
                    className={cn(
                        'w-full gap-x-2 rounded-full',
                        timeEntry &&
                            'bg-orange-500 text-orange-50 hover:bg-orange-600 hover:text-orange-100'
                    )}
                    onClick={handleClick}
                    variant={!timeEntry ? 'default' : 'outline'}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : timeEntry ? (
                        <>
                            <ClockIcon className="size-4" />
                            Time Out
                        </>
                    ) : (
                        <>
                            <ClockIcon className="size-4" />
                            Time In
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default TimeInTimeOut
