// External Libraries
import * as React from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ZoomIn,
    ZoomOut,
    FlipHorizontal,
    FlipVertical,
    DownloadIcon,
} from 'lucide-react'

// Local Components
import { useCarousel } from '@/components/ui/carousel'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
    PowerResetIcon,
    RotateLeftIcon,
    RotateRightIcon,
} from '@/components/icons'

// Utility Functions
import { cn } from '@/lib/utils'
import { formatBytes, formatDate } from '@/helpers'

import {
    DownloadProps,
    ImageContainerProps,
    ImagePreviewPanelProps,
    ImagePreviewActionProps,
    ImagePreviewButtonActionProps,
} from '@/types/components/image-preview'

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]

export const DownloadButton = React.forwardRef<
    HTMLButtonElement,
    DownloadProps
>(({ fileName, fileType, imageRef, fileUrl, className, name }, ref) => {
    const handleDownload = () => {
        const downloadImage = imageRef?.current

        // If imageRef is not provided, use the fileUrl directly
        if (!downloadImage && fileUrl) {
            const img = document.createElement('img')
            img.src = fileUrl
            img.crossOrigin = 'anonymous'

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                if (!context) return

                canvas.width = img.naturalWidth
                canvas.height = img.naturalHeight

                context.drawImage(img, 0, 0)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = fileName

                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                    }
                }, fileType)
            }
            return
        }

        if (!downloadImage) return

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.width = downloadImage.naturalWidth
        canvas.height = downloadImage.naturalHeight

        context.drawImage(downloadImage, 0, 0)

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = fileName

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            }
        }, fileType)
    }

    return (
        <ImagePreviewButtonAction
            Icon={
                <DownloadIcon className="size-full cursor-pointer dark:text-white" />
            }
            name={name}
            ref={ref}
            className={className}
            onClick={handleDownload}
        />
    )
})

export const ImagePreviewPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                '!hover:scale-125 absolute size-10 bg-transparent ease-in-out hover:bg-transparent',
                orientation === 'horizontal'
                    ? '-left-12 top-1/2 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                !canScrollPrev ? 'hidden' : '',
                className
            )}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeftIcon className="size-full" />
            <span className="sr-only">Previous slide</span>
        </Button>
    )
})

export const ImagePreviewNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                '!hover:scale-125 absolute size-10 bg-transparent ease-in-out hover:bg-transparent',
                orientation === 'horizontal'
                    ? '-right-12 top-1/2 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                !canScrollNext ? 'hidden' : '',
                className
            )}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRightIcon className="size-full" />
            <span className="sr-only">Next slide</span>
        </Button>
    )
})

export const ImageContainer = ({
    media,
    scale,
    rotateDegree,
    flipScale,
    imageRef,
}: ImageContainerProps) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
    const animationFrameId = useRef<number | null>(null)

    const onMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
        if (e.button !== 0 || scale <= 1) return

        if (!imageRef) return

        const rect = imageRef.current?.getBoundingClientRect()

        if (rect) {
            setIsDragging(true)
            setStartPosition({
                x: e.clientX - previewPosition.x,
                y: e.clientY - previewPosition.y,
            })
        }

        e.stopPropagation()
        e.preventDefault()
    }

    useEffect(() => {
        if (scale === 1) {
            setPreviewPosition({ x: 0, y: 0 })
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            const newX = e.clientX - startPosition.x
            const newY = e.clientY - startPosition.y

            // Cancel previous animation frame request
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current)
            }

            // Use requestAnimationFrame to set state
            animationFrameId.current = requestAnimationFrame(() => {
                setPreviewPosition({ x: newX, y: newY })
            })

            e.stopPropagation()
            e.preventDefault()
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)

            // Clean up the animation frame request
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current)
            }
        }
    }, [isDragging, startPosition, scale])

    const handleImageLoad = () => {
        if (imageRef?.current) {
            setDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            })
        }
    }

    return (
        <div className="relative overflow-hidden rounded-lg">
            <p className="py-1 text-xs">{media.file_name}</p>
            <div className="flex items-center justify-center">
                <img
                    className="h-full w-full cursor-pointer overflow-hidden rounded-lg object-cover"
                    ref={imageRef}
                    onLoad={handleImageLoad}
                    style={{
                        width: '70%',
                        height: '100%',
                        maxHeight: '100vh',
                        transform: `scale(${scale}) translate(${previewPosition.x}px, ${previewPosition.y}px) rotate(${rotateDegree}deg) ${flipScale}`,
                        transition: 'transform 0.1s ease-in-out',
                        cursor: isDragging ? 'grabbing' : 'move',
                        objectFit: 'cover',
                        backgroundSize: 'cover',
                    }}
                    onMouseDown={onMouseDown}
                    crossOrigin="anonymous"
                    src={media.url}
                    alt="Zoomable"
                />
            </div>
            <div className="flex w-full justify-between">
                <Button
                    variant={'link'}
                    className={cn('px-0 text-primary-foreground')}
                >
                    <a
                        target="_blank"
                        href={media.url}
                        className="py-1 text-xs text-black dark:text-white"
                    >
                        Open in Browser
                    </a>
                </Button>
                <div className="py-2 text-end">
                    <p className="text-xs">
                        {dimensions.height}x{dimensions?.width}{' '}
                        {formatBytes(media.file_size)}
                    </p>
                    <p className="text-xs">{formatDate(media.created_at)}</p>
                </div>
            </div>
        </div>
    )
}

