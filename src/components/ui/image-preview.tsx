// External Libraries
import * as React from 'react'
import * as ImagePreviewPrimitive from '@radix-ui/react-dialog'
import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
    X,
    ChevronLeftIcon,
    ChevronRightIcon,
    ZoomIn,
    ZoomOut,
    FlipHorizontal,
    FlipVertical,
    DownloadIcon,
} from 'lucide-react'

// Local Components
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    useCarousel,
} from '@/components/ui/carousel'
import { Card } from './card'
import { Button } from './button'
import {
    PowerResetIcon,
    RotateLeftIcon,
    RotateRightIcon,
} from '@/components/icons'

// Utility Functions
import { cn } from '@/lib/utils'
import { formatBytes, formatDate } from '@/helpers'

// Store/State Management
import { useImagePreview } from '@/store/image-preview-store'

// Types
import { type CarouselApi } from '@/components/ui/carousel'
import {
    DownloadProps,
    ImageContainerProps,
    ImagePreviewPanelProps,
    ImagePreviewActionProps,
    ImagePreviewButtonActionProps,
} from '@/types'
import { Dialog, DialogContent, DialogTitle } from './dialog'

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]

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

const ImagePreviewPrevious = React.forwardRef<
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

const ImagePreviewNext = React.forwardRef<
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
    }, [scale])

    useEffect(() => {
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
    }, [isDragging, startPosition])

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
            <p className="py-1 text-xs">{media.fileName}</p>
            <div className="flex items-center justify-center">
                <img
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
                        {formatBytes(media.fileSize)}
                    </p>
                    <p className="text-xs">{formatDate(media.createdAt)}</p>
                </div>
            </div>
        </div>
    )
}

const ImagePreviewButtonAction = React.forwardRef<
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

const ImagePreviewActions = React.forwardRef<
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

const ImagePreviewPanel = ({
    Images,
    focusIndex,
    scrollToIndex,
}: ImagePreviewPanelProps) => {
    if (!Images.length) {
        return (
            <div className="flex h-fit w-full items-center justify-center p-5 text-gray-500">
                No images available
            </div>
        )
    }

    if (Images.length === 1) {
        return null
    }

    return (
        <div className="fit flex w-full max-w-full items-center space-x-2 overflow-x-auto overflow-y-hidden border-r-[.5px] border-background/20 bg-green-500 bg-transparent p-5 backdrop-blur duration-100 ease-in-out dark:border-slate-400/20 lg:h-full lg:w-[10rem] lg:max-w-[10rem] lg:flex-col lg:space-x-0 lg:space-y-2 lg:overflow-y-auto lg:py-5">
            {Images.map((data, index) => (
                <Card
                    onClick={() => scrollToIndex(index)}
                    className={cn(
                        `flex aspect-square size-20 whitespace-nowrap ${focusIndex === index ? 'scale-110 border-[1.5px] border-primary' : 'border-none opacity-20'}`
                    )}
                    key={index}
                    tabIndex={index}
                >
                    <img
                        className="h-full w-full cursor-pointer overflow-hidden rounded-lg object-cover"
                        src={data.url}
                        alt={`Image ${index}`}
                    />
                </Card>
            ))}
        </div>
    )
}

