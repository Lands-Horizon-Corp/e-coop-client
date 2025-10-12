import { cn } from '@/helpers'

import Image from './image'

interface ImageMatchProps {
    src: string
    alt: string
    className?: string
    color?: string
    containerClassName?: string
    glow?: boolean
}

const ImageMatcher = ({
    src,
    alt,
    className,
    color = 'bg-primary',
    containerClassName,
}: ImageMatchProps) => {
    return (
        <div className={cn('relative', containerClassName)}>
            {/* Glow effect - blurred background image */}

            <Image
                alt={alt}
                className={cn(
                    'h-full w-full object-cover grayscale brightness-100 dark:brightness-0 dark:opacity-100 opacity-0',
                    className
                )}
                src={src}
            />
            <div
                className={cn('absolute inset-0', color)}
                style={{
                    mask: `url(${src}) no-repeat center/cover`,
                    WebkitMask: `url(${src}) no-repeat center/cover`,
                }}
            />
            <div className="absolute inset-0 bg-none mix-blend-color-dodge opacity-100" />
            <Image
                alt={alt}
                className={cn(
                    'top-0 left-0 h-full w-full object-cover absolute grayscale mix-blend-hard-light',
                    className
                )}
                src={src}
            />
        </div>
    )
}

const ImageMatch = (data: ImageMatchProps) => {
    if (!data.glow) {
        return <ImageMatcher {...data} />
    }
    return (
        <div className="relative">
            <ImageMatcher {...data} />

            <div className="absolute inset-0 flex items-center justify-center blur-2xl">
                <div className="scale-125 ">
                    <ImageMatcher {...data} />
                </div>
            </div>
        </div>
    )
}

export default ImageMatch
