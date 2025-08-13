import { useRef } from 'react'

import { useInView } from 'motion/react'

type UseElementInViewOptions = {
    onEnterView?: () => void
    onExitView?: () => void
    once?: boolean
    amount?: 'some' | 'all' | number // matches framer-motion v6+ API
}

export const useElementInView = <T extends HTMLElement = HTMLElement>({
    onEnterView,
    onExitView,
    once = false,
    amount = 'some',
}: UseElementInViewOptions = {}) => {
    const ref = useRef<T | null>(null)

    const isInView = useInView(ref, {
        once,
        amount,
    })

    if (isInView) {
        onEnterView?.()
    } else {
        onExitView?.()
    }

    return { ref, isInView }
}
