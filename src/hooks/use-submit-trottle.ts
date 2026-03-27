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

    useHotkeys(
        keys,
        (e) => {
            const now = Date.now()

            if (
                disabled ||
                isPending ||
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
        },
        {
            enableOnFormTags: true,
        },
        [disabled, isPending, throttleMs, onSubmit]
    )

    useEffect(() => {
        if (!isPending) {
            submitLockRef.current = false
        }
    }, [isPending])
}
