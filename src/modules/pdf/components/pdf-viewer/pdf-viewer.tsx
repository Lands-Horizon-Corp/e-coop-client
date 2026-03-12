import { useCallback, useEffect, useRef, useState } from 'react'

import { IS_STAGING } from '@/constants'
import { cn } from '@/helpers'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { DocumentCallback } from 'react-pdf/dist/shared/types.js'

import { FileQuestionIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import {
    PdfFooterControl,
    PdfFooterProps,
    PdfHeaderProps,
    PdfHeaderTitle,
    PdfPasswordDialog,
    PdfPasswordRequired,
    PdfSkeletonPage,
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

export interface PdfViewerProps
    extends IClassProps, PdfHeaderProps, PdfFooterProps {
    file?: File | string | null
    fileName?: string
    onClose?: () => void
    pageWidth?: number

    defaultScale?: number
    minScale?: number
    maxScale?: number
    zoomStep?: number

    hideHeader?: boolean

    hideFooterControl?: boolean
    onPdfLoadSuccess?: ({ document }: { document: DocumentCallback }) => void
}

// DEFAULTS
const DEFAULT_PAGE_WIDTH = 800
const DEFAULT_ESTIMATE = 1122

const PdfViewer = ({
    file,
    fileName,
    pageWidth = DEFAULT_PAGE_WIDTH,
    className,

    hideHeader = false,
    canDownload = true,
    canPrint = true,
    onPrint,

    hideFooterControl = false,
    canPaginate = true,
    canZoom = true,

    defaultScale = 1,
    minScale = 0.25,
    maxScale = 5,
    zoomStep = 0.25,

    onClose,
    onPdfLoadSuccess,
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
        if (!file) return

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
            passwordCallbackRef.current = callback
            setPasswordNeeded(true)
            setPasswordError(reason === 2)
            setCancelled(false)
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
        if (!el || !canZoom) return

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
    }, [zoomStep, minScale, maxScale, canZoom])

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
                    <PdfHeaderTitle
                        canDownload={canDownload}
                        canPrint={canPrint}
                        className={cn('z-50', hideHeader && 'hidden')}
                        fileTitle={fileTitle}
                        fileUrl={fileUrl}
                        onClose={onClose}
                        onPrint={onPrint}
                    />
                    <Document
                        file={file}
                        loading={
                            <div className="flex justify-center py-4">
                                <PdfSkeletonPage width={pageWidth} />
                            </div>
                        }
                        noData={
                            <div className="flex flex-col items-center gap-4 text-center p-8">
                                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
                                    <FileQuestionIcon className="size-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No PDF file provided.
                                </p>
                            </div>
                        }
                        onLoadSuccess={(document: DocumentCallback) => {
                            setNumPages(document.numPages)
                            setFirstPageHeight(null)
                            setPasswordNeeded(false)
                            setPasswordError(false)
                            onPdfLoadSuccess?.({ document })
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
                                        className="rounded-xl overflow-clip"
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
                    <PdfFooterControl
                        canPaginate={canPaginate}
                        canZoom={canZoom}
                        className={cn('z-50', hideFooterControl && 'hidden')}
                        defaultScale={defaultScale}
                        maxScale={maxScale}
                        minScale={minScale}
                        numPages={numPages}
                        scale={scale}
                        scrollRef={parentRef}
                        setScale={setScale}
                        virtualizer={virtualizer}
                        zoomStep={zoomStep}
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
