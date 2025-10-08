import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
                className={cn('size-6 bg-secondary dark:bg-popover', className)}
                onClick={onClick}
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
