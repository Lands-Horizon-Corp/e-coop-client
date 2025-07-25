import React, { forwardRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { cn } from '@/lib/utils'

import { Image2Icon } from './icons'

interface IBaseProps {
    className?: string
    style?: React.CSSProperties
}

interface ImageDisplayProps extends IBaseProps {
    src?: string
    fallback?: string
    imageClassName?: string
    fallbackClassName?: string
    onClick?: () => void
    imageProps?: Omit<React.HTMLProps<HTMLImageElement>, 'ref'>
    avatarRef?: React.Ref<HTMLDivElement>
}

const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
    (
        {
            src,
            fallback,
            className,
            imageClassName,
            fallbackClassName,
            onClick,
            imageProps,
            avatarRef,
            ...props
        },
        ref
    ) => {
        return (
            <Avatar
                ref={avatarRef}
                {...props}
                onClick={onClick}
                className={cn('size-6 bg-secondary dark:bg-popover', className)}
            >
                <AvatarImage
                    ref={ref}
                    {...imageProps}
                    className={cn('object-cover', imageClassName)}
                    src={src ?? '-'}
                />
                <AvatarFallback
                    className={cn('rounded-none capitalize', fallbackClassName)}
                >
                    {fallback ? (
                        fallback
                    ) : (
                        <Image2Icon className="size-[50%] text-foreground/20" />
                    )}
                </AvatarFallback>
            </Avatar>
        )
    }
)

export default ImageDisplay
