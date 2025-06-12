import { useState } from 'react'

import { Button } from '@/components/ui/button'
import ActionTooltip from '@/components/action-tooltip'
import { MagnifyingGlassIcon, XIcon } from '@/components/icons'
import { DebouncedInput } from '@/components/ui/debounced-input'

import {
    useFilter,
    TFilterModes,
    TSearchFilter,
} from '@/contexts/filter-context'

import { KeysOfOrString } from '@/types'

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
    const [visible, setVisible] = useState(true)
    const { filters, setFilter, bulkSetFilter, setFilterLogic } = useFilter<
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
        <div className="flex items-center gap-x-1.5 p-1">
            {visible && targets.length > 0 && (
                <ActionTooltip
                    side="bottom"
                    tooltipContent="Global search will only apply on fields that are text searchable"
                >
                    <span className="relative">
                        <DebouncedInput
                            className="min-w-[300px] rounded-lg bg-popover text-xs animate-in fade-in-75 focus-visible:ring-muted"
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
                                setFilterLogic('OR')
                            }}
                        />
                        <Button
                            variant="ghost"
                            className="p-.5 absolute right-2 top-1/2 size-fit -translate-y-1/2 rounded-full"
                            onClick={() => setVisible(false)}
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </span>
                </ActionTooltip>
            )}
            {!visible && (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setVisible((prev) => !prev)}
                >
                    <MagnifyingGlassIcon />
                </Button>
            )}
        </div>
    )
}

export default DataTableGlobalSearch
