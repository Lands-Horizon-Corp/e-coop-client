import { useRef } from 'react'

import { generateUUID } from '@/helpers/idempotency-utils'

export const useIdempotency = () => {
    const keyRef = useRef<string>('')

    if (!keyRef.current) {
        keyRef.current = generateUUID()
    }

    const resetKey = () => {
        keyRef.current = generateUUID()
    }

    return {
        idempotencyKey: keyRef.current,
        resetIdempotencyKey: resetKey,
    }
}
