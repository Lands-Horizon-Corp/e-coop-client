import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/helpers'
import { Virtualizer } from '@tanstack/react-virtual'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
    PDFFileFillIcon,
    PrinterFillIcon,
    ShieldIcon,
    ShieldLockIcon,
    XIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from '@/components/icons'
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
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/ui/password-input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { downloadPDF, printPDF } from '../../pdf-utils'

export type PdfHeaderProps = {
    canPrint?: boolean
    canDownload?: boolean
    onPrint?: () => void
}

export const PdfHeaderTitle = ({
    fileUrl,
    fileTitle,
    className,

    canPrint = true,
    canDownload = true,

    onClose,
}: {
    fileUrl?: string | null
    fileTitle: string
    className?: string
    onClose?: () => void
} & PdfHeaderProps) => {
    // pang download
    const handleDownload = useCallback(() => {
        if (!fileUrl) return
        downloadPDF(fileUrl, fileTitle)
    }, [fileUrl, fileTitle])

    // pang print
    const handlePrint = useCallback(() => {
        if (!fileUrl) return
        printPDF(fileUrl)
    }, [fileUrl])

    return (
        <div
            className={cn(
                'mx-auto px-2 py-2 w-fit flex overflow-auto ecoop-scroll items-center sticky z-10 left-1/2 -translate-x-1/2 top-0 gap-2',
                className
            )}
        >
            <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
                <Button
                    className="rounded-lg text-sm cursor-pointer backdrop-blur-sm "
                    disabled
                    size="sm"
                    variant="secondary"
                >
                    <PDFFileFillIcon /> {fileTitle}
                </Button>
            </ButtonGroup>
            <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={!canPrint}
                    onClick={handlePrint}
                    size="sm"
                    variant="secondary"
                >
                    <PrinterFillIcon className="size-4" />
                </Button>
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={!canDownload}
                    onClick={handleDownload}
                    size="sm"
                    variant="secondary"
                >
                    <DownloadIcon className="size-4" />
                </Button>
                <Button
                    className="rounded-lg cursor-pointer"
                    onClick={onClose}
                    size="sm"
                    variant="secondary"
                >
                    <XIcon className="size-4" />
                </Button>
            </ButtonGroup>
        </div>
    )
}

export type PdfFooterProps = {
    canPaginate?: boolean
    canZoom?: boolean
}

