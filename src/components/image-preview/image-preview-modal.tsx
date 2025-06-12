import { cn } from '@/lib'
import { useImagePreview } from '@/store/image-preview-store'
import { DownloadProps } from '@/types'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
    CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
} from '../ui/carousel'
import {
    CarouselOptions,
    ImageContainer,
    ImagePreviewActions,
    ImagePreviewNext,
    ImagePreviewPanel,
    ImagePreviewPrevious,
} from './image-preview'
import * as ImagePreviewPrimitive from '@radix-ui/react-dialog'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

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
        fileName: Images?.[0]?.file_name ?? '',
        fileUrl: Images?.[0]?.url ?? '',
        fileType: Images?.[0]?.file_type ?? '',
    })

    const options: CarouselOptions = {
        align: 'center',
        watchDrag: false,
        dragFree: false,
        dragThreshold: 5,
        loop: true,
        slidesToScroll: 'auto',
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
    const scrollIntoView = useRef<HTMLDivElement>(null)

    const handleSelect = useCallback(() => {
        if (api) {
            const selectedIndex = api.selectedScrollSnap()
            setFocusIndex(selectedIndex)
            handleResetActionState()
        }
        if (scrollIntoView.current) {
            scrollIntoView.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            })
        }
    }, [api, setFocusIndex, scrollIntoView])

    const scrollToIndex = useCallback(
        (index: number) => {
            if (api) {
                api.scrollTo(index)
            }
        },
        [api]
    )

    useEffect(() => {
        if (api) {
            api.on('select', handleSelect)
            if (focusIndex !== undefined && Images) {
                api.scrollTo(focusIndex)
                const ImageToDownload = Images[focusIndex]
                if (!ImageToDownload) return
                setDownloadImage({
                    fileName: ImageToDownload.file_name || '',
                    fileUrl: ImageToDownload.url || '',
                    fileType: ImageToDownload.file_type || '',
                })
                if (imageRef.current) {
                    imageRef.current.src = ImageToDownload.url
                }
            }
        }
    }, [api, focusIndex, Images, handleSelect])

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
                <DialogContent
                    className={cn(
                        '!h-max-[100vh] h-full w-full max-w-[100vw] bg-transparent'
                    )}
                >
                    <DialogTitle />
                    <div
                        id="overlay"
                        className={cn(
                            'fixed left-[50%] top-[50%] z-50 flex h-full w-full translate-x-[-50%] translate-y-[-50%] flex-col-reverse border shadow-lg backdrop-blur duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] lg:flex-row',
                            className
                        )}
                    >
                        <ImagePreviewActions
                            className="z-20 w-full lg:w-fit"
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
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel
                                maxSize={30}
                                minSize={10}
                                defaultSize={10}
                            >
                                {Images && (
                                    <ImagePreviewPanel
                                        focusIndex={focusIndex}
                                        Images={Images}
                                        scrollToIndex={scrollToIndex}
                                        scrollIntoView={scrollIntoView}
                                    />
                                )}
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={10} defaultSize={90}>
                                <div className="flex h-full w-full items-center justify-center bg-black/20 dark:bg-transparent">
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
                                                            flipScale={
                                                                flipScale
                                                            }
                                                            rotateDegree={
                                                                rotateDegree
                                                            }
                                                            scale={scale}
                                                            media={data}
                                                            imageRef={imageRef}
                                                        ></ImageContainer>
                                                    </CarouselItem>
                                                )
                                            })}
                                        </CarouselContent>
                                        <ImagePreviewPrevious
                                            className={`border-0`}
                                        />
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
                                            <span className="sr-only">
                                                Close
                                            </span>
                                        </ImagePreviewPrimitive.Close>
                                    )}
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default ImagePreviewModal
