import { forwardRef, useCallback, useState } from 'react'

import { cn } from '@/helpers/tw-utils'

import { IClassProps } from '@/types'

interface ImageProps
    extends IClassProps,
        Omit<
            React.ImgHTMLAttributes<HTMLImageElement>,
            'onLoad' | 'onError' | 'className' | 'srcSet'
        > {
    placeholder?: string
    blurDataURL?: string
    blurRadius?: number
    priority?: boolean
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
    fallbackSrc?: string
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    srcSet?: string // Added for responsive image support
    ariaLoadingLabel?: string // Added for better accessibility during loading
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
    (
        {
            src,
            alt,
            className,
            width,
            height,
            placeholder,
            blurDataURL,
            blurRadius = 10,
            priority = false,
            loading = 'lazy',
            sizes,
            onLoad,
            onError,
            fallbackSrc,
            objectFit = 'cover',
            srcSet,
            ariaLoadingLabel = 'Loading image',
            ...imgProps
        },
        ref
    ) => {
        const [isLoaded, setIsLoaded] = useState(false)
        const [hasError, setHasError] = useState(false)
        const [currentSrc, setCurrentSrc] = useState(src || '')

        const handleLoad = useCallback(
            (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                setIsLoaded(true)
                onLoad?.(event)
            },
            [onLoad]
        )

        const handleError = useCallback(
            (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                setHasError(true)
                if (fallbackSrc && currentSrc !== fallbackSrc) {
                    setCurrentSrc(fallbackSrc)
                    setHasError(false) // Reset error for retry with fallback
                } else {
                    onError?.(event)
                }
            },
            [onError, fallbackSrc, currentSrc]
        )

        const imageStyle = {
            objectFit,
            ...(width && { width }),
            ...(height && { height }),
        }

        const isPlaceholderVisible = !isLoaded && (placeholder || blurDataURL)

        return (
            <div
                className={cn('relative overflow-hidden', className)}
                role="img" // Improved accessibility: treat wrapper as image role
                aria-label={isLoaded ? alt : ariaLoadingLabel} // Dynamic aria-label for loading state
            >
                {/* Placeholder/Blur background */}
                {isPlaceholderVisible && (
                    <div
                        className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
                        style={{
                            backgroundImage: placeholder
                                ? `url(${placeholder})`
                                : blurDataURL
                                  ? `url(${blurDataURL})`
                                  : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: `blur(${blurRadius}px)`,
                            transform: 'scale(1.1)',
                        }}
                        aria-hidden="true" // Hide from screen readers
                    />
                )}

                {/* Loading skeleton */}
                {!isLoaded && !isPlaceholderVisible && (
                    <div
                        className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800"
                        aria-hidden="true" // Hide from screen readers
                    />
                )}

                {/* Main image */}
                <img
                    {...imgProps}
                    ref={ref}
                    src={currentSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : loading}
                    sizes={sizes}
                    srcSet={srcSet} // Added: Support for responsive images
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'h-full w-full transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        hasError && 'opacity-50'
                    )}
                    style={imageStyle}
                    decoding="async"
                />
            </div>
        )
    }
)

Image.displayName = 'Image'

export default Image
