import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { IS_STAGING } from '@/constants'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
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

export default function PdfViewer({ file, fileName, onClose }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [goToInput, setGoToInput] = useState('')
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [fileUrl, setFileUrl] = useState<string | null>() // only usable if file is File
    const parentRef = useRef<HTMLDivElement>(null)

    // FOR password shit
    const passwordNeeded = useModalState()
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const passwordCallbackRef = useRef<((password: string) => void) | null>(
        null
    )

    // Pang sizing
    const pageSizesRef = useRef<number[]>([])
    const pdfDocRef = useRef<null | DocumentCallback>(null)

    // const estimateSize = useCallback(() => {
    //     return Math.round(DEFAULT_PAGE_WIDTH * 1.214)
    // }, [])
    const estimateSize = useCallback((index: number) => {
        return (
            pageSizesRef.current[index] ||
            Math.round(DEFAULT_PAGE_WIDTH * 1.414)
        )
    }, [])

    const virtualizer = useVirtualizer({
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
        const items = virtualizer.getVirtualItems()
        if (items.length > 0) {
            const scrollEl = parentRef.current
            if (!scrollEl) return
            const scrollCenter = scrollEl.scrollTop + scrollEl.clientHeight / 2
            for (const item of items) {
                if (
                    scrollCenter >= item.start &&
                    scrollCenter < item.start + item.size
                ) {
                    setCurrentPage(item.index + 1)
                    break
                }
            }
        }
    }, [virtualizer.getVirtualItems()])

    const scrollToPage = (page: number) => {
        const clamped = Math.max(1, Math.min(page, numPages))
        setCurrentPage(clamped)
        virtualizer.scrollToIndex(clamped - 1, { align: 'start' })
    }

    const handleGoTo = () => {
        const page = parseInt(goToInput, 10)
        if (!isNaN(page)) {
            scrollToPage(page)
            setPopoverOpen(false)
            setGoToInput('')
        }
    }

    const handlePrint = () => {
        if (!fileUrl) return

        const printPromise = new Promise<void>((resolve, reject) => {
            try {
                const iframe = document.createElement('iframe')
                iframe.style.display = 'none'
                iframe.src = fileUrl

                iframe.onload = () => {
                    try {
                        iframe.contentWindow?.print()
                        setTimeout(() => {
                            document.body.removeChild(iframe)
                            resolve()
                        }, 1000)
                    } catch (err) {
                        reject(err)
                    }
                }

                iframe.onerror = () => reject(new Error('Failed to load file'))

                document.body.appendChild(iframe)
            } catch (err) {
                reject(err)
            }
        })

        toast.promise(printPromise, {
            loading: 'Preparing document...',
            success: 'Print dialog opened.',
            error: 'Failed to print document.',
        })
    }

    async function onDocumentLoadSuccess(pdf: DocumentCallback) {
        const n = pdf.numPages
        pdfDocRef.current = pdf
        passwordNeeded.onOpenChange(false)
        setPasswordError(false)

        // Measure actual dimensions of every page
        const sizes: number[] = []
        for (let i = 1; i <= n; i++) {
            const page = await pdf.getPage(i)
            const viewport = page.getViewport({ scale: 1 })
            const scale = DEFAULT_PAGE_WIDTH / viewport.width
            sizes.push(Math.round(viewport.height * scale))
        }
        pageSizesRef.current = sizes
        setNumPages(n)

        // Tell virtualizer to re-measure with real sizes
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

    // if (!file) return null

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
            <div
                className="flex-1 overflow-auto ecoop-scroll bg-muted"
                ref={parentRef}
            >
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
                    <ButtonGroup className="">
                        <Button
                            className="rounded-lg cursor-pointer"
                            onClick={handlePrint}
                            size="sm"
                            variant="secondary"
                        >
                            <Printer className="h-4 w-4" />
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup className="flex">
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
                {file ? (
                    <Document
                        file={file}
                        loading={
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                Loading PDF…
                            </div>
                        }
                        onLoadSuccess={onDocumentLoadSuccess}
                        onPassword={handlePassword}
                    >
                        <div
                            className="mx-auto"
                            style={{
                                height: virtualizer.getTotalSize(),
                                position: 'relative',
                            }}
                        >
                            {virtualizer
                                .getVirtualItems()
                                .map((virtualItem) => (
                                    <div
                                        key={virtualItem.index}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: `translateX(-50%) translateY(${virtualItem.start}px)`,
                                            width: DEFAULT_PAGE_WIDTH,
                                        }}
                                    >
                                        <div className="shadow-lg bg-background rounded-lg overflow-hidden">
                                            <Page
                                                pageNumber={
                                                    virtualItem.index + 1
                                                }
                                                renderAnnotationLayer={true}
                                                renderTextLayer={true}
                                                width={DEFAULT_PAGE_WIDTH}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </Document>
                ) : (
                    <p className="w-fit mx-auto text-sm text-muted-foreground/70">
                        No selected PDF file
                    </p>
                )}
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
                        <Popover
                            onOpenChange={setPopoverOpen}
                            open={popoverOpen}
                        >
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
                                        onChange={(e) =>
                                            setGoToInput(e.target.value)
                                        }
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
                    {/* <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
                        <Button
                            className="rounded-lg cursor-pointer"
                            onClick={handlePrint}
                            size="sm"
                            variant="secondary"
                        >
                            <Printer className="h-4 w-4" />
                        </Button>
                    </ButtonGroup> */}
                </div>

                {/* FOR password desu */}
                <Dialog
                    onOpenChange={(open) => {
                        if (!open) {
                            passwordNeeded.onOpenChange(false)
                            onClose?.()
                        }
                    }}
                    open={passwordNeeded.open}
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
                                onChange={(e) =>
                                    setPasswordValue(e.target.value)
                                }
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
            </div>
        </div>
    )
}
