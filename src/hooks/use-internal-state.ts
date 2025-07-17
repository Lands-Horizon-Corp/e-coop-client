import { useCallback, useState } from 'react'

export function useInternalState<T>(
    initialValue: T,
    controlledValue?: T,
    onChange?: (value: T) => void
): [T, (value: T | ((prev: T) => T)) => void] {
    const isControlled = controlledValue !== undefined

    const [internalValue, setInternalValue] = useState<T>(initialValue)

    const value = isControlled ? controlledValue : internalValue

    const setValue = useCallback(
        (valueOrUpdater: T | ((prev: T) => T)) => {
            const nextValue =
                typeof valueOrUpdater === 'function'
                    ? (valueOrUpdater as (prev: T) => T)(value)
                    : valueOrUpdater

            if (isControlled) {
                onChange?.(nextValue)
            } else {
                setInternalValue(nextValue)
            }
        },
        [isControlled, value, onChange]
    )

    return [value, setValue]
}
