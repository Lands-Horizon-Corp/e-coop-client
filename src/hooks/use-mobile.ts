import * as React from 'react'

export const useIsMobile = (breakpointWidth = 768) => {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined
    )

    React.useEffect(() => {
        const mediaMatch = window.matchMedia(
            `(max-width: ${breakpointWidth - 1}px)`
        )
        const onChange = () => setIsMobile(mediaMatch.matches)

        setIsMobile(mediaMatch.matches)
        mediaMatch.addEventListener('change', onChange)

        return () => mediaMatch.removeEventListener('change', onChange)
    }, [breakpointWidth])

    return !!isMobile
}
