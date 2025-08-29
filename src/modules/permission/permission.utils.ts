import {
    TEntityId,

} from '@/types'
import { TPermission, TPermissionAction, TPermissionResource } from './permission.types'
import { IUserOrganization } from '../user-organization'

export function hasPermission<TResourceData extends { id: TEntityId }>(
    userOrg: IUserOrganization,
    resourceType: TPermissionResource,
    action: TPermissionAction,
    resource?: TResourceData
): boolean {
    const generalPerm: TPermission = `${resourceType}:${action}` as TPermission
    const ownPerm: TPermission = `${resourceType}:Own${action}` as TPermission

    if (userOrg.permissions.includes(generalPerm)) {
        return true
    }

    if (
        resource &&
        userOrg.permissions.includes(ownPerm) &&
        resource.id === userOrg.id
    ) {
        return true
    }

    return false
}

export const getCrudPermissions = <TResourceData extends { id: TEntityId }>(
    userOrg: IUserOrganization,
    resourceType: TPermissionResource,
    resource?: TResourceData
) => {
    return {
        create: hasPermission(userOrg, resourceType, 'Create', resource),
        read: hasPermission(userOrg, resourceType, 'Read', resource),
        update: hasPermission(userOrg, resourceType, 'Update', resource),
        edit: hasPermission(userOrg, resourceType, 'Update', resource),
        delete: hasPermission(userOrg, resourceType, 'Delete', resource),
        export: hasPermission(userOrg, resourceType, 'Export', resource),
    }
}

export const permissionArrayToMap = (perms: string[]) => {
    return perms.reduce(
        (acc, perm) => {
            const [key, action] = perm.split(':')
            if (!acc[key as TPermissionResource])
                acc[key as TPermissionResource] = []
            acc[key as TPermissionResource].push(action as TPermissionAction)
            return acc
        },
        {} as Record<TPermissionResource, TPermissionAction[]>
    )
}

export const permissionMapToPermissionArray = (
    value: Record<string, TPermissionAction[]>
) => {
    return Object.entries(value).flatMap(([key, actions]) =>
        actions.map((action) => `${key}:${action}`)
    )
}
