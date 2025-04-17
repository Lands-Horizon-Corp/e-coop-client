import { useState } from 'react'

import { Button } from '@/components/ui/button'
import ActionTooltip from '@/components/action-tooltip'
import { MagnifyingGlassIcon, XIcon } from '@/components/icons'
import { DebouncedInput } from '@/components/ui/debounced-input'

import { KeysOfOrString } from '@/types'
import {
    TFilterModes,
    TSearchFilter,
    useFilter,
} from '@/contexts/filter-context'

export interface IGlobalSearchTargets<T> {
    field: (string & {}) | keyof T
    displayText: string
}

export interface IGlobalSearchProps<T> {
    placeHolder?: string
    defaultMode: TFilterModes
    targets: IGlobalSearchTargets<T>[]
}

const accessorKey = 'globalSearch'

const DataTableGlobalSearch = <T,>({
    targets,
    defaultMode,
    ...otherProps
}: IGlobalSearchProps<T>) => {
    const [visible, setVisible] = useState(false)
    const { filters, setFilter, bulkSetFilter } = useFilter<
        unknown,
        KeysOfOrString<T>
    >()

    const filterVal: TSearchFilter = filters[accessorKey as string] ?? {
        value: '',
        to: undefined,
        from: undefined,
        dataType: 'text',
        mode: defaultMode,
        displayText: 'Global Search',
    }

    if (targets.length === 0) return

    return (
        <div className="flex items-center gap-x-1">
            <Button
                size="sm"
                variant="secondary"
                onClick={() => setVisible((prev) => !prev)}
            >
                <MagnifyingGlassIcon />
            </Button>
            {visible && targets.length > 0 && (
                <ActionTooltip
                    side="bottom"
                    tooltipContent="Global search will only apply on fields that are text searchable"
                >
                    <span className="relative">
                        <DebouncedInput
                            className="min-w-[200px] text-xs animate-in fade-in-75"
                            value={filterVal.value}
                            placeholder={
                                otherProps.placeHolder ??
                                'Global Search (Text Only)'
                            }
                            onChange={(val) => {
                                setFilter(accessorKey, {
                                    ...filterVal,
                                    value: val,
                                })
                                bulkSetFilter(targets, {
                                    ...filterVal,
                                    value: val,
                                })
                            }}
                        />
                        <Button
                            variant="ghost"
                            className="p-.5 absolute right-2 top-1/2 size-fit -translate-y-1/2 rounded-full"
                            onClick={() => {
                                setFilter(accessorKey)
                                bulkSetFilter(targets)
                            }}
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </span>
                </ActionTooltip>
            )}
        </div>
    )
}

export default DataTableGlobalSearch
