import { forwardRef, useState } from 'react'

import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_ALL_RESOURCE_ACTION,
} from '@/constants/permission'

import { MagnifyingGlassIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { cn } from '@/lib/utils'

import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, TPermissionAction, TPermissionResource } from '@/types'

interface IPermissionMatrixProps extends IClassProps {
    defaultValues?: Record<string, TPermissionAction[]>
    controlledState?: {
        value: Record<string, TPermissionAction[]>
        onValueChange: (value: Record<string, TPermissionAction[]>) => void
    }
    readOnly?: boolean
}

const PermissionMatrix = forwardRef<
    HTMLFieldSetElement,
    IPermissionMatrixProps
>(
    (
        {
            readOnly,
            className,
            controlledState,
            defaultValues = {},
        }: IPermissionMatrixProps,
        ref
    ) => {
        const [selectedPermissions, setSelectedPermissions] = useInternalState<
            Record<string, TPermissionAction[]>
        >(defaultValues, controlledState?.value, controlledState?.onValueChange)
        const [selectAll, setSelectAll] = useState(false)
        const [searchTerm, setSearchTerm] = useState('')

        const filteredResources = PERMISSION_ALL_RESOURCE_ACTION.filter(
            (resource) =>
                resource.resource
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resource.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )

        const handlePermissionChange = (
            resource: TPermissionResource,
            action: TPermissionAction,
            checked: boolean
        ) => {
            setSelectedPermissions((prev) => {
                const current = prev[resource] || []
                if (checked) {
                    return { ...prev, [resource]: [...current, action] }
                } else {
                    return {
                        ...prev,
                        [resource]: current.filter((p) => p !== action),
                    }
                }
            })
        }

        const getSelectedCount = () => {
            return Object.values(selectedPermissions).reduce(
                (total, perms) => total + perms.length,
                0
            )
        }

        const isResourceAllSelected = (resource: TPermissionResource) => {
            const RESOURCE = PERMISSION_ALL_RESOURCE_ACTION.find(
                (res) => res.resource === resource
            )
            if (!RESOURCE) return false

            return (
                RESOURCE.supportedActions.length ===
                (selectedPermissions[resource] ?? []).length
            )
        }

        const handleSelectAll = (checked: boolean) => {
            setSelectAll(checked)
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
        }

        const handleResourceSelectAll = (
            resource: TPermissionResource,
            actions: TPermissionAction[],
            checked: boolean
        ) => {
            setSelectedPermissions((prev) => {
                const newPerms = { ...prev }
                newPerms[resource] = checked ? actions : []
                return newPerms
            })
        }

        const isPermissionChecked = (
            resource: TPermissionResource,
            action: TPermissionAction
        ) => {
            return selectedPermissions[resource]?.includes(action) || false
        }

        return (
            <fieldset
                ref={ref}
                disabled={readOnly}
                aria-readonly={readOnly}
                className={cn(
                    'bg-background border rounded-lg w-full min-w-0 max-w-full shadow-sm',
                    className
                )}
            >
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="relative max-w-sm">
                            <Input
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary">
                                {getSelectedCount()} permissions selected
                            </Badge>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                                <Label
                                    htmlFor="select-all"
                                    className="font-medium"
                                >
                                    Select All
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <Table
                        className="table-auto bg-background"
                        wrapperClassName="rounded-md [&::-webkit-scrollbar-corner]:bg-transparent border max-h-[500px] ecoop-scroll overflow-auto"
                    >
                        <TableHeader className="sticky top-0 bg-background z-30">
                            <TableRow>
                                <TableHead className="min-w-80 bg-background sticky left-0 z-40 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    Resource
                                </TableHead>
                                <TableHead className="text-center w-[80px] bg-background">
                                    All
                                </TableHead>
                                {PERMISSION_ALL_ACTIONS.map((action) => (
                                    <TableHead
                                        key={action.action}
                                        className="text-center w-[100px] bg-background"
                                    >
                                        {action.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResources.map((resource) => (
                                <TableRow key={resource.resource}>
                                    <TableCell className="w-fit sticky left-0 z-10 bg-background/80 backdrop-blur-sm border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {resource.label}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {resource.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            id={`${resource.resource}-all`}
                                            checked={
                                                isResourceAllSelected(
                                                    resource.resource
                                                ) ||
                                                (resource.supportedActions.some(
                                                    (action) =>
                                                        (
                                                            selectedPermissions[
                                                                resource
                                                                    .resource
                                                            ] || []
                                                        ).includes(action)
                                                ) &&
                                                    'indeterminate')
                                            }
                                            onCheckedChange={(checked) =>
                                                handleResourceSelectAll(
                                                    resource.resource,
                                                    resource.supportedActions,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                    </TableCell>
                                    {PERMISSION_ALL_ACTIONS.map((action) => (
                                        <TableCell
                                            key={action.action}
                                            className="text-center"
                                        >
                                            <Checkbox
                                                id={`${resource.resource}-${action.action}`}
                                                disabled={
                                                    !resource.supportedActions.includes(
                                                        action.action
                                                    )
                                                }
                                                checked={isPermissionChecked(
                                                    resource.resource,
                                                    action.action
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionChange(
                                                        resource.resource,
                                                        action.action,
                                                        checked as boolean
                                                    )
                                                }
                                                className="duration-200 ease-in-out data-[state=checked]:border-primary"
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredResources.length === 0 && searchTerm && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground/70 text-sm">
                                No resources found matching "{searchTerm}"
                            </p>
                        </div>
                    )}
                </div>
            </fieldset>
        )
    }
)

PermissionMatrix.displayName = 'PermissionMatrix'

export default PermissionMatrix
