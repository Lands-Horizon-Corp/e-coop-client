import { useEffect, useState } from 'react'

const useCountDown = ({
    trigger = false,
    duration = 5,
    step = 1,
    interval = 1000,
    onComplete,
}: {
    trigger: boolean
    duration?: number
    step?: number
    interval?: number
    onComplete?: () => void
}) => {
    const [countDown, setCountDown] = useState(duration)

    useEffect(() => {
        if (trigger) setCountDown(duration)
    }, [trigger])

    useEffect(() => {
        if (!trigger) return

        const counter = setInterval(() => {
            if (countDown > 0) setCountDown((val) => val - step)
        }, interval)

        if (countDown === 0) {
            onComplete?.()
        }

        return () => {
            clearInterval(counter)
        }
    }, [countDown])

    return countDown
}

export default useCountDown
