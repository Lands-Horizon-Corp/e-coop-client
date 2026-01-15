import * as React from 'react'
import { useMemo } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers/tw-utils'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useGetGeneratedReportAvailableModels } from '../../generated-report.service'
import {
    IGeneratedReportAvailableModalResponse,
    TModelName,
} from '../../generated-report.types'

interface Props {
    value?: TModelName
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: TModelName) => void
}

const ModelCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Model...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [searchInput, setSearchInput] = React.useState('')
    const [selectedModel, setSelectedModel] = React.useState<
        TModelName | undefined
    >(value)

    const { data: AccountModels } = useGetGeneratedReportAvailableModels({
        options: {},
    })
    const fuse = useMemo(
        () =>
            new Fuse<IGeneratedReportAvailableModalResponse>(
                AccountModels ?? [],
                {
                    keys: [{ name: 'model', weight: 0.2 }],
                    threshold: 0.2,
                }
            ),
        [AccountModels]
    )

    const filteredAccountModalName = useMemo(() => {
        if (!searchInput.trim()) {
            // No search input: show all models
            return AccountModels ?? []
        }
        // Search by input text
        return fuse.search(searchInput).map((r) => r.item)
    }, [searchInput, fuse, AccountModels])

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                    disabled={disabled}
                    role="combobox"
                    variant="outline"
                >
                    {selectedModel ? (
                        <span className="truncate">{selectedModel}</span>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                    <ChevronDownIcon className="opacity-50 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        className="h-9"
                        onValueChange={setSearchInput}
                        placeholder="Search Model..."
                        value={searchInput}
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No Model found.</CommandEmpty>
                        <CommandGroup>
                            {/* Always show 'none' first */}
                            <CommandItem
                                key="none"
                                onSelect={() => {
                                    setOpen(false)
                                    onChange?.('none')
                                    setSelectedModel('none')
                                }}
                                value="none"
                            >
                                <span className="truncate flex-1">none</span>
                                <CheckIcon
                                    className={cn(
                                        'ml-auto flex-shrink-0',
                                        value === 'none'
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            </CommandItem>
                            {/* Then API models */}
                            {(filteredAccountModalName ?? []).map((model) => (
                                <CommandItem
                                    key={model.model}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(model.model)
                                        setSelectedModel(model.model)
                                    }}
                                    value={model.model}
                                >
                                    <span className="truncate flex-1">
                                        {model.model}
                                    </span>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto flex-shrink-0',
                                            value === model.model
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ModelCombobox
