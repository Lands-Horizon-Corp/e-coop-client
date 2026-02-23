import { forwardRef, useCallback, useMemo, useRef, useState } from 'react'

import { cn } from '@/helpers'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CheckSquare, Search, Shield } from 'lucide-react'

import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useInternalState } from '@/hooks/use-internal-state'

import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_ALL_RESOURCE_ACTION,
} from '../../permission.constants'
import { TPermissionAction, TPermissionResource } from '../../permission.types'
import { PermissionCheckbox } from './permission-checkbox'

interface IPermissionMatrixProps {
    className?: string
    defaultValues?: Record<string, TPermissionAction[]>
    controlledState?: {
        value: Record<string, TPermissionAction[]>
        onValueChange: (value: Record<string, TPermissionAction[]>) => void
    }
    readOnly?: boolean
}

const ROW_HEIGHT = 56

const PermissionMatrix = forwardRef<
    HTMLFieldSetElement,
    IPermissionMatrixProps
>(({ readOnly, className, controlledState, defaultValues = {} }, ref) => {
    const [selectedPermissions, setSelectedPermissions] = useInternalState<
        Record<string, TPermissionAction[]>
    >(defaultValues, controlledState?.value, controlledState?.onValueChange)
    // const [selectAll, setSelectAll] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const parentRef = useRef<HTMLDivElement>(null)
    const headerScrollRef = useRef<HTMLDivElement>(null)

    const filteredResources = useMemo(() => {
        return PERMISSION_ALL_RESOURCE_ACTION.filter(
            (resource) =>
                resource.resource
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resource.label
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resource.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    const rowVirtualizer = useVirtualizer({
        count: filteredResources.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    })

    const handleBodyScroll = useCallback(() => {
        if (parentRef.current && headerScrollRef.current) {
            headerScrollRef.current.scrollLeft = parentRef.current.scrollLeft
        }
    }, [])

    const handlePermissionChange = useCallback(
        (
            resource: TPermissionResource,
            action: TPermissionAction,
            checked: boolean
        ) => {
            setSelectedPermissions((prev) => {
                const current = prev[resource] || []
                if (checked) {
                    return { ...prev, [resource]: [...current, action] }
                } else {
                    // setSelectAll(false)
                    return {
                        ...prev,
                        [resource]: current.filter((p) => p !== action),
                    }
                }
            })
        },
        [setSelectedPermissions]
    )

    const getSelectedCount = useCallback(() => {
        return Object.values(selectedPermissions).reduce(
            (total, perms) => total + perms.length,
            0
        )
    }, [selectedPermissions])

    const isResourceAllSelected = useCallback(
        (resource: TPermissionResource) => {
            const RESOURCE = PERMISSION_ALL_RESOURCE_ACTION.find(
                (res) => res.resource === resource
            )
            if (!RESOURCE) return false
            const selectedCount = (selectedPermissions[resource] ?? []).length
            if (selectedCount === 0) return false
            if (selectedCount === RESOURCE.supportedActions.length) return true
            return 'indeterminate' as const
        },
        [selectedPermissions]
    )

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            // setSelectAll(checked)
            if (checked) {
                const allPermissions: Record<string, TPermissionAction[]> = {}
                PERMISSION_ALL_RESOURCE_ACTION.forEach((resource) => {
                    allPermissions[resource.resource] =
                        resource.supportedActions.map((action) => action)
                })
                setSelectedPermissions(allPermissions)
            } else {
                setSelectedPermissions({})
            }
        },
        [setSelectedPermissions]
    )

    const handleResourceSelectAll = useCallback(
        (
            resource: TPermissionResource,
            actions: TPermissionAction[],
            checked: boolean
        ) => {
            setSelectedPermissions((prev) => {
                const newPerms = { ...prev }
                newPerms[resource] = checked ? actions : []
                return newPerms
            })
        },
        [setSelectedPermissions]
    )

    const isPermissionChecked = useCallback(
        (resource: TPermissionResource, action: TPermissionAction) => {
            return selectedPermissions[resource]?.includes(action) || false
        },
        [selectedPermissions]
    )

    const isAllSelected = useMemo(() => {
        if (!PERMISSION_ALL_RESOURCE_ACTION.length) return false

        return PERMISSION_ALL_RESOURCE_ACTION.every((resource) => {
            const selected = selectedPermissions[resource.resource] || []
            return (
                selected.length === resource.supportedActions.length &&
                resource.supportedActions.length > 0
            )
        })
    }, [selectedPermissions])

    return (
        <fieldset
            aria-readonly={readOnly}
            className={cn(
                'bg-card border border-border rounded-xl w-full min-w-0 max-w-full shadow-sm flex flex-col',
                className
            )}
            disabled={readOnly}
            ref={ref}
        >
            <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Permission Matrix (Virtualized)
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Configure access levels for each resource
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="px-3 py-1" variant="secondary">
                            <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                            {getSelectedCount()} selected
                        </Badge>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={isAllSelected}
                                disabled={readOnly}
                                id="select-all-virtualized"
                                onCheckedChange={(checked) =>
                                    handleSelectAll(checked as boolean)
                                }
                            />
                            <Label
                                className="text-sm font-medium cursor-pointer"
                                htmlFor="select-all-virtualized"
                            >
                                Select All
                            </Label>
                        </div>
                    </div>
                </div>

                <div className="relative mt-4 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 bg-background"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search resources..."
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className="bg-muted/50 border-b border-border sticky top-0 z-20 flex">
                <div className="min-w-[280px] w-[280px] flex-shrink-0 px-4 py-3 font-semibold text-sm text-foreground bg-muted/50 border-r border-border">
                    Resource
                </div>
                <div className="flex-1 overflow-hidden" ref={headerScrollRef}>
                    <div className="flex">
                        <div className="w-16 flex-shrink-0 px-2 py-3 text-center font-semibold text-sm text-foreground">
                            All
                        </div>
                        {PERMISSION_ALL_ACTIONS.map((action) => (
                            <div
                                className="w-20 flex-shrink-0 px-1 py-3 text-center font-semibold text-xs text-foreground"
                                key={action.action}
                                title={action.description}
                            >
                                {action.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="flex-1 overflow-auto min-h-[400px] ecoop-scroll max-h-[500px]"
                onScroll={handleBodyScroll}
                ref={parentRef}
                style={{ contain: 'strict' }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const resource = filteredResources[virtualRow.index]
                        const isEven = virtualRow.index % 2 === 0
                        const allCheckedState = isResourceAllSelected(
                            resource.resource
                        )

                        return (
                            <div
                                className={cn(
                                    'flex items-center absolute top-0 left-0 transition-colors duration-100',
                                    isEven ? 'bg-background' : 'bg-muted/20',
                                    'hover:bg-accent/50'
                                )}
                                key={resource.resource}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <InfoTooltip
                                    content={
                                        <div className="max-w-2xl text-sm wrap-normal text-pretty">
                                            {resource.description}
                                        </div>
                                    }
                                    contentClassName="rounded-2xl p-4"
                                >
                                    <div className="min-w-[280px] w-[280px] text-right flex-shrink-0 px-4 py-2 border-r border-border/50 bg-popover/90 backdrop-blur-sm sticky left-0 z-10">
                                        <div className="font-medium text-sm text-foreground truncate">
                                            {resource.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {resource.description}
                                        </div>
                                    </div>
                                </InfoTooltip>

                                <div className="flex">
                                    <div className="w-16 flex-shrink-0 px-2 flex items-center justify-center">
                                        <PermissionCheckbox
                                            checked={allCheckedState}
                                            disabled={readOnly}
                                            onChange={(checked) =>
                                                handleResourceSelectAll(
                                                    resource.resource,
                                                    resource.supportedActions,
                                                    checked
                                                )
                                            }
                                        />
                                    </div>

                                    {PERMISSION_ALL_ACTIONS.map((action) => {
                                        const isSupported =
                                            resource.supportedActions.includes(
                                                action.action
                                            )
                                        return (
                                            <div
                                                className="w-20 flex-shrink-0 px-1 flex items-center justify-center"
                                                key={action.action}
                                            >
                                                <PermissionCheckbox
                                                    action={action.action}
                                                    checked={isPermissionChecked(
                                                        resource.resource,
                                                        action.action
                                                    )}
                                                    disabled={
                                                        !isSupported || readOnly
                                                    }
                                                    onChange={(checked) =>
                                                        handlePermissionChange(
                                                            resource.resource,
                                                            action.action,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {filteredResources.length === 0 && searchTerm && (
                <div className="text-center py-12 px-4">
                    <Search className="size-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground text-sm">
                        No resources found matching "
                        <span className="font-medium">{searchTerm}</span>"
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center px-4 py-3 bg-muted/30 border-t border-border text-sm text-muted-foreground">
                <span>
                    {filteredResources.length} resources{' '}
                    {PERMISSION_ALL_ACTIONS.length} actions
                </span>
            </div>
        </fieldset>
    )
})

PermissionMatrix.displayName = 'PermissionMatrix'

export default PermissionMatrix
