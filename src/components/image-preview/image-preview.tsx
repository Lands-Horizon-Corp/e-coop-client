// External Libraries
import * as React from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'

import { cn, formatDate } from '@/helpers'
import { formatBytes } from '@/modules/media'
import useEmblaCarousel from 'embla-carousel-react'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
    FlipHorizontalIcon,
    FlipVerticalIcon,
    PowerResetIcon,
    RotateLeftIcon,
    RotateRightIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from '@/components/icons'
// Local Components
import { useCarousel } from '@/components/ui/carousel'

import {
    DownloadProps,
    ImageContainerProps,
    ImagePreviewActionProps,
    ImagePreviewButtonActionProps,
    ImagePreviewPanelProps,
} from '@/types'

// Utility Functions

import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

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
            className={className}
            Icon={<DownloadIcon className="size-full cursor-pointer " />}
            name={name}
            onClick={handleDownload}
            ref={ref}
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
            className={cn(
                '!hover:scale-125 absolute size-10 bg-transparent ease-in-out hover:bg-transparent',
                orientation === 'horizontal'
                    ? '-left-12 top-1/2 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                !canScrollPrev ? 'hidden' : '',
                className
            )}
            onClick={scrollPrev}
            ref={ref}
            size={size}
            variant={variant}
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
            className={cn(
                '!hover:scale-125 absolute size-10 bg-transparent ease-in-out hover:bg-transparent',
                orientation === 'horizontal'
                    ? '-right-12 top-1/2 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                !canScrollNext ? 'hidden' : '',
                className
            )}
            onClick={scrollNext}
            ref={ref}
            size={size}
            variant={variant}
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
                    alt="Image Preview"
                    className="h-full w-full cursor-pointer overflow-hidden rounded-lg object-cover"
                    // ref={imageRef}
                    onLoad={handleImageLoad}
                    onMouseDown={onMouseDown}
                    src={media.download_url}
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
                />
            </div>
            <div className="flex w-full justify-between">
                <Button
                    className={cn('px-0 text-primary-foreground')}
                    variant={'link'}
                >
                    <a
                        className="py-1 text-xs "
                        href={media.url}
                        target="_blank"
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
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    className={cn(
                        'flex items-center justify-center space-x-3 border-0 hover:bg-background/20',
                        className
                    )}
                    onClick={onClick}
                    ref={ref}
                    variant="ghost"
                    {...props}
                >
                    {Icon && (
                        <span
                            className={cn(
                                'mr-2 !size-4 text-primary',
                                iconClassName
                            )}
                        >
                            {Icon}
                        </span>
                    )}
                    <p className="hidden lg:block">{name}</p>
                    <span className="sr-only">{name}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
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
                className={cn('absolute items-center overflow-auto', className)}
            >
                <Card
                    className={cn('flex items-center p-2', className)}
                    ref={ref}
                >
                    <ImagePreviewButtonAction
                        Icon={<PowerResetIcon />}
                        iconClassName="size-4"
                        name="reset"
                        onClick={handleResetActionState}
                    />
                    <ImagePreviewButtonAction
                        Icon={<ZoomInIcon />}
                        name="zoom in"
                        onClick={handleZoomIn}
                    />
                    <ImagePreviewButtonAction
                        Icon={<ZoomOutIcon />}
                        name="zoom out"
                        onClick={handleZoomOut}
                    />
                    <ImagePreviewButtonAction
                        Icon={<RotateLeftIcon />}
                        iconClassName="size-4"
                        name="rotate left"
                        onClick={handleRotateLeft}
                    />
                    <ImagePreviewButtonAction
                        Icon={<RotateRightIcon />}
                        iconClassName="size-4"
                        name="rotate right"
                        onClick={handleRotateRight}
                    />
                    <ImagePreviewButtonAction
                        Icon={<FlipHorizontalIcon />}
                        name="flip horizontal"
                        onClick={handleFlipHorizontal}
                    />
                    <ImagePreviewButtonAction
                        Icon={<FlipVerticalIcon />}
                        name="flip vertical"
                        onClick={handleFlipVertical}
                    />
                    <DownloadButton
                        fileName={downloadImage.fileName}
                        fileType={downloadImage.fileType}
                        fileUrl={downloadImage.fileUrl}
                        imageRef={imageRef}
                        name="download"
                    />
                </Card>
            </div>
        )
    }
)

export const ImagePreviewPanel = forwardRef<
    HTMLDivElement,
    ImagePreviewPanelProps
>(({ Images, focusIndex, scrollToIndex, scrollIntoView }, ref) => {
    if (Images.length === 1) {
        return null
    }

    return (
        <div
            className="flex items-center space-x-2 overflow-x-auto overflow-y-hidden border-r-[.5px] border-background/20 bg-gray-200 p-10 backdrop-blur duration-100 ease-in-out dark:border-slate-400/20 dark:bg-black/10 lg:h-full lg:flex-col lg:space-x-0 lg:space-y-2 lg:overflow-y-auto lg:overflow-x-hidden"
            ref={ref}
        >
            {Images.map((data, index) => (
                <div
                    className={cn(
                        `content:[''] relative flex aspect-square size-28 scroll-mb-4 scroll-mt-4 whitespace-nowrap bg-transparent ${
                            focusIndex === index
                                ? 'scale-105 duration-300 ease-in-out before:absolute before:left-1/2 before:top-[110%] before:h-1 before:w-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:lg:left-[110%] before:lg:top-1/2 before:lg:h-[40%] before:lg:w-1'
                                : 'border-none'
                        }`
                    )}
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    ref={focusIndex === index ? scrollIntoView : null}
                >
                    <img
                        alt={`Image ${index}`}
                        className="h-full w-full cursor-pointer overflow-hidden rounded-lg object-cover"
                        src={data.url}
                    />
                </div>
            ))}
        </div>
    )
})

ImagePreviewPanel.displayName = 'ImagePreviewPanel'
