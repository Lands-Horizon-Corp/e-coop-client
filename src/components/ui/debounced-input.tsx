import { useEffect, useState } from 'react'

import { Input, InputProps } from './input'

interface DebouncedInputProps<T>
    extends Omit<InputProps, 'value' | 'onChange'> {
    value: T
    onChange: (value: T) => void
    debounceTime?: number
}

const DebouncedInput = <T,>({
    value: initialValue,
    onChange,
    debounceTime = 300,
    ...props
}: DebouncedInputProps<T>) => {
    const [internalValue, setInternalValue] = useState<T>(initialValue)

    useEffect(() => {
        if (initialValue !== internalValue) {
            setInternalValue(initialValue)
        }
    }, [initialValue, internalValue, setInternalValue])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (internalValue !== initialValue) {
                onChange(internalValue)
            }
        }, debounceTime)

        return () => clearTimeout(handler)
    }, [internalValue, debounceTime, initialValue, onChange])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue: T = e.target.value as unknown as T

        if (props.type === 'number') {
            newValue =
                e.target.value === '' ? ('' as T) : (+e.target.value as T)
        }

        setInternalValue(newValue)
    }

    return (
        <Input
            {...props}
            value={internalValue as unknown as string}
            onChange={handleInputChange}
        />
    )
}

export { DebouncedInput }
