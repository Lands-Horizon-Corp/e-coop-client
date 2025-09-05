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
        <div className={cn('flex items-center gap-x-2', className)}>
            <ImageDisplay src={src} className={cn('size-6', imageClassName)} />
            <div>
                <p
                    className={cn(
                        '',
                        !name && 'text-muted-foreground/70',
                        nameClassName
                    )}
                >
                    {name ? name : 'unknown'}
                </p>
            </div>
        </div>
    )
}

export default ImageNameDisplay
