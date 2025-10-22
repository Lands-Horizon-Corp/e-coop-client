import { cn } from '@/helpers'

import ImageDisplay from '@/components/image-display'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    src?: string
    name?: string
    imageClassName?: string
    nameClassName?: string
}

const ImageNameDisplay = ({
    name,
    src,
    className,
    nameClassName,
    imageClassName,
}: Props) => {
    return (
        <div
            className={cn(
                'flex items-center gap-x-2 max-w-full min-w-0',
                className
            )}
        >
            <ImageDisplay className={cn('size-6', imageClassName)} src={src} />
            <p
                className={cn(
                    'truncate min-w-0 max-w-full',
                    !name && 'text-muted-foreground/70',
                    nameClassName
                )}
            >
                {name ? name : 'No name'}
            </p>
        </div>
    )
}

export default ImageNameDisplay