const ImagePreviewModal = () => {
    const [api, setApi] = useState<CarouselApi | undefined>()
    const [scale, setScale] = useState(1)
    const [rotateDegree, setRotateDegree] = useState(0)
    const [flipScale, setFlipScale] = useState('')
    const imageRef = useRef<HTMLImageElement | null>(null)

    const { onClose, isOpen, ImagePreviewData, focusIndex, setFocusIndex } =
        useImagePreview()

    const {
        hideCloseButton,
        closeButtonClassName,
        className,
        Images,
        scaleInterval = 1,
    } = ImagePreviewData

    const [downloadImage, setDownloadImage] = useState<DownloadProps>({
        fileName: Images?.[0]?.fileName ?? '',
        fileUrl: Images?.[0]?.url ?? '',
        fileType: Images?.[0]?.fileType ?? '',
    })

    const options: CarouselOptions = {
        align: 'center',
        watchDrag: false,
        dragFree: false,
    }

    const handleZoomIn = () => {
        if (!scaleInterval) return
        if (scale < 4) setScale((prevScale) => prevScale + scaleInterval)
    }

    const handleZoomOut = () => {
        if (!scaleInterval) return
        setScale((prevScale) => Math.max(prevScale - scaleInterval, 1))
    }

    const handleRotateLeft = () => {
        setRotateDegree((prev) => prev + 10)
    }

    const handleRotateRight = () => {
        setRotateDegree((prev) => prev - 10)
    }

    const handleFlipHorizontal = () => {
        setFlipScale((prev) =>
            prev === 'scaleX(-1)' ? 'scaleX(1)' : 'scaleX(-1)'
        )
    }

    const handleFlipVertical = () => {
        setFlipScale((prev) =>
            prev === 'scaleY(-1)' ? 'scaleY(1)' : 'scaleY(-1)'
        )
    }

    const handleResetActionState = () => {
        setRotateDegree(0)
        setScale(1)
        setFlipScale('')
    }

    const handleSelect = useCallback(() => {
        if (api) {
            const selectedIndex = api.selectedScrollSnap()
            setFocusIndex(selectedIndex)
        }
    }, [api, setFocusIndex])

    const scrollToIndex = useCallback(
        (index: number) => {
            if (api) {
                api.scrollTo(index)
            }
        },
        [api]
    )

    useEffect(() => {
        if (api && focusIndex !== undefined && Images) {
            api.scrollTo(focusIndex)
            const ImageToDownload = Images[focusIndex]
            if (!ImageToDownload) return
            setDownloadImage({
                fileName: ImageToDownload.fileName || '',
                fileUrl: ImageToDownload.url || '',
                fileType: ImageToDownload.fileType || '',
            })
            if (imageRef.current) {
                imageRef.current.src = ImageToDownload.url
            }
        }
    }, [api, focusIndex, Images])

    useEffect(() => {
        if (!api) {
            return
        }
        api.on('select', handleSelect)
    }, [api, handleSelect])

    const isMultipleImage = (Images?.length ?? 0) > 1

    if (!Images) return

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(isOpen) => {
                    if (!isOpen) handleResetActionState()
                    onClose()
                }}
            >
                <DialogContent className="!h-max-[100vh] h-full w-full max-w-[100vw] border-0 bg-transparent">
                    <DialogTitle />
                    <div
                        id="overlay"
                        className={cn(
                            'fixed left-[50%] top-[50%] z-50 flex h-full w-full translate-x-[-50%] translate-y-[-50%] flex-col-reverse border shadow-lg backdrop-blur duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] lg:flex-row',
                            className
                        )}
                    >
                        <ImagePreviewActions
                            className="w-full lg:w-fit"
                            imageRef={imageRef}
                            downloadImage={downloadImage}
                            handleResetActionState={handleResetActionState}
                            handleRotateRight={handleRotateRight}
                            handleRotateLeft={handleRotateLeft}
                            handleZoomIn={handleZoomIn}
                            handleZoomOut={handleZoomOut}
                            handleFlipHorizontal={handleFlipHorizontal}
                            handleFlipVertical={handleFlipVertical}
                        />
                        {Images && (
                            <ImagePreviewPanel
                                focusIndex={focusIndex}
                                Images={Images}
                                scrollToIndex={scrollToIndex}
                            />
                        )}
                        <div className="flex w-full items-center justify-center">
                            <Carousel
                                opts={options}
                                setApi={setApi}
                                className="flex h-fit w-full max-w-4xl justify-center bg-transparent"
                            >
                                <CarouselContent className="">
                                    {Images?.map((data, index) => {
                                        return (
                                            <CarouselItem
                                                className="flex items-center justify-center"
                                                key={index}
                                            >
                                                <ImageContainer
                                                    flipScale={flipScale}
                                                    rotateDegree={rotateDegree}
                                                    scale={scale}
                                                    media={data}
                                                    imageRef={imageRef}
                                                ></ImageContainer>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>
                                <ImagePreviewPrevious className={`border-0`} />
                                <ImagePreviewNext
                                    className={`${isMultipleImage ? '' : 'hidden'} border-0`}
                                />
                            </Carousel>
                            {!hideCloseButton && (
                                <ImagePreviewPrimitive.Close
                                    onClick={handleResetActionState}
                                    className={cn(
                                        'absolute right-5 top-5 size-8 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                                        closeButtonClassName
                                    )}
                                >
                                    <X className="size-full" />
                                    <span className="sr-only">Close</span>
                                </ImagePreviewPrimitive.Close>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ImagePreviewModal
