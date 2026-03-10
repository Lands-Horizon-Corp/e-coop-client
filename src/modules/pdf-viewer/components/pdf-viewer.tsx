import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { IS_STAGING } from '@/constants'
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

const PAGE_GAP = 12
const DEFAULT_PAGE_WIDTH = 800

if (!IS_STAGING) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`
} else {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
    ).toString()
}

interface PdfViewerProps {
    file: File | string
    fileName?: string
    onClose?: () => void
}

const Header = memo(function Header({
    fileTitle,
    onClose,
    onPrint,
}: {
    fileTitle: string
    onClose?: () => void
    onPrint: () => void
}) {
    return (
        <div className="flex items-center sticky z-9 top-0 gap-x-2 justify-end px-4 py-2">
            <ButtonGroup className="flex">
                <Button
                    className="rounded-lg text-sm cursor-pointer"
                    disabled
                    size="sm"
                    variant="secondary"
                >
                    {fileTitle}
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    className="rounded-lg cursor-pointer"
                    onClick={onPrint}
                    size="sm"
                    variant="secondary"
                >
                    <Printer className="h-4 w-4" />
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    className="rounded-lg cursor-pointer"
                    onClick={() => onClose?.()}
                    size="sm"
                    variant="secondary"
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </ButtonGroup>
        </div>
    )
})

const VirtualPages = memo(function VirtualPages({
    virtualizer,
    // pageHeights,
    containerWidth,
}: {
    virtualizer: Virtualizer<HTMLDivElement, Element>
    pageHeights: number[]
    containerWidth: number
}) {
    return (
        <div
            className="mx-auto"
            style={{
                height: virtualizer.getTotalSize(),
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
                        width: containerWidth,
                    }}
                >
                    <div className="shadow-lg bg-background rounded-lg overflow-hidden">
                        <Page
                            pageNumber={virtualItem.index + 1}
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                            width={containerWidth}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
})

const FooterControls = memo(function FooterControls({
    currentPage,
    numPages,
    scrollToPage,
}: {
    currentPage: number
    numPages: number
    scrollToPage: (p: number) => void
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
        <div className="mx-auto px-2 py-2 w-fit flex items-center sticky bottom-5 justify-center gap-2">
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
        <Dialog
            onOpenChange={(open) => {
                if (!open) onClose?.()
            }}
            open={open}
        >
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

export default function PdfViewer({ file, fileName, onClose }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [containerWidth, setContainerWidth] = useState(DEFAULT_PAGE_WIDTH)
    const [pageHeights, setPageHeights] = useState<number[]>([])

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
        const el = parentRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                setContainerWidth(Math.floor(entry.contentRect.width))
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

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
            const scale = containerWidth / viewport.width
            heights.push(Math.round(viewport.height * scale))
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

    const fileTitle = file instanceof File ? file.name : fileName || 'PDF View'

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
            <div
                className="flex-1 overflow-auto p-8 will-change-transform ecoop-scroll bg-muted"
                ref={parentRef}
            >
                <Header
                    fileTitle={fileTitle}
                    onClose={onClose}
                    onPrint={handlePrint}
                />
                {fileUrl ? (
                    <Document
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
                            containerWidth={containerWidth}
                            pageHeights={pageHeights}
                            virtualizer={virtualizer}
                        />
                    </Document>
                ) : (
                    <p className="w-fit mx-auto text-sm text-muted-foreground/70">
                        No selected PDF file
                    </p>
                )}
                <FooterControls
                    currentPage={currentPage}
                    numPages={numPages}
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
