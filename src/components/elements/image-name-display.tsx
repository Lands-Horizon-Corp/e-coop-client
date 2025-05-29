import ImageDisplay from '@/components/image-display'

import { cn } from '@/lib'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    src?: string
    name?: string
    imageClassName?: string
}

const ImageNameDisplay = ({ name, src, className, imageClassName }: Props) => {
    return (
        <div className={cn('flex items-center gap-x-2', className)}>
            <ImageDisplay src={src} className={cn('size-6', imageClassName)} />
            <p className={cn('', !name && 'text-muted-foreground/70')}>
                {name ? name : 'unknown'}
            </p>
        </div>
    )
}

export default ImageNameDisplay
