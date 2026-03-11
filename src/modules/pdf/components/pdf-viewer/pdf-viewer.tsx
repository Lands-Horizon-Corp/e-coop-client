import { useCallback, useEffect, useRef, useState } from 'react'

import { IS_STAGING } from '@/constants'
import { cn } from '@/helpers'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { IClassProps } from '@/types'

import {
    PDFFooterControl,
    PdfPasswordDialog,
    PdfPasswordRequired,
} from './pdf-components'

// UGLY SHIT To be enhanced later
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

    defaultScale?: number
    minScale?: number
    maxScale?: number
    zoomStep?: number
}

// DEFAULTS
const DEFAULT_PAGE_WIDTH = 800
const DEFAULT_ESTIMATE = 1122

const PdfViewer = ({
    file,
    fileName,
    pageWidth = DEFAULT_PAGE_WIDTH,
    className,

    defaultScale = 1,
    minScale = 0.25,
    maxScale = 5,
    zoomStep = 0.25,
    onClose,
}: PdfViewerProps) => {
    const fileTitle = file instanceof File ? file.name : fileName || 'PDF View'

    const [numPages, setNumPages] = useState(0)
    const [firstPageHeight, setFirstPageHeight] = useState<number | null>(null)
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer<Element, Element>({
        count: numPages,
        getScrollElement: () => parentRef.current,
        estimateSize: () => firstPageHeight ?? DEFAULT_ESTIMATE,
        overscan: 2,
    })

    // file pang resolve
    const [fileUrl, setFileUrl] = useState<string | null>(null)

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

    // pang password shit
    const [passwordNeeded, setPasswordNeeded] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const passwordCallbackRef = useRef<((pw: string) => void) | null>(null)

    const handlePassword = useCallback(
        (callback: (password: string) => void, reason: number) => {
            // reason: 1 = need password, 2 = incorrect password
            passwordCallbackRef.current = callback
            setPasswordNeeded(true)
            setPasswordError(reason === 2)
            setCancelled(false)

            console.log(reason)
        },
        []
    )

    const handlePasswordSubmit = useCallback((password: string) => {
        passwordCallbackRef.current?.(password)
    }, [])

    const handlePasswordCancel = useCallback(() => {
        setPasswordNeeded(false)
        setPasswordError(false)
        setCancelled(true)
        passwordCallbackRef.current = null
    }, [])

    const handleRetry = useCallback(() => {
        setCancelled(false)
        setPasswordNeeded(true)
        setPasswordError(false)
    }, [])

    // pang zooming (scale) shit
    const [scale, setScale] = useState(defaultScale)
    useEffect(() => {
        const el = parentRef.current
        if (!el) return

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey && !e.metaKey) return
            e.preventDefault()
            const delta = -Math.sign(e.deltaY) * zoomStep
            setScale((s) => {
                const next = Math.round((s + delta) * 100) / 100
                return Math.max(minScale, Math.min(maxScale, next))
            })
        }

        el.addEventListener('wheel', handleWheel, { passive: false })
        return () => el.removeEventListener('wheel', handleWheel)
    }, [zoomStep, minScale, maxScale])

    if (!file) return null

    return (
        <div
            className={cn(
                'overflow-y-auto overflow-x-auto relative ecoop-scroll',
                className
            )}
            ref={parentRef}
        >
            {cancelled ? (
                <div
                    className={cn(
                        'flex items-center justify-center',
                        className
                    )}
                >
                    <PdfPasswordRequired
                        onCancel={() => onClose?.()}
                        onRetry={handleRetry}
                    />
                </div>
            ) : (
                <>
                    <Document
                        file={file}
                        loading={
                            <div className="flex items-center min-h-full justify-center p-8 text-muted-foreground">
                                Loading PDF…
                            </div>
                        }
                        onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages)
                            setFirstPageHeight(null)
                            setPasswordNeeded(false)
                            setPasswordError(false)
                        }}
                        onPassword={handlePassword}
                    >
                        <div
                            className="relative w-fit min-w-full"
                            style={{ height: virtualizer.getTotalSize() }}
                        >
                            {virtualizer.getVirtualItems().map((virtualRow) => (
                                <div
                                    className="absolute left-0 w-fit min-w-full flex justify-center py-2"
                                    data-index={virtualRow.index}
                                    key={virtualRow.key}
                                    ref={virtualizer.measureElement}
                                    style={{
                                        top: virtualRow.start,
                                    }}
                                >
                                    <Page
                                        loading={
                                            <div
                                                className="bg-muted animate-pulse rounded"
                                                style={{
                                                    height:
                                                        firstPageHeight ??
                                                        DEFAULT_ESTIMATE,
                                                    width: pageWidth ?? 612,
                                                }}
                                            />
                                        }
                                        onRenderSuccess={(page) => {
                                            if (
                                                virtualRow.index === 0 &&
                                                firstPageHeight === null
                                            ) {
                                                setFirstPageHeight(page.height)
                                            }
                                        }}
                                        pageNumber={virtualRow.index + 1}
                                        scale={scale}
                                        width={pageWidth}
                                    />
                                </div>
                            ))}
                        </div>
                    </Document>
                    <PDFFooterControl
                        className="z-50"
                        fileTitle={fileTitle}
                        fileUrl={fileUrl}
                        numPages={numPages}
                        onClose={onClose}
                        scrollRef={parentRef}
                        virtualizer={virtualizer}
                    />
                </>
            )}

            <PdfPasswordDialog
                error={passwordError}
                onCancel={handlePasswordCancel}
                onSubmit={handlePasswordSubmit}
                open={passwordNeeded}
            />
        </div>
    )
}

export default PdfViewer
