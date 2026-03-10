import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { IS_STAGING } from '@/constants'
import { cn } from '@/helpers'
import { Virtualizer, useVirtualizer } from '@tanstack/react-virtual'
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { DocumentCallback } from 'react-pdf/dist/shared/types.js'

import { ShieldLockIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

const PAGE_GAP = 12
const DEFAULT_PAGE_WIDTH = 800
// const ZOOM_STEP = 0.1
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3

if (!IS_STAGING) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`
} else {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
    ).toString()
}

interface PdfViewerProps extends IClassProps {
    file: File | string
    fileName?: string
    onClose?: () => void
    pageWidth?: number
}

const VirtualPages = memo(function VirtualPages({
    virtualizer,
    pageWidth,
    scale,
}: {
    virtualizer: Virtualizer<HTMLDivElement, Element>
    pageHeights: number[]
    pageWidth: number
    scale: number
}) {
    return (
        <div
            style={{
                height: virtualizer.getTotalSize(),
                minWidth: pageWidth * scale,
                position: 'relative',
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => (
                <div
                    key={virtualItem.index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: `translateX(-50%) translateY(${virtualItem.start}px)`,
                        width: pageWidth * scale,
                    }}
                >
                    <div className="shadow-lg rounded-lg overflow-hidden">
                        <Page
                            pageNumber={virtualItem.index + 1}
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                            width={pageWidth * scale}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
})

const PDFFooterControl = memo(function FooterControls({
    currentPage,
    numPages,
    fileTitle,
    onPrint,
    onClose,
    scrollToPage,
}: {
    currentPage: number
    numPages: number
    scrollToPage: (p: number) => void
    fileTitle: string
    onClose?: () => void
    onPrint: () => void
}) {
    const [goToInput, setGoToInput] = useState('')
    const [popoverOpen, setPopoverOpen] = useState(false)

    const handleGoTo = () => {
        const page = parseInt(goToInput, 10)
        if (!isNaN(page)) {
            scrollToPage(page)
            setPopoverOpen(false)
            setGoToInput('')
        }
    }

    return (
        <div className="mx-auto px-2 py-2 w-fit flex items-center sticky left-1/2 -translate-x-1/2 bottom-0 gap-2">
            <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={currentPage <= 1}
                    onClick={() => scrollToPage(currentPage - 1)}
                    size="sm"
                    variant="secondary"
                >
                    <ChevronLeft />
                </Button>
                <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            className="cursor-pointer"
                            size="sm"
                            variant="secondary"
                        >
                            {currentPage} / {numPages || '–'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" side="top">
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleGoTo()
                            }}
                        >
                            <Input
                                autoFocus
                                className="h-8"
                                max={numPages}
                                min={1}
                                onChange={(e) => setGoToInput(e.target.value)}
                                placeholder="Page"
                                type="number"
                                value={goToInput}
                            />
                            <Button
                                className="cursor-pointer"
                                size="sm"
                                type="submit"
                                variant="ghost"
                            >
                                Go
                            </Button>
                        </form>
                    </PopoverContent>
                </Popover>
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={currentPage >= numPages}
                    onClick={() => scrollToPage(currentPage + 1)}
                    size="sm"
                    variant="secondary"
                >
                    <ChevronRight />
                </Button>
            </ButtonGroup>
            <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
                <Button
                    className="rounded-lg text-sm cursor-pointer"
                    disabled
                    size="sm"
                    variant="secondary"
                >
                    {fileTitle}
                </Button>
                <Button
                    className="rounded-lg cursor-pointer"
                    onClick={onPrint}
                    size="sm"
                    variant="secondary"
                >
                    <Printer className="h-4 w-4" />
                </Button>
                <Button
                    className="rounded-lg cursor-pointer"
                    onClick={onClose}
                    size="sm"
                    variant="secondary"
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </ButtonGroup>
        </div>
    )
})

const PasswordDialog = memo(function PasswordDialog({
    open,
    onClose,
    passwordError,
    passwordValue,
    setPasswordValue,
    submitPassword,
}: {
    open: boolean
    onClose?: () => void
    passwordError: boolean
    passwordValue: string
    setPasswordValue: (v: string) => void
    submitPassword: () => void
}) {
    return (
        <Dialog onOpenChange={(open) => !open && onClose?.()} open={open}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldLockIcon className="size-4" />
                        Password Required
                    </DialogTitle>
                    <DialogDescription>
                        {passwordError
                            ? 'Incorrect password. Please try again.'
                            : 'This PDF is password protected. Enter the password to view it.'}
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        submitPassword()
                    }}
                >
                    <Input
                        autoFocus
                        onChange={(e) => setPasswordValue(e.target.value)}
                        placeholder="Enter password"
                        type="password"
                        value={passwordValue}
                    />
                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button disabled={!passwordValue} type="submit">
                            Unlock
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
})

export default function PdfViewer({
    file,
    fileName,
    className,
    pageWidth = DEFAULT_PAGE_WIDTH,
    onClose,
}: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [pageHeights, setPageHeights] = useState<number[]>([])
    const [scale, setScale] = useState(1)

    const parentRef = useRef<HTMLDivElement>(null)
    const passwordNeeded = useModalState()
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const passwordCallbackRef = useRef<((password: string) => void) | null>(
        null
    )
    const pdfDocRef = useRef<null | DocumentCallback>(null)

    const estimateSize = useCallback(
        (index: number) => pageHeights[index] || 1000,
        [pageHeights]
    )

    const virtualizer = useVirtualizer<HTMLDivElement, Element>({
        count: numPages,
        getScrollElement: () => parentRef.current,
        estimateSize,
        overscan: 2,
        gap: PAGE_GAP,
    })

    useEffect(() => {
        let url: string | null = null
        if (file instanceof File) {
            url = URL.createObjectURL(file)
            setFileUrl(url)
        } else {
            setFileUrl(file)
        }
        return () => {
            if (url) URL.revokeObjectURL(url)
        }
    }, [file])

    useEffect(() => {
        const scrollEl = parentRef.current
        if (!scrollEl) return
        let raf = 0
        const onScroll = () => {
            if (raf) return
            raf = requestAnimationFrame(() => {
                raf = 0
                const items = virtualizer.getVirtualItems()
                if (!items.length) return
                const scrollCenter =
                    scrollEl.scrollTop + scrollEl.clientHeight / 2
                for (const item of items) {
                    if (
                        scrollCenter >= item.start &&
                        scrollCenter < item.start + item.size
                    ) {
                        setCurrentPage(item.index + 1)
                        break
                    }
                }
            })
        }
        scrollEl.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            scrollEl.removeEventListener('scroll', onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [virtualizer])

    const scrollToPage = useCallback(
        (page: number) => {
            const clamped = Math.max(1, Math.min(page, numPages))
            setCurrentPage(clamped)
            virtualizer.scrollToIndex(clamped - 1, { align: 'start' })
        },
        [numPages, virtualizer]
    )

    const handlePrint = useCallback(() => {
        if (!fileUrl) return
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = fileUrl
        document.body.appendChild(iframe)
        iframe.onload = () => {
            iframe.contentWindow?.print()
            setTimeout(() => document.body.removeChild(iframe), 1000)
        }
    }, [fileUrl])

    async function onDocumentLoadSuccess(pdf: DocumentCallback) {
        const n = pdf.numPages
        pdfDocRef.current = pdf
        passwordNeeded.onOpenChange(false)
        setPasswordError(false)

        const heights: number[] = []
        for (let i = 1; i <= n; i++) {
            const page = await pdf.getPage(i)
            const viewport = page.getViewport({ scale: 1 })
            const scaleFactor = pageWidth / viewport.width
            heights.push(Math.round(viewport.height * scaleFactor * scale))
        }

        setPageHeights(heights)
        setNumPages(n)
        virtualizer.measure()
    }

    const handlePassword = useCallback(
        (callback: (password: string) => void, reason: number) => {
            passwordCallbackRef.current = callback
            passwordNeeded.onOpenChange(true)
            if (reason === 2) {
                toast.warning('Wrong password')
                setPasswordError(true)
            }
        },
        []
    )

    const submitPassword = () => {
        if (passwordCallbackRef.current && passwordValue) {
            passwordCallbackRef.current(passwordValue)
            setPasswordValue('')
        }
    }

    useEffect(() => {
        const el = parentRef.current
        if (!el) return
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault()
                setScale((prev) => {
                    const next = Math.min(
                        MAX_ZOOM,
                        Math.max(MIN_ZOOM, prev - e.deltaY * 0.001)
                    )
                    return next
                })
            }
        }
        el.addEventListener('wheel', handleWheel, { passive: false })
        return () => el.removeEventListener('wheel', handleWheel)
    }, [])

    useEffect(() => {
        const pdf = pdfDocRef.current
        if (!pdf) return

        const recalcHeights = async () => {
            const heights: number[] = []
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const viewport = page.getViewport({ scale: 1 })
                const scaleFactor = pageWidth / viewport.width
                heights.push(Math.round(viewport.height * scaleFactor * scale))
            }
            setPageHeights(heights)
            virtualizer.measure()
        }

        recalcHeights()
    }, [scale, pageWidth, virtualizer])

    useEffect(() => {
        const el = parentRef.current
        if (!el) return

        let isDragging = false
        let startX = 0
        let startY = 0
        let scrollLeft = 0
        let scrollTop = 0
        let velocityX = 0
        let velocityY = 0
        let lastTime = 0
        let lastX = 0
        let lastY = 0
        let animationFrame: number | null = null

        const friction = 0.95 
        const minVelocity = 0.1

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true
            el.style.cursor = 'grabbing'
            startX = e.pageX
            startY = e.pageY
            scrollLeft = el.scrollLeft
            scrollTop = el.scrollTop
            lastX = e.pageX
            lastY = e.pageY
            lastTime = performance.now()
            velocityX = 0
            velocityY = 0
            if (animationFrame) cancelAnimationFrame(animationFrame)
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return
            e.preventDefault()
            const dx = e.pageX - startX
            const dy = e.pageY - startY
            el.scrollLeft = scrollLeft - dx
            el.scrollTop = scrollTop - dy

            const now = performance.now()
            const dt = now - lastTime
            if (dt > 0) {
                velocityX = (e.pageX - lastX) / dt
                velocityY = (e.pageY - lastY) / dt
                lastX = e.pageX
                lastY = e.pageY
                lastTime = now
            }
        }

        const onMouseUpOrLeave = () => {
            isDragging = false
            el.style.cursor = 'grab'

            const momentum = () => {
                el.scrollLeft -= velocityX * 16 
                el.scrollTop -= velocityY * 16

                velocityX *= friction
                velocityY *= friction

                if (
                    Math.abs(velocityX) > minVelocity ||
                    Math.abs(velocityY) > minVelocity
                ) {
                    animationFrame = requestAnimationFrame(momentum)
                } else {
                    animationFrame = null
                }
            }

            if (
                Math.abs(velocityX) > minVelocity ||
                Math.abs(velocityY) > minVelocity
            ) {
                animationFrame = requestAnimationFrame(momentum)
            }
        }

        el.addEventListener('mousedown', onMouseDown)
        el.addEventListener('mousemove', onMouseMove)
        el.addEventListener('mouseup', onMouseUpOrLeave)
        el.addEventListener('mouseleave', onMouseUpOrLeave)

        return () => {
            el.removeEventListener('mousedown', onMouseDown)
            el.removeEventListener('mousemove', onMouseMove)
            el.removeEventListener('mouseup', onMouseUpOrLeave)
            el.removeEventListener('mouseleave', onMouseUpOrLeave)
            if (animationFrame) cancelAnimationFrame(animationFrame)
        }
    }, [])

    const fileTitle = file instanceof File ? file.name : fileName || 'PDF View'

    return (
        <div
            className={cn(
                'flex relative flex-col p-4 bg-background/95 min-w-full max-w-full backdrop-blur-sm',
                className
            )}
        >
            <div
                className="flex-1 overflow-auto will-change-transform max-w-full ecoop-scroll"
                ref={parentRef}
            >
                {fileUrl ? (
                    <Document
                        className="min-w-max"
                        file={fileUrl}
                        loading={
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                Loading PDF…
                            </div>
                        }
                        onLoadSuccess={onDocumentLoadSuccess}
                        onPassword={handlePassword}
                    >
                        <VirtualPages
                            pageHeights={pageHeights}
                            pageWidth={pageWidth}
                            scale={scale}
                            virtualizer={virtualizer}
                        />
                    </Document>
                ) : (
                    <p className="w-fit mx-auto text-sm text-muted-foreground/70">
                        No selected PDF file
                    </p>
                )}
                <PDFFooterControl
                    currentPage={currentPage}
                    fileTitle={fileTitle}
                    numPages={numPages}
                    onClose={onClose}
                    onPrint={handlePrint}
                    scrollToPage={scrollToPage}
                />
                <PasswordDialog
                    onClose={() => {
                        passwordNeeded.onOpenChange(false)
                        onClose?.()
                    }}
                    open={passwordNeeded.open}
                    passwordError={passwordError}
                    passwordValue={passwordValue}
                    setPasswordValue={setPasswordValue}
                    submitPassword={submitPassword}
                />
            </div>
        </div>
    )
}
