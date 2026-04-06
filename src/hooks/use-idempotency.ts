import { useCallback, useRef } from 'react'

import { randomSyncGenerator } from '@/helpers/random-generator'

export const useIdempotency = (namespace: string) => {
    const keyRef = useRef<string>('')

    if (!keyRef.current) {
        keyRef.current = randomSyncGenerator(`${namespace}:`)
    }

    const resetKey = useCallback(() => {
        keyRef.current = randomSyncGenerator(`${namespace}:`)
    }, [namespace])

    return {
        idempotencyKey: keyRef.current,
        resetIdempotencyKey: resetKey,
    }
}
