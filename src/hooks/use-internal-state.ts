import { useState, useCallback } from 'react'

export function useInternalState<T>(
    initialValue: T,
    controlledValue?: T | undefined,
    onChange?: ((value: T) => void) | undefined
): [T, (value: T) => void] {
    const isControlled = controlledValue !== undefined

    const [internalValue, setInternalValue] = useState<T>(initialValue)

    const value = isControlled ? controlledValue : internalValue

    const setValue = useCallback(
        (newValue: T) => {
            if (isControlled) {
                onChange?.(newValue)
            } else {
                setInternalValue(newValue)
            }
        },
        [isControlled, onChange]
    )

    return [value, setValue]
}
