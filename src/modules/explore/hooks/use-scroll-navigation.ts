import { useCallback } from 'react'

const useScrollNavigation = (containerId: string) => {
    const scroll = useCallback(
        (direction: 'left' | 'right') => {
            const container = document.getElementById(containerId)
            if (container) {
                container.scrollBy({
                    left: direction === 'left' ? -300 : 300,
                    behavior: 'smooth',
                })
            }
        },
        [containerId]
    )

    return { scroll }
}

export default useScrollNavigation
