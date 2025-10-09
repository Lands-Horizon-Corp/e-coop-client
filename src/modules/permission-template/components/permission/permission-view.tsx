import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { PermissionActionBadge } from '@/modules/permission/components/permission-action-badge'
import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_ALL_RESOURCE_ACTION,
} from '@/modules/permission/permission.constants'
import {
    TPermission,
    TPermissionResource,
} from '@/modules/permission/permission.types'
import { permissionArrayToMap } from '@/modules/permission/permission.utils'

import { MagnifyingGlassIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import useDebounce from '@/hooks/use-debounce'

import { IBaseProps } from '@/types'

import { PERMISSION_RESOURCE_ICON_MAP } from '.'

interface Props extends IBaseProps {
    permissions: TPermission[]
}

const PermissionView = ({ permissions, className }: Props) => {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)

    const perms = useMemo(() => {
        if (!debouncedSearch) return permissionArrayToMap(permissions)
        const fuse = new Fuse(permissions, {
            keys: ['label', 'description', 'resource'],
            threshold: 0.3,
        })
        const filtered = fuse.search(debouncedSearch).map((res) => res.item)
        return permissionArrayToMap(filtered)
    }, [permissions, debouncedSearch])

    const allPerms = useMemo(() => {
        return PERMISSION_ALL_RESOURCE_ACTION.reduce(
            (acc, curr) => {
                acc[curr.resource] = curr
                return acc
            },
            {} as Record<
                string,
                (typeof PERMISSION_ALL_RESOURCE_ACTION)[number]
            >
        )
    }, [])

    const allActions = useMemo(() => {
        return PERMISSION_ALL_ACTIONS.reduce(
            (acc, curr) => {
                acc[curr.action] = curr
                return acc
            },
            {} as Record<string, (typeof PERMISSION_ALL_ACTIONS)[number]>
        )
    }, [])

    return (
        <div
            className={cn(
                'min-h-0 max-h-full bg-popover flex flex-col',
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="shrink-0 p-4 space-y-2">
                <div className="flex shrink-0 w-full justify-between items-center">
                    <p className="text-lg">Permission View</p>
                    <Badge variant="outline">
                        {permissions.length} permissions
                    </Badge>
                </div>
                <div className="relative">
                    <Input
                        className="rounded-xl pr-10 pl-4"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search permissions, resource, or description..."
                        value={search}
                    />
                    <MagnifyingGlassIcon className="mr-2 absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
                </div>
            </div>
            <Separator />
            <div className="overflow-y-auto bg-background ecoop-scroll">
                {Object.entries(perms).map(([resource, perms]) => {
                    const { label: resourceLabel, description } = allPerms[
                        resource
                    ] ?? {
                        label: resource,
                        description: '',
                    }

                    const Icon =
                        PERMISSION_RESOURCE_ICON_MAP[
                            resource as TPermissionResource
                        ]

                    return (
                        <div className="space-y-1 p-2" key={resource}>
                            <div className="p-2 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">
                                        {resourceLabel}
                                    </p>

                                    <p className="text-sm text-muted-foreground/70">
                                        {description}
                                    </p>
                                </div>
                                <Badge className="text-xs" variant="secondary">
                                    {perms.length} Permission
                                    {perms.length > 1 ? 's' : ''}
                                </Badge>
                            </div>
                            <div>
                                {perms.map((perm) => {
                                    const { label, description } = allActions[
                                        perm
                                    ] ?? {
                                        label: perm,
                                        description: '',
                                    }

                                    return (
                                        <div
                                            className="px-4 first:rounded-t-xl first:border-t-none border-y last:border-b-none last:rounded-b-xl border-x bg-secondary/70 dark:bg-card/70 py-2 hover:bg-card/90 ease-in-out duration-200 flex items-center gap-x-1"
                                            key={perm}
                                        >
                                            {Icon && (
                                                <Icon className="mr-2 inline size-5" />
                                            )}
                                            <div className="w-full flex justify-between items-center">
                                                <div className="gap-x-4">
                                                    <p className="text-foreground/90">
                                                        {label} -{' '}
                                                        {resourceLabel}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/80">
                                                        {description}
                                                    </p>
                                                </div>
                                                <PermissionActionBadge
                                                    action={perm}
                                                    className="shrink-none"
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                {Object.entries(perms).length === 0 &&
                    permissions.length !== 0 && (
                        <div className="p-8">
                            <p className="w-full text-center text-sm text-muted-foreground/80">
                                permission "{debouncedSearch}" does not exist
                            </p>
                        </div>
                    )}
                {permissions.length === 0 && (
                    <div className="p-8">
                        <p className="w-full text-center text-sm text-muted-foreground/80">
                            Empty permission
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export const PermissionViewModal = ({
    className,
    permissions,
    ...props
}: IModalProps & Omit<Props, 'className'>) => {
    return (
        <Modal
            {...props}
            className={cn(
                'max-h-[90vh] !overflow-clip max-w-[90vw] !gap-y-0 border p-0 shadow-none backdrop-blur-none sm:max-w-2xl',
                className
            )}
            closeButtonClassName="hidden"
            descriptionClassName="!hidden"
            titleClassName="!hidden"
        >
            <PermissionView
                className="max-h-[90vh]"
                permissions={permissions}
            />
        </Modal>
    )
}
export default PermissionView
