import { forwardRef, useState } from 'react'

import { cn } from '@/helpers'

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

import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps } from '@/types'

import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_ALL_RESOURCE_ACTION,
} from '../permission.constants'
import { TPermissionAction, TPermissionResource } from '../permission.types'

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
                aria-readonly={readOnly}
                className={cn(
                    'bg-background border rounded-lg w-full min-w-0 max-w-full shadow-sm',
                    className
                )}
                disabled={readOnly}
                ref={ref}
            >
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="relative max-w-sm">
                            <Input
                                className="pl-10"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search resources..."
                                value={searchTerm}
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary">
                                {getSelectedCount()} permissions selected
                            </Badge>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={selectAll}
                                    id="select-all"
                                    onCheckedChange={handleSelectAll}
                                />
                                <Label
                                    className="font-medium"
                                    htmlFor="select-all"
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
                                        className="text-center w-[100px] bg-background"
                                        key={action.action}
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
                                            <div className="text-sm ">
                                                {resource.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
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
                                            className="size-5"
                                            id={`${resource.resource}-all`}
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
                                            className="text-center"
                                            key={action.action}
                                        >
                                            <Checkbox
                                                checked={isPermissionChecked(
                                                    resource.resource,
                                                    action.action
                                                )}
                                                className="duration-200 size-5 ease-in-out data-[state=checked]:border-primary"
                                                disabled={
                                                    !resource.supportedActions.includes(
                                                        action.action
                                                    )
                                                }
                                                id={`${resource.resource}-${action.action}`}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionChange(
                                                        resource.resource,
                                                        action.action,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredResources.length === 0 && searchTerm && (
                        <div className="text-center py-8">
                            <p className="/70 text-sm">
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
