import { RefObject, useEffect, useRef } from 'react'

import { useInView } from 'motion/react'

type UseElementInViewOptions = {
    onEnterView?: () => void
    onExitView?: () => void
    scrollParent?: RefObject<Element>
    once?: boolean
    amount?: 'some' | 'all' | number // matches framer-motion v6+ API
}

export const useElementInView = <T extends HTMLElement = HTMLElement>({
    onEnterView,
    onExitView,
    scrollParent,
    once = false,
    amount = 'some',
}: UseElementInViewOptions = {}) => {
    const ref = useRef<T | null>(null)
    const isInView = useInView(ref, { once, amount, root: scrollParent })

    useEffect(() => {
        if (isInView) {
            onEnterView?.()
        } else {
            onExitView?.()
        }
    }, [isInView, onEnterView, onExitView])

    return { ref, isInView }
}
