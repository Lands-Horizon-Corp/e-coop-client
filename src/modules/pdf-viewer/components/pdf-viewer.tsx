import { useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PAGE_GAP = 0
const PAGE_WIDTH = 800

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

    // const estimateSize = useCallback(() => {
    //     return Math.round(PAGE_WIDTH * 1.214)
    // }, [])

    const virtualizer = useVirtualizer({
        count: numPages,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 1000 * 0.5,
        overscan: 2,
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

    function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
        setNumPages(n)
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
                                            width: PAGE_WIDTH,
                                            paddingBottom: PAGE_GAP,
                                        }}
                                    >
                                        <div className="shadow-lg bg-background rounded-lg overflow-hidden">
                                            <Page
                                                pageNumber={
                                                    virtualItem.index + 1
                                                }
                                                renderAnnotationLayer={true}
                                                renderTextLayer={true}
                                                width={PAGE_WIDTH}
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
            </div>
        </div>
    )
}
