import { memo, useCallback, useMemo, useRef, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { Search } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'

import { useInternalState } from '@/hooks/use-internal-state'

import { GENERAL_LEDGER_SOURCES } from '../../general-ledger.constants'
import { TGeneralLedgerSource } from '../../general-ledger.types'

const DebouncedSearch = memo(
    ({ onSearch }: { onSearch: (query: string) => void }) => {
        const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => onSearch(value), 250)
        }

        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    className="pl-9 bg-background"
                    onChange={handleChange}
                    placeholder="Search source..."
                />
            </div>
        )
    }
)
DebouncedSearch.displayName = 'DebouncedSearch'

const SourceList = ({
    filtered,
    selectedSet,
    handleClick,
}: {
    filtered: TGeneralLedgerSource[]
    selectedSet: Set<TGeneralLedgerSource>
    handleClick: (index: number, e: React.MouseEvent) => void
}) => (
    <div className="space-y-1.5 ecoop-scroll select-none overflow-y-auto">
        {filtered.map((item, index) => {
            const isSelected = selectedSet.has(item)

            return (
                <div
                    className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                        isSelected
                            ? 'border-primary/40 bg-primary/10 hover:bg-primary/15'
                            : 'border-border bg-card hover:bg-muted/60'
                    )}
                    key={`${item}-${index}`}
                    onClick={(e) => handleClick(index, e)}
                >
                    <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                        tabIndex={-1}
                    />
                    <span className="text-sm font-medium capitalize">
                        {item}
                    </span>
                </div>
            )
        })}

        {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
                No sources match your search.
            </p>
        )}
    </div>
)

interface Props {
    defaultSelected?: TGeneralLedgerSource[]
    onSelectChange?: (val: TGeneralLedgerSource[]) => void
    onConfirm?: (val: TGeneralLedgerSource[]) => void
}

const GeneralLedgerSourceMultiPicker = ({
    defaultSelected = [],
    onConfirm,
    onSelectChange,
}: Props) => {
    const [selected, setSelected] =
        useState<TGeneralLedgerSource[]>(defaultSelected)

    const [query, setQuery] = useState('')
    const lastClickedIndex = useRef<number | null>(null)

    const selectedSet = useMemo(() => new Set(selected), [selected])

    const fuse = useMemo(
        () =>
            new Fuse(GENERAL_LEDGER_SOURCES, {
                threshold: 0.3,
            }),
        []
    )

    const filtered = useMemo(() => {
        if (!query.trim()) return GENERAL_LEDGER_SOURCES
        return fuse.search(query).map((r) => r.item)
    }, [query, fuse])

    const handleClick = useCallback(
        (index: number, e: React.MouseEvent) => {
            setSelected((prev) => {
                const next = new Set(prev)

                if (
                    e.shiftKey &&
                    lastClickedIndex.current !== null &&
                    lastClickedIndex.current !== index
                ) {
                    const start = Math.min(lastClickedIndex.current, index)
                    const end = Math.max(lastClickedIndex.current, index)

                    for (let i = start; i <= end; i++) {
                        next.add(filtered[i])
                    }
                } else {
                    const val = filtered[index]
                    if (next.has(val)) next.delete(val)
                    else next.add(val)
                }

                const arr = Array.from(next)
                onSelectChange?.(arr)
                return arr
            })

            lastClickedIndex.current = index
        },
        [filtered, onSelectChange]
    )

    useHotkeys(
        'enter',
        (e) => {
            e.preventDefault()
            onConfirm?.(selected)
        },
        {
            enableOnFormTags: true,
        },
        [selected]
    )

    return (
        <div className="h-[80vh] min-w-xl flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold">
                        General Ledger Sources
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Click to toggle or <Kbd className="mr-1">Shift</Kbd>
                        <Kbd>Click</Kbd> to range select
                    </p>
                </div>

                {selected.length > 0 && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                        {selected.length} selected
                    </span>
                )}
            </div>

            <div className="mb-3">
                <DebouncedSearch onSearch={setQuery} />
            </div>

            <div className="flex justify-between py-2">
                <Button
                    onClick={() => setSelected([...GENERAL_LEDGER_SOURCES])}
                    size="xs"
                    variant="secondary"
                >
                    Select All
                </Button>

                {selected.length > 0 && (
                    <Button
                        onClick={() => {
                            setSelected([])
                            onSelectChange?.([])
                        }}
                        size="xs"
                        variant="secondary"
                    >
                        Unselect
                    </Button>
                )}
            </div>

            <SourceList
                filtered={filtered as TGeneralLedgerSource[]}
                handleClick={handleClick}
                selectedSet={selectedSet}
            />

            <div className="mt-4 sticky bottom-0">
                <Button
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onConfirm?.(selected)}
                >
                    Confirm Selection
                    <Kbd>Enter</Kbd>
                </Button>
            </div>
        </div>
    )
}

export const GeneralLedgerSourceMultiPickerModal = ({
    title = 'Multi Pick Source',
    description = 'Pick sources',
    className,
    pickerProps,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    pickerProps: Props
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    return (
        <Modal
            className={cn('max-w-5xl! w-fit', className)}
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            {...props}
        >
            <GeneralLedgerSourceMultiPicker
                {...pickerProps}
                onConfirm={(val) => {
                    pickerProps?.onConfirm?.(val)
                    setState(false)
                }}
            />
        </Modal>
    )
}

export default GeneralLedgerSourceMultiPicker
