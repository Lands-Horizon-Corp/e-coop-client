import { useEffect, useRef, useState } from 'react'

const useIsFocused = () => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        const handleFocus = () => setIsFocused(true)
        const handleBlur = () => setIsFocused(false)
        const refInside = ref.current
        if (refInside) {
            refInside.addEventListener('focus', handleFocus)
            refInside.addEventListener('blur', handleBlur)
        }

        return () => {
            if (refInside) {
                refInside.removeEventListener('focus', handleFocus)
                refInside.removeEventListener('blur', handleBlur)
            }
        }
    }, [])

    return { ref, isFocused }
}

export default useIsFocused
