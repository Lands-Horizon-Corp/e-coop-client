import * as React from 'react'

import { cn } from '@/helpers'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export interface IMedia {
    id: string | number
    file_name: string
    file_size: number
    file_type: string
    storage_key: string
    bucket_name: string
    download_url: string
    description?: string
    progress?: number
}

type ImageSource = IMedia | string

function getSrc(image: ImageSource): string {
    return typeof image === 'string' ? image : image.download_url
}

function getAlt(image: ImageSource, index: number): string {
    if (typeof image === 'string') return `Image ${index + 1}`
    return image.description ?? image.file_name ?? `Image ${index + 1}`
}

interface ImagePreviewCarouselProps {
    images: IMedia[] | string[]
    initialIndex?: number
    open: boolean

    onOpenChange: (open: boolean) => void
}

export function ImagePreviewCarousel({
    images,
    initialIndex = 0,
    open,

    onOpenChange,
}: ImagePreviewCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const thumbRefs = React.useRef<(HTMLButtonElement | null)[]>([])
    const thumbStripRef = React.useRef<HTMLDivElement>(null)

    const total = images.length

    React.useEffect(() => {
        if (!api) return
        const onSelect = () => setCurrentIndex(api.selectedScrollSnap())
        api.on('select', onSelect)
        return () => {
            api.off('select', onSelect)
        }
    }, [api])

    React.useEffect(() => {
        if (open && api) {
            api.scrollTo(initialIndex, true)
            setCurrentIndex(initialIndex)
        }
        if (open && !api) {
            setCurrentIndex(initialIndex)
        }
    }, [open, api, initialIndex])

    React.useEffect(() => {
        const thumb = thumbRefs.current[currentIndex]
        if (thumb) {
            thumb.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            })
        }
    }, [currentIndex])

    const goTo = (index: number) => {
        api?.scrollTo(index)
    }

    const goPrev = () => api?.scrollPrev()
    const goNext = () => api?.scrollNext()

    useHotkeys(
        'right',
        () => {
            goNext()
        },
        [goNext]
    )

    useHotkeys(
        'left',
        () => {
            goPrev()
        },
        [goPrev]
    )

    const currentImage = images[currentIndex]

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent
                className={cn(
                    ' bg-black/70 border-none shadown-none flex flex-col !w-scren !h-screen p-0 !max-w-none '
                    // 'fixed',
                    // 'translate-x-0 translate-y-0',
                    // 'max-w-none w-screen h-screen p-0 border-0 rounded-none',
                )}
                closeButtonClassName="hidden"
                overlayClassName="p-0 backdrop-blur-sm"
            >
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-30% from-black/60 to-transparent">
                    <span className="text-sm text-white/80 font-medium select-none truncate max-w-xs">
                        {getAlt(currentImage as ImageSource, currentIndex)}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        {total > 1 && (
                            <span className="rounded-full bg-black/50 px-3 py-0.5 text-xs text-white/70 select-none">
                                {currentIndex + 1} / {total}
                            </span>
                        )}
                        <button
                            className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                            onClick={() => onOpenChange(false)}
                            title="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-1 items-center min-h-0">
                    {total > 1 && (
                        <button
                            aria-label="Previous image"
                            className="absolute left-3 z-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            onClick={goPrev}
                        >
                            <ChevronLeft className="h-7 w-7" />
                        </button>
                    )}

                    <Carousel
                        className="w-full h-full"
                        opts={{ loop: true, startIndex: initialIndex }}
                        setApi={setApi}
                    >
                        <CarouselContent className="h-full -ml-0">
                            {(images as ImageSource[]).map((img, i) => (
                                <CarouselItem
                                    className="flex items-center justify-center h-full pl-0"
                                    key={i}
                                >
                                    <div className="flex items-center justify-center w-full h-full px-16 py-2">
                                        <img
                                            alt={getAlt(img, i)}
                                            className="object-contain rounded-md select-none"
                                            draggable={false}
                                            src={getSrc(img)}
                                            style={{
                                                maxWidth: 'min(90vw, 1200px)',
                                                maxHeight:
                                                    'calc(100vh - 160px)',
                                                width: 'auto',
                                                height: 'auto',
                                            }}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    {total > 1 && (
                        <button
                            aria-label="Next image"
                            className="absolute right-3 z-20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            onClick={goNext}
                        >
                            <ChevronRight className="h-7 w-7" />
                        </button>
                    )}
                </div>

                {total > 1 && (
                    <div className="flex-shrink-0 flex justify-center py-3 bg-gradient-to-t from-black/60 to-transparent">
                        <div
                            className="flex gap-2 px-4 overflow-x-auto"
                            ref={thumbStripRef}
                            style={{
                                maxWidth: 'min(90vw, 700px)',
                                scrollbarWidth: 'none',
                            }}
                        >
                            {(images as ImageSource[]).map((img, i) => (
                                <button
                                    aria-label={`View image ${i + 1}`}
                                    className={cn(
                                        'flex-shrink-0 rounded overflow-hidden transition-all duration-150',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                                        i === currentIndex
                                            ? 'ring-2 ring-white opacity-100 scale-105'
                                            : 'opacity-50 hover:opacity-80'
                                    )}
                                    key={i}
                                    onClick={() => goTo(i)}
                                    ref={(el) => {
                                        thumbRefs.current[i] = el
                                    }}
                                    style={{ width: 52, height: 40 }}
                                >
                                    <img
                                        alt={getAlt(img, i)}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                        src={getSrc(img)}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