export const PdfFooterControl = memo(function FooterControls({
    className,
    scrollRef,

    virtualizer,
    canPaginate = true,
    numPages,

    canZoom = true,
    defaultScale,
    minScale,
    maxScale,
    zoomStep,
    scale,

    setScale,
}: {
    scrollRef: React.RefObject<HTMLDivElement | null>
    virtualizer: Virtualizer<Element, Element>
    numPages: number
    className?: string

    defaultScale: number
    minScale: number
    maxScale: number
    zoomStep: number

    scale: number
    setScale?: (value: number | ((prev: number) => number)) => void
} & PdfFooterProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const rafRef = useRef<number>(0)
    const [goToInput, setGoToInput] = useState('')
    const [popoverOpen, setPopoverOpen] = useState(false)

    // pang update ng page
    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const onScroll = () => {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => {
                const items = virtualizer.getVirtualItems()
                if (items.length === 0) return
                const scrollMid = el.scrollTop + el.clientHeight / 2
                const closest = items.reduce((prev, curr) => {
                    const prevMid = prev.start + prev.size / 2
                    const currMid = curr.start + curr.size / 2
                    return Math.abs(currMid - scrollMid) <
                        Math.abs(prevMid - scrollMid)
                        ? curr
                        : prev
                })
                setCurrentPage(closest.index + 1)
            })
        }

        onScroll()
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            el.removeEventListener('scroll', onScroll)
            cancelAnimationFrame(rafRef.current)
        }
    }, [scrollRef, virtualizer])

    // pang page scroll jump
    const scrollToPage = useCallback(
        (page: number) => {
            const clamped = Math.max(1, Math.min(page, numPages))
            setCurrentPage(clamped)
            virtualizer.scrollToIndex(clamped - 1, { align: 'start' })
        },
        [numPages, virtualizer]
    )

    const handleGoTo = () => {
        const page = parseInt(goToInput, 10)
        if (!isNaN(page)) {
            scrollToPage(page)
            setPopoverOpen(false)
            setGoToInput('')
        }
    }

    // pang zooom in control btns
    const zoomIn = useCallback(() => {
        setScale?.((s) =>
            Math.min(maxScale, Math.round((s + zoomStep) * 100) / 100)
        )
    }, [maxScale, setScale, zoomStep])

    const zoomOut = useCallback(() => {
        setScale?.((s) =>
            Math.max(minScale, Math.round((s - zoomStep) * 100) / 100)
        )
    }, [minScale, setScale, zoomStep])

    const resetZoom = useCallback(() => {
        setScale?.(defaultScale)
    }, [defaultScale, setScale])

    return (
        <div
            className={cn(
                'mx-auto px-2 py-2 w-fit flex overflow-auto ecoop-scroll items-center sticky left-1/2 -translate-x-1/2 bottom-0 gap-2',
                className
            )}
        >
            <ButtonGroup
                className={cn(
                    'flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl',
                    !canPaginate && 'hidden'
                )}
            >
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={currentPage <= 1}
                    onClick={() => scrollToPage(currentPage - 1)}
                    size="sm"
                    variant="secondary"
                >
                    <ChevronLeftIcon />
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
                    <ChevronRightIcon />
                </Button>
            </ButtonGroup>

            <ButtonGroup
                className={cn(
                    'flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl',
                    !canZoom && 'hidden'
                )}
            >
                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={scale <= minScale}
                    onClick={zoomOut}
                    size="sm"
                    variant="secondary"
                >
                    <ZoomOutIcon className="size-4" />
                </Button>

                <Button
                    className="rounded-lg text-sm cursor-pointer min-w-[60px]"
                    onClick={resetZoom}
                    size="sm"
                    variant="secondary"
                >
                    {Math.round(scale * 100)}%
                </Button>

                <Button
                    className="rounded-lg cursor-pointer"
                    disabled={scale >= maxScale}
                    onClick={zoomIn}
                    size="sm"
                    variant="secondary"
                >
                    <ZoomInIcon className="size-4" />
                </Button>
            </ButtonGroup>
        </div>
    )
})

export const PasswordDialog = memo(function PasswordDialog({
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

export const PdfPasswordRequired = ({
    onRetry,
    onCancel,
}: {
    onRetry: () => void
    onCancel: () => void
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
                <ShieldIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                    Password Required
                </h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                    This PDF is password protected. Enter the correct password
                    to view its contents.
                </p>
            </div>
            <div className="flex gap-3">
                <Button onClick={onCancel} variant="outline">
                    Cancel
                </Button>
                <Button onClick={onRetry}>Enter Password</Button>
            </div>
        </div>
    )
}

interface PdfPasswordDialogProps {
    open: boolean
    error: boolean
    onSubmit: (password: string) => void
    onCancel: () => void
}

export const PdfPasswordDialog = ({
    open,
    error,
    onSubmit,
    onCancel,
}: PdfPasswordDialogProps) => {
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password.trim()) {
            onSubmit(password)
        }
    }

    const handleCancel = () => {
        setPassword('')
        onCancel()
    }

    return (
        <Dialog onOpenChange={(v) => !v && handleCancel()} open={open}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 pb-4 flex flex-col items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/15 flex items-center justify-center ring-1 ring-primary/20">
                        <ShieldIcon className="size-[70%] text-primary" />
                    </div>
                    <DialogHeader className="text-center space-y-0">
                        <DialogTitle className="mx-auto font-semibold">
                            Protected PDF
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            This document requires a password to open.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form
                    className="px-8 pb-8 pt-2 space-y-5"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <Label
                            className="text-sm font-medium"
                            htmlFor="pdf-password"
                        >
                            Password
                        </Label>
                        <PasswordInput
                            autoFocus
                            className={cn(
                                'w-full',
                                error
                                    ? 'pr-10 border-destructive focus-visible:ring-destructive/40'
                                    : 'pr-10'
                            )}
                            id="pdf-password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter document password"
                            value={password}
                        />
                        {error && (
                            <p className="text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-1">
                                Incorrect password. Please try again.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            onClick={handleCancel}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            disabled={!password.trim()}
                            type="submit"
                        >
                            Unlock
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
