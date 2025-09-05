import { useEffect } from 'react'

import { useBlocker } from '@tanstack/react-router'

export type TUsePreventExitProps = {
    message?: string
    shouldPrevent: boolean
    onExitPrevented: (proceed: () => void) => void
}

export const usePreventExit = ({
    message = 'Are you sure to leave, any changes made will not be saved',
    shouldPrevent,
    onExitPrevented,
}: TUsePreventExitProps) => {
    // 🧪 NOTE: THIS IS EXPERIMENTAL IN TANSTACK V5 DESU
    const { status, proceed } = useBlocker({
        shouldBlockFn: () => shouldPrevent,
        enableBeforeUnload: true,
        withResolver: true,
    })

    useEffect(() => {
        if (status === 'blocked') {
            onExitPrevented(proceed)
        }
    }, [status, proceed, onExitPrevented])

    // Also prevent browser refresh/close
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (shouldPrevent) {
                event.preventDefault()
                return message
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [shouldPrevent, message])
}
