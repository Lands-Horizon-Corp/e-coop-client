import { Image2Icon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { cn } from '@/lib'
import { IBaseProps } from '@/types'

interface Props extends IBaseProps {
    src?: string
    fallback?: string
    imageClassName?: string
    fallbackClassName?: string
    onClick?: () => void
}

const ImageDisplay = ({
    src,
    fallback,
    children,
    className,
    imageClassName,
    fallbackClassName,
    onClick,
}: Props) => {
    return (
        <Avatar
            onClick={onClick}
            className={cn('size-6 bg-secondary dark:bg-popover', className)}
        >
            <AvatarImage
                className={cn('object-cover', imageClassName)}
                src={src ?? '-'}
            />
            <AvatarFallback className={cn('rounded-none', fallbackClassName)}>
                {fallback ? (
                    fallback
                ) : (
                    <Image2Icon className="size-[50%] text-foreground/20" />
                )}
            </AvatarFallback>
            {children}
        </Avatar>
    )
}

export default ImageDisplay
