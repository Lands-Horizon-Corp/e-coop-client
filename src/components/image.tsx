import { forwardRef, useCallback, useEffect, useState } from 'react'

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

        // Update currentSrc when src prop changes
        useEffect(() => {
            if (src !== currentSrc) {
                setCurrentSrc(src || '')
                setIsLoaded(false)
                setHasError(false)
            }
        }, [src, currentSrc])

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
                aria-label={isLoaded ? alt : ariaLoadingLabel} // Dynamic aria-label for loading state
                className={cn('relative overflow-hidden', className)}
                role="img" // Improved accessibility: treat wrapper as image role
            >
                {/* Placeholder/Blur background */}
                {isPlaceholderVisible && (
                    <div
                        aria-hidden="true" // Hide from screen readers
                        className="absolute inset-0"
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
                    />
                )}

                {/* Loading skeleton */}
                {!isLoaded && !isPlaceholderVisible && (
                    <div
                        aria-hidden="true" // Hide from screen readers
                        className="absolute inset-0 animate-pulse"
                    />
                )}

                {/* Main image */}
                <img
                    {...imgProps}
                    alt={alt}
                    className={cn(
                        'h-full w-full transition-opacity duration-300 select-none pointer-events-none',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        hasError && 'opacity-50'
                    )}
                    decoding="async"
                    draggable={false}
                    height={height}
                    loading={priority ? 'eager' : loading}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onError={handleError}
                    onLoad={handleLoad}
                    ref={ref}
                    sizes={sizes}
                    src={currentSrc}
                    srcSet={srcSet} // Added: Support for responsive images
                    style={imageStyle}
                    width={width}
                />
            </div>
        )
    }
)

Image.displayName = 'Image'

export default Image
