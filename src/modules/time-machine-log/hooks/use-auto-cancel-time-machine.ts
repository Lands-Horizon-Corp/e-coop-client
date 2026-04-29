import { useEffect, useRef } from 'react'

import { useTimeMachineCancel } from '../time-machine-log.service'
import { TTimeMachineCancelRequest } from '../time-machine-log.types'
import { timeLeft } from '../time-machine-log.utils'

interface UseAutoCancelTimeMachineOptions {
    isActive: boolean
    remainingTime?: number
    timeDiff?: number
    userOrganizationId?: string
    payload?: TTimeMachineCancelRequest & { userOrganizationId?: string }
    // For precise calculation using timeLeft utility
    startTime?: Date
    currentTime?: Date
    totalSeconds?: number
}

/**
 * Hook to automatically cancel time machine when timer expires
 * @param isActive - Whether time machine is currently active
 * @param remainingTime - Remaining time in seconds (for TimeLeft component)
 * @param timeDiff - Time difference in milliseconds (for Clock component)
 * @param userOrganizationId - User organization ID for the mutation
 * @param payload - Optional additional payload to send with the cancel mutation
 * @param startTime - Start time for precise calculation using timeLeft utility
 * @param currentTime - Current time for precise calculation using timeLeft utility
 * @param totalSeconds - Total duration in seconds for precise calculation using timeLeft utility
 */

export const useAutoCancelTimeMachine = ({
    isActive,
    timeDiff,
    userOrganizationId,
    payload,
    startTime,
    currentTime,
    totalSeconds,
}: UseAutoCancelTimeMachineOptions) => {
    const cancelMutation = useTimeMachineCancel()
    const hasCalledMutate = useRef(false)

    useEffect(() => {
        let shouldCancel = false
        let calculatedRemainingTime: number | undefined

        // Use timeLeft utility for precise calculation if raw data is provided
        if (startTime && currentTime && totalSeconds !== undefined) {
            calculatedRemainingTime = timeLeft(
                startTime,
                currentTime,
                totalSeconds
            )
        }

        // Determine which remaining time value to use
        const timeToCheck = calculatedRemainingTime ?? timeDiff

        // Check if remainingTime-based trigger (TimeLeft component)
        if (timeToCheck !== undefined && timeToCheck < 0 && isActive) {
            shouldCancel = true
        }

        // Check if timeDiff-based trigger (Clock component)
        if (
            timeDiff !== undefined &&
            isActive &&
            timeDiff >= 0 &&
            timeDiff < 1000
        ) {
            shouldCancel = true
        }

        if (shouldCancel && !hasCalledMutate.current) {
            hasCalledMutate.current = true
            const mutationPayload = {
                ...payload,
                userOrganizationId:
                    userOrganizationId || payload?.userOrganizationId,
            } as TTimeMachineCancelRequest & { userOrganizationId?: string }

            cancelMutation.mutate(mutationPayload)
        }

        // Reset flag when conditions no longer meet
        if (!shouldCancel) {
            hasCalledMutate.current = false
        }
    }, [
        timeDiff,
        isActive,
        payload,
        userOrganizationId,
        startTime,
        currentTime,
        totalSeconds,
    ])

    return cancelMutation
}
