import { useCallback, useRef } from 'react'

export const useIdempotency = (namespace: string) => {
    const keyRef = useRef<string>('')

    if (!keyRef.current) {
        keyRef.current = `${namespace}:${crypto.randomUUID()}`
    }

    const resetKey = useCallback(() => {
        keyRef.current = `${namespace}:${crypto.randomUUID()}`
    }, [namespace])

    return {
        idempotencyKey: keyRef.current,
        resetIdempotencyKey: resetKey,
    }
}
