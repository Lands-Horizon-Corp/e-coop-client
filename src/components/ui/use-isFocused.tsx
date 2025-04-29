import { useEffect, useRef, useState } from 'react'

const useIsFocused = () => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        const handleFocus = () => setIsFocused(true)
        const handleBlur = () => setIsFocused(false)

        if (ref.current) {
            ref.current.addEventListener('focus', handleFocus)
            ref.current.addEventListener('blur', handleBlur)
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('focus', handleFocus)
                ref.current.removeEventListener('blur', handleBlur)
            }
        }
    }, [])

    return { ref, isFocused }
}

export default useIsFocused
