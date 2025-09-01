import React, { MouseEvent, ReactElement, cloneElement } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'
import { useImagePreview } from '@/store/image-preview-store'

type WithClickWrapperProps<T extends HTMLElement> = {
    media?: IMedia
    shouldStopPropagate?: boolean
    children: ReactElement<{
        className?: string
        onClick?: (event: React.MouseEvent<T, MouseEvent>) => void
    }>
    onWrapperClick?: (event: React.MouseEvent<T, MouseEvent>) => void
}

const PreviewMediaWrapper = <T extends HTMLElement = HTMLButtonElement>({
    media,
    children,
    shouldStopPropagate = true,
    onWrapperClick,
}: WithClickWrapperProps<T>) => {
    const { onOpen } = useImagePreview()

    if (media === undefined) return children

    const originalOnClick = children.props.onClick

    const handleClick = (event: React.MouseEvent<T, MouseEvent>) => {
        if (onWrapperClick) onWrapperClick(event)
        else onOpen({ Images: [media] })

        if (shouldStopPropagate) event.stopPropagation()

        if (originalOnClick) originalOnClick(event)
    }

    return cloneElement(children, {
        onClick: handleClick,
        className: cn(children.props.className, 'cursor-pointer'),
    })
}

export default PreviewMediaWrapper
