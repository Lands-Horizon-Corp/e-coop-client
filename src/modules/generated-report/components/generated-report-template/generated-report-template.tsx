import { useCallback, useEffect, useMemo, useState } from 'react'

import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/helpers'
import nunjucks from 'nunjucks'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CheckIcon,
    RotateLeftIcon,
    TextAaIcon,
    UserCogIcon,
} from '@/components/icons'
import { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import {
    GeneratedReportRegistryKey,
    REPORT_REGISTRY,
} from '../../generated-report-template-registry'
import {
    GeneratedReportTemplate,
    TDisplayDensity,
    TPaperOrientation,
    TPaperSizeUnit,
} from '../../generated-report.types'
import {
    DISPLAY_DENSITY,
    PAPER_SIZES,
    PAPER_SIZE_GROUPS,
} from '../../generated-reports.constants'

const SIZING_UNITS: TPaperSizeUnit[] = ['px', 'in', 'cm', 'mm', 'pt']

export interface GenerateReportTemplatePickerProps<T = unknown> {
    templates?: GeneratedReportTemplate<T>[]
    registryKey?: GeneratedReportRegistryKey | GeneratedReportRegistryKey[]
    onSelect?: (
        template: GeneratedReportTemplate<T>,
        dimensions: { width: string; height: string; unit: TPaperSizeUnit }
    ) => void
}

export function GenerateReportTemplatePicker<T = unknown>({
    templates,
    registryKey,
    onSelect,
}: GenerateReportTemplatePickerProps<T>) {
    const resolvedTemplates: GeneratedReportTemplate<T>[] = useMemo(() => {
        if (templates) return templates
        if (!registryKey) return []

        const keys = Array.isArray(registryKey) ? registryKey : [registryKey]

        return keys.flatMap(
            (key) =>
                (REPORT_REGISTRY[key] as GeneratedReportTemplate<T>[]) ?? []
        ) as GeneratedReportTemplate<T>[]
    }, [templates, registryKey])

    const [selected, setSelected] = useState<GeneratedReportTemplate<T> | null>(
        null
    )
    const [renderedHtml, setRenderedHtml] = useState('')
    const [loading, setLoading] = useState(false)
    const [pageW, setPageW] = useState(800)
    const [pageH, setPageH] = useState(1100)
    const [inputW, setInputW] = useState('800')
    const [inputH, setInputH] = useState('1100')
    const [unit, setUnit] = useState<TPaperSizeUnit>('px')
    const [orientation, setOrientation] =
        useState<TPaperOrientation>('portrait')
    const [displayDensity, setDisplayDensity] =
        useState<TDisplayDensity>('normal')

    const renderTemplate = useCallback(
        async (item: GeneratedReportTemplate) => {
            setLoading(true)
            try {
                const source = item.template

                // pageW/pageH are already the active dimensions shown in the form.
                const finalW = pageW
                const finalH = pageH

                setRenderedHtml(
                    nunjucks.renderString(source, {
                        ...(item.preview_data ? { ...item.preview_data } : {}),
                        density: displayDensity,
                        width: String(finalW),
                        height: String(finalH),
                    })
                )
            } catch {
                toast.error('Template is broken. Please report to admin.')
                setRenderedHtml(
                    "<p style='color:red;padding:20px;'>Failed to render template.</p>"
                )
            } finally {
                setLoading(false)
            }
        },
        [pageW, pageH, displayDensity]
    )

    useEffect(() => {
        if (!selected && resolvedTemplates.length > 0) {
            const first = resolvedTemplates[0]
            setSelected(first)
            const w = parseFloat(first.width) || 800
            const h = parseFloat(first.height) || 1100
            setPageW(w)
            setPageH(h)
            setInputW(String(w))
            setInputH(String(h))
            setUnit(first.default_unit ?? 'px')
            setOrientation(first.orientation)
        }
    }, [selected, resolvedTemplates, renderTemplate])

    useEffect(() => {
        if (!selected) return
        renderTemplate(selected)
    }, [selected, renderTemplate])

    const handleSelect = (item: GeneratedReportTemplate<T>) => {
        setSelected(item)
        setOrientation(item.orientation)
        const w = parseFloat(item.width) || 800
        const h = parseFloat(item.height) || 1100
        setPageW(w)
        setPageH(h)
        setInputW(String(w))
        setInputH(String(h))
        setUnit(item.default_unit ?? 'px')
    }

    const handleConfirm = () => {
        if (selected) {
            onSelect?.(
                {
                    ...selected,
                    orientation,
                },
                {
                    width: `${pageW}${unit}`,
                    height: `${pageH}${unit}`,
                    unit,
                }
            )
        } else toast.warning('No template selected')
    }

    const dimSchema = z.coerce.number().min(0.01).max(99999)

    const handleApplyDimensions = () => {
        if (!selected) return

        const parsedW = dimSchema.safeParse(inputW)
        const parsedH = dimSchema.safeParse(inputH)

        const nextW = parsedW.success ? parsedW.data : pageW
        const nextH = parsedH.success ? parsedH.data : pageH

        setPageW(nextW)
        setPageH(nextH)
        setInputW(String(nextW))
        setInputH(String(nextH))
    }

    const resetDimensions = () => {
        if (!selected) return
        const w = parseFloat(selected.width)
        const h = parseFloat(selected.height)
        setPageW(w)
        setPageH(h)
        setInputW(String(w))
        setInputH(String(h))
        setOrientation(selected.orientation)
        setUnit(selected.default_unit)
    }

    const finalW = pageW
    const finalH = pageH

    // const iframeSrcDoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;width:${pageW}${unit};height:${pageH}${unit};overflow:hidden;font-family:'Segoe UI',sans-serif;}</style></head><body>${renderedHtml}</body></html>`
    const iframeSrcDoc = renderedHtml

    useHotkeys(
        'alt+enter',
        (e) => {
            e.preventDefault()
            e.stopPropagation()
            handleConfirm()
        },
        {
            enableOnFormTags: true,
        }
    )

    return (
        <div className="max-w-6xl w-full mx-auto bg-popover ring-4 ring-muted border border-border overflow-clip rounded-xl h-[80vh] p-0 gap-0 flex">
            <aside className="flex !w-64 flex-col border-r border-border bg-muted/30">
                <Command className="rounded-none border-0 bg-transparent">
                    <div className="p-4 pb-0">
                        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Templates
                        </h2>
                    </div>
                    <div className="px-3 pt-2">
                        <CommandInput
                            className="h-9"
                            placeholder="Search templates…"
                        />
                    </div>
                    <CommandList className="max-h-[320px] ecoop-scroll flex-1 px-2 py-2">
                        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                            No templates found.
                        </CommandEmpty>
                        <CommandGroup>
                            {resolvedTemplates.map((item) => {
                                const isActive = selected?.id === item.id
                                return (
                                    <CommandItem
                                        className={cn(
                                            'flex cursor-pointer flex-col items-start gap-0.5 rounded-lg px-3 py-2.5',
                                            isActive && 'bg-accent'
                                        )}
                                        key={item.id}
                                        onSelect={() => handleSelect(item)}
                                        value={item.template_name}
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span
                                                className={cn(
                                                    'text-sm font-medium',
                                                    isActive
                                                        ? 'text-accent-foreground'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                {item.template_name}
                                            </span>
                                            {isActive && (
                                                <CheckIcon className="size-4 text-primary" />
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {item.width} x {item.height}
                                        </span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>

                <div className="mt-auto space-y-5 border-t border-border bg-background/50 p-5">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            <UserCogIcon className="h-3 w-3" />
                            Page Size
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">
                                Paper Size
                            </Label>
                            <Select
                                onValueChange={(key: string) => {
                                    const paper = PAPER_SIZES[key]
                                    if (!paper) return

                                    const isLandscape =
                                        orientation === 'landscape'
                                    const nextW = isLandscape
                                        ? paper.height
                                        : paper.width
                                    const nextH = isLandscape
                                        ? paper.width
                                        : paper.height

                                    setPageW(nextW)
                                    setPageH(nextH)
                                    setInputW(String(nextW))
                                    setInputH(String(nextH))
                                    setUnit(paper.unit as TPaperSizeUnit)
                                }}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Choose preset…" />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {Object.entries(PAPER_SIZE_GROUPS).map(
                                        ([group, keys]) => (
                                            <SelectGroup key={group}>
                                                <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                    {group}
                                                </SelectLabel>
                                                {keys.map((key) => {
                                                    const p = PAPER_SIZES[key]
                                                    return (
                                                        <SelectItem
                                                            className="text-xs"
                                                            key={key}
                                                            value={key}
                                                        >
                                                            <span>
                                                                {p.name}
                                                            </span>
                                                            <span className="ml-2 text-muted-foreground">
                                                                {p.width}×
                                                                {p.height}
                                                                {p.unit}
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase text-muted-foreground">
                                    Width
                                </Label>
                                <Input
                                    className="h-8 text-xs tabular-nums"
                                    onChange={(e) => setInputW(e.target.value)}
                                    value={inputW}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase text-muted-foreground">
                                    Height
                                </Label>
                                <Input
                                    className="h-8 text-xs tabular-nums"
                                    onChange={(e) => setInputH(e.target.value)}
                                    value={inputH}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground">
                                Unit
                            </Label>
                            <Select
                                onValueChange={(v: TPaperSizeUnit) =>
                                    setUnit(v)
                                }
                                value={unit}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SIZING_UNITS.map((u) => (
                                        <SelectItem
                                            className="text-xs"
                                            key={u}
                                            value={u}
                                        >
                                            {u}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Display Density
                            </Label>
                            <RadioGroup
                                className="mt-1 flex items-center gap-2"
                                onValueChange={(v) =>
                                    setDisplayDensity(v as TDisplayDensity)
                                }
                                value={displayDensity}
                            >
                                {DISPLAY_DENSITY.map((density, i) => {
                                    const isActive = displayDensity === density

                                    return (
                                        <label
                                            className={cn(
                                                'flex cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-medium border',
                                                isActive
                                                    ? 'text-primary border-primary/40 bg-primary/5'
                                                    : 'text-muted-foreground hover:bg-primary/5 hover:border-primary/20'
                                            )}
                                            key={density}
                                        >
                                            <RadioGroupItem
                                                className="sr-only"
                                                value={density}
                                            />

                                            <span className="size-6 inline-flex items-center justify-center">
                                                <TextAaIcon
                                                    style={{
                                                        width: `${60 + i * 20}%`,
                                                        height: `${60 + i * 20}%`,
                                                    }}
                                                />
                                            </span>

                                            <span className="capitalize leading-none">
                                                {density}
                                            </span>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Orientation
                            </Label>
                            <RadioGroup
                                className="flex gap-2"
                                onValueChange={(val: TPaperOrientation) => {
                                    if (val === orientation) return

                                    const swappedW = pageH
                                    const swappedH = pageW

                                    setOrientation(val)
                                    setPageW(swappedW)
                                    setPageH(swappedH)
                                    setInputW(String(swappedW))
                                    setInputH(String(swappedH))
                                }}
                                value={orientation}
                            >
                                {[
                                    {
                                        value: 'portrait',
                                        label: 'Portrait',
                                        size: { width: 14, height: 18 },
                                    },
                                    {
                                        value: 'landscape',
                                        label: 'Landscape',
                                        size: { width: 18, height: 14 },
                                    },
                                ].map((opt) => {
                                    const isSelected = orientation === opt.value

                                    return (
                                        <label
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-1.5 rounded-md border-2 py-1.5 px-2 cursor-pointer transition-all',
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border bg-card hover:border-muted-foreground/30'
                                            )}
                                            key={opt.value}
                                        >
                                            <RadioGroupItem
                                                className="sr-only"
                                                value={opt.value}
                                            />
                                            <div
                                                className={cn(
                                                    'rounded-[2px] border transition-all',
                                                    isSelected
                                                        ? 'border-primary bg-primary/20'
                                                        : 'border-border bg-muted'
                                                )}
                                                style={opt.size}
                                            />
                                            <span
                                                className={cn(
                                                    'text-xs font-medium capitalize',
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                )}
                                            >
                                                {opt.label}
                                            </span>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="h-8 flex-1 text-xs"
                            onClick={resetDimensions}
                            size="xs"
                            variant="outline"
                        >
                            <RotateLeftIcon className="mr-1.5 h-3 w-3" />
                            Reset
                        </Button>
                        <Button
                            className="h-8 flex-1 text-xs"
                            onClick={handleApplyDimensions}
                            size="xs"
                            variant="secondary"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </aside>

            <main className="relative flex flex-1 min-w-0 flex-col bg-muted/20">
                <header className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Badge
                            className="rounded-md px-1.5 py-0 font-mono text-[10px]"
                            variant="secondary"
                        >
                            {pageW}
                            {unit} x {pageH}
                            {unit}
                        </Badge>
                        <Separator className="h-4" orientation="vertical" />
                        <span className="text-xs text-muted-foreground">
                            {loading ? 'Rendering…' : 'Preview Ready'}
                        </span>
                    </div>
                </header>

                <div className="flex-1 max-w-full min-w-0 overflow-auto ecoop-scroll p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <iframe
                            className="border-0 block rounded-xl"
                            sandbox="allow-same-origin"
                            srcDoc={iframeSrcDoc}
                            style={{
                                width: `${finalW}${unit}`,
                                height: `${finalH}${unit}`,
                                background: 'black',
                            }}
                            title="Template Preview"
                        />
                        // </div>
                    )}
                </div>

                <footer className="flex items-center justify-between border-t border-border bg-background px-6 py-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                            {selected?.template_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Ready for export
                        </span>
                    </div>
                    <div>
                        <span>
                            <Kbd className="mr-1">Alt</Kbd>
                            <Kbd>Enter</Kbd>
                        </span>
                        <Button
                            className="px-8 ml-2 shadow-template-cta"
                            disabled={!selected || loading}
                            onClick={handleConfirm}
                            size="xs"
                            variant="default"
                        >
                            Use Template
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    )
}

export interface GenerateReportTemplatePickerModalProps extends IModalProps {
    trigger?: React.ReactNode
    templatePickerProps: GenerateReportTemplatePickerProps
}

export function GenerateReportTemplatePickerModal({
    templatePickerProps,
    trigger,
    ...modalProps
}: GenerateReportTemplatePickerModalProps) {
    return (
        <Dialog {...modalProps}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="!max-w-6xl h-[80vh] !bg-transparent p-0 gap-0 flex flex-col">
                <DialogHeader className="px-6 py-4 hidden border-b border-border shrink-0">
                    <DialogTitle className="text-lg">
                        Select Template
                    </DialogTitle>
                </DialogHeader>
                <GenerateReportTemplatePicker
                    {...templatePickerProps}
                    onSelect={(t, dim) => {
                        templatePickerProps?.onSelect?.(t, dim)
                        modalProps.onOpenChange?.(false)
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
