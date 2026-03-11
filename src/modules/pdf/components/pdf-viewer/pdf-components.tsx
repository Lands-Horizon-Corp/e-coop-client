import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/helpers'
import { Virtualizer } from '@tanstack/react-virtual'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    EyeOffIcon,
    PrinterFillIcon,
    ShieldIcon,
    ShieldLockIcon,
    XIcon,
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

export const PDFFooterControl = memo(function FooterControls({
    fileUrl,
    numPages,
    className,
    fileTitle,
    scrollRef,
    virtualizer,
    onClose,
}: {
    scrollRef: React.RefObject<HTMLDivElement | null>
    virtualizer: Virtualizer<Element, Element>
    numPages: number
    className?: string
    fileTitle: string
    fileUrl?: string | null
    onClose?: () => void
}) {
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

    // Pang scroll
    const scrollToPage = useCallback(
        (page: number) => {
            const clamped = Math.max(1, Math.min(page, numPages))
            setCurrentPage(clamped)
            virtualizer.scrollToIndex(clamped - 1, { align: 'start' })
        },
        [numPages, virtualizer]
    )

    // pang page scroll jump
    const handleGoTo = () => {
        const page = parseInt(goToInput, 10)
        if (!isNaN(page)) {
            scrollToPage(page)
            setPopoverOpen(false)
            setGoToInput('')
        }
    }

    // pang print
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

    return (
        <div
            className={cn(
                'mx-auto px-2 py-2 w-fit flex overflow-auto ecoop-scroll items-center sticky left-1/2 -translate-x-1/2 bottom-0 gap-2',
                className
            )}
        >
            <ButtonGroup className="flex bg-popover border border-secondary-foreground/70 p-1 rounded-xl">
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
                    onClick={handlePrint}
                    size="sm"
                    variant="secondary"
                >
                    <PrinterFillIcon className="size-4" />
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
