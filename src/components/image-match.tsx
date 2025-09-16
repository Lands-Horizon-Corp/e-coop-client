import { cn } from '@/helpers'

import Image from './image'

interface ImageMatchProps {
    src: string
    alt: string
    className?: string
    color?: string
    containerClassName?: string
}

const ImageMatch = ({
    src,
    alt,
    className,
    color = 'bg-primary',
    containerClassName,
}: ImageMatchProps) => {
    return (
        <div className={cn('relative', containerClassName)}>
            <Image
                alt={alt}
                className={cn(
                    'h-full w-full object-contain grayscale brightness-0',
                    className
                )}
                src={src}
            />
            <div
                className={cn('absolute inset-0', color)}
                style={{
                    mask: `url(${src}) no-repeat center/contain`,
                    WebkitMask: `url(${src}) no-repeat center/contain`,
                }}
            />
            <div className="absolute inset-0 bg-none mix-blend-color-dodge opacity-100" />
            <Image
                alt={alt}
                className={cn(
                    'top-0 left-0 h-full w-full object-contain absolute grayscale mix-blend-hard-light',
                    className
                )}
                src={src}
            />
        </div>
    )
}

export default ImageMatch