export const ImagePreviewButtonAction = React.forwardRef<
    HTMLButtonElement,
    ImagePreviewButtonActionProps
>(({ onClick, Icon, name, className, iconClassName, ...props }, ref) => {
    const defaultIconStyles = '!size-4 dark:text-white'

    return (
        <Button
            ref={ref}
            variant="ghost"
            className={cn(
                'flex items-center justify-center space-x-3 border-0 hover:bg-background/20',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {Icon && (
                <span className={cn(defaultIconStyles, iconClassName)}>
                    {React.cloneElement(Icon as React.ReactElement, {
                        className: cn(defaultIconStyles, iconClassName),
                    })}
                </span>
            )}
            <p className="hidden lg:block">{name}</p>
            <span className="sr-only">{name}</span>
        </Button>
    )
})

export const ImagePreviewActions = React.forwardRef<
    HTMLDivElement,
    ImagePreviewActionProps
>(
    (
        {
            handleZoomIn,
            handleZoomOut,
            handleRotateLeft,
            handleRotateRight,
            handleResetActionState,
            handleFlipHorizontal,
            handleFlipVertical,
            downloadImage,
            className,
            imageRef,
        },
        ref
    ) => {
        return (
            <div
                className={cn(
                    'absolute bottom-32 right-2 flex w-[100vw] items-center px-5 lg:bottom-4 lg:right-4 lg:px-2',
                    className
                )}
            >
                <Card
                    ref={ref}
                    className={cn('flex items-center p-2', className)}
                >
                    <ImagePreviewButtonAction
                        iconClassName="size-4"
                        Icon={<PowerResetIcon />}
                        name="reset"
                        onClick={handleResetActionState}
                    />
                    <ImagePreviewButtonAction
                        Icon={<ZoomIn />}
                        name="zoom in"
                        onClick={handleZoomIn}
                    />
                    <ImagePreviewButtonAction
                        Icon={<ZoomOut />}
                        name="zoom out"
                        onClick={handleZoomOut}
                    />
                    <ImagePreviewButtonAction
                        Icon={<RotateLeftIcon />}
                        name="rotate left"
                        iconClassName="size-4"
                        onClick={handleRotateLeft}
                    />
                    <ImagePreviewButtonAction
                        Icon={<RotateRightIcon />}
                        name="rotate right"
                        iconClassName="size-4"
                        onClick={handleRotateRight}
                    />
                    <ImagePreviewButtonAction
                        Icon={<FlipHorizontal />}
                        name="flip horizontal"
                        onClick={handleFlipHorizontal}
                    />
                    <ImagePreviewButtonAction
                        Icon={<FlipVertical />}
                        name="flip vertical"
                        onClick={handleFlipVertical}
                    />
                    <DownloadButton
                        fileName={downloadImage.fileName}
                        fileUrl={downloadImage.fileUrl}
                        fileType={downloadImage.fileType}
                        imageRef={imageRef}
                        name="download"
                    />
                </Card>
            </div>
        )
    }
)

export const ImagePreviewPanel = forwardRef<HTMLDivElement, ImagePreviewPanelProps>(
  ({ Images, focusIndex, scrollToIndex, scrollIntoView }, ref) => {
    if (!Images || Images.length === 0) {
      return (
        <div className="flex h-fit w-full items-center justify-center p-5 text-gray-500">
          No images available
        </div>
      );
    }

    if (Images.length === 1) {
      return null;
    }

    return (
      <div
        ref={ref}
        className="!z-10 flex items-center space-y-2 overflow-x-auto overflow-y-hidden border-r-[.5px] border-background/20 bg-black/10 p-10 backdrop-blur duration-100 ease-in-out dark:border-slate-400/20 dark:bg-black/70 lg:h-full lg:flex-col lg:overflow-y-auto"
      >
        {Images.map((data, index) => (
          <div
            onClick={() => scrollToIndex(index)}
            className={cn(
              `content:[''] relative flex aspect-square max-h-64 max-w-64 scroll-mb-4 scroll-mt-4 whitespace-nowrap bg-transparent ${
                focusIndex === index
                  ? 'scale-105 duration-300 ease-in-out before:absolute before:-right-2.5 before:top-1/2 before:h-[40%] before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary'
                  : 'border-none'
              }`
            )}
            key={index}
            ref={focusIndex === index ? scrollIntoView : null}
          >
            <img
              className="h-full w-full cursor-pointer overflow-hidden rounded-lg object-cover"
              src={data.url}
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </div>
    );
  }
);

ImagePreviewPanel.displayName = 'ImagePreviewPanel';
