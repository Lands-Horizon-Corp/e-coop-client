import { useEffect, useRef } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

interface UseSubmitHotkeyOptions {
    onSubmit: () => void
    isPending?: boolean
    disabled?: boolean
    throttleMs?: number
    keys?: string
}

export const useSubmitHotkey = ({
    onSubmit,
    isPending = false,
    disabled = false,
    throttleMs = 800,
    keys = 'enter',
}: UseSubmitHotkeyOptions) => {
    const submitLockRef = useRef(false)
    const lastSubmitRef = useRef<number | null>(null)
    const pendingRef = useRef(isPending)

    useHotkeys(
        keys,
        (e) => {
            const now = Date.now()

            if (
                disabled ||
                submitLockRef.current ||
                (lastSubmitRef.current !== null &&
                    now - lastSubmitRef.current < throttleMs)
            ) {
                return
            }

            e.preventDefault()

            submitLockRef.current = true
            lastSubmitRef.current = now

            onSubmit()

            setTimeout(() => {
                if (!pendingRef.current) {
                    submitLockRef.current = false
                }
            }, 100)
        },
        {
            enableOnFormTags: true,
        },
        [disabled, throttleMs, onSubmit]
    )

    useEffect(() => {
        pendingRef.current = isPending

        if (!isPending) {
            submitLockRef.current = false
        }
    }, [isPending])
}
