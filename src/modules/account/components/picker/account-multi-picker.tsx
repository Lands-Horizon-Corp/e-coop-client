import { memo, useCallback, useMemo, useRef, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { RefreshCw, Search } from 'lucide-react'

import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'

import { useInternalState } from '@/hooks/use-internal-state'

import { useGetAllAccount } from '../../account.service'
import { IAccount } from '../../account.types'
import AccountTypeBadge from '../badges/account-type-badge'

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
                    placeholder="Search accounts..."
                />
            </div>
        )
    }
)
DebouncedSearch.displayName = 'DebouncedSearch'

const AccountList = ({
    className,
    filteredAccounts,
    selectedIds,
    handleClick,
}: {
    className?: string
    filteredAccounts: IAccount[]
    selectedIds: Set<string>
    handleClick: (index: number, e: React.MouseEvent) => void
}) => (
    <div className={cn('space-y-1.5 ecoop-scroll overflow-y-auto ', className)}>
        {filteredAccounts.map((account, index) => {
            const isSelected = selectedIds.has(account.id)
            return (
                <div
                    className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                        isSelected
                            ? 'border-primary/40 bg-primary/10 hover:bg-primary/15'
                            : 'border-border bg-card hover:bg-muted/60'
                    )}
                    key={account.id}
                    onClick={(e) => handleClick(index, e)}
                >
                    <Checkbox
                        checked={isSelected}
                        className="pointer-events-none shrink-0"
                        tabIndex={-1}
                    />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                        {account.name}
                    </span>
                    <AccountTypeBadge type={account.type} />
                    {/* <span
                        className={cn(
                            'font-mono text-xs shrink-0 w-20 text-right',
                            (account.gl_total_balance ?? 0 < 0)
                                ? 'text-destructive'
                                : 'text-foreground'
                        )}
                    >
                        {(account.gl_total_balance ?? 0 < 0) &&
                            `(${currencyFormat(account.gl_total_balance, {
                                currency: account.currency,
                                showSymbol: !account.currency,
                            })})`}
                    </span> */}
                </div>
            )
        })}
        {filteredAccounts.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
                No accounts match your search.
            </p>
        )}
    </div>
)

interface AccountMultiPickerProps {
    defaultSelected?: IAccount[]
    onSelectChange?: (selectedAccounts: IAccount[]) => void
    onConfirm?: (selectedAccounts: IAccount[]) => void
}

const AccountMultiPicker = ({
    defaultSelected = [],
    onConfirm,
    onSelectChange,
}: AccountMultiPickerProps) => {
    const { data = [] } = useGetAllAccount()

    const [selectedAccounts, setSelectedAccounts] =
        useState<IAccount[]>(defaultSelected)

    const [query, setQuery] = useState('')
    const lastClickedIndex = useRef<number | null>(null)

    const selectedIds = useMemo(
        () => new Set(selectedAccounts.map((a) => a.id)),
        [selectedAccounts]
    )

    const fuse = useMemo(() => {
        return new Fuse(data, {
            keys: ['name', 'code', 'type'],
            threshold: 0.3,
        })
    }, [data])

    const filteredAccounts = useMemo(() => {
        if (!query.trim()) return data
        return fuse.search(query).map((r) => r.item)
    }, [data, fuse, query])

    const handleClick = useCallback(
        (index: number, e: React.MouseEvent) => {
            setSelectedAccounts((prev) => {
                const nextMap = new Map(prev.map((a) => [a.id, a]))

                if (
                    e.shiftKey &&
                    lastClickedIndex.current !== null &&
                    lastClickedIndex.current !== index
                ) {
                    const start = Math.min(lastClickedIndex.current, index)
                    const end = Math.max(lastClickedIndex.current, index)

                    for (let i = start; i <= end; i++) {
                        const acc = filteredAccounts[i]
                        nextMap.set(acc.id, acc)
                    }
                } else {
                    const acc = filteredAccounts[index]
                    if (nextMap.has(acc.id)) nextMap.delete(acc.id)
                    else nextMap.set(acc.id, acc)
                }

                const next = Array.from(nextMap.values())
                onSelectChange?.(next)
                return next
            })

            lastClickedIndex.current = index
        },
        [filteredAccounts, onSelectChange]
    )

    const handleConfirm = () => {
        onConfirm?.(selectedAccounts)
    }

    const handleSearch = useCallback((q: string) => {
        setQuery(q)
        lastClickedIndex.current = null
    }, [])

    return (
        <div className="h-[80vh] min-w-xl select-none flex flex-col overflow-clip">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-foreground">
                        Chart of Accounts
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Click to toggle or <Kbd className="mr-1">Shift</Kbd>
                        <Kbd>Click</Kbd> to range select
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {selectedAccounts.length > 0 && (
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                            {selectedAccounts.length} selected
                        </span>
                    )}
                    <button
                        aria-label="Refresh accounts"
                        className="inline-flex items-center justify-center rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="mb-3">
                <DebouncedSearch onSearch={handleSearch} />
            </div>
            <div className="flex py-2 justify-between">
                <Button
                    onClick={() => {
                        setSelectedAccounts(filteredAccounts)
                    }}
                    size="xs"
                    variant="secondary"
                >
                    Select All
                </Button>
                <Button
                    className={cn(
                        'hidden',
                        selectedAccounts.length > 0 && 'block'
                    )}
                    onClick={() => {
                        setSelectedAccounts([])
                        onSelectChange?.([])
                    }}
                    size="xs"
                    variant="secondary"
                >
                    Unselect
                </Button>
            </div>
            <AccountList
                className="flex-1"
                filteredAccounts={filteredAccounts}
                handleClick={handleClick}
                selectedIds={selectedIds}
            />
            <div className="mt-4">
                <button
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    onClick={handleConfirm}
                >
                    Confirm Selection
                </button>
            </div>
        </div>
    )
}

export const AccountMultiPickerModal = ({
    title = 'Multi Pick Account',
    description = 'Pick one or multiple accounts',
    className,
    pickerProps,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    pickerProps: AccountMultiPickerProps
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    return (
        <Modal
            className={cn('max-w-5xl! w-fit', className)}
            closeButtonClassName="hidden"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="hidden"
            {...props}
        >
            <AccountMultiPicker
                {...pickerProps}
                onConfirm={(createdData) => {
                    pickerProps?.onConfirm?.(createdData)
                    setState(false)
                }}
            />
        </Modal>
    )
}

export default AccountMultiPicker
