import { IAuditable, TEntityId } from '@/types'

import { IUserOrganization } from '../user-organization'
import { PERMISSION_BASE_ACTIONS } from './permission.constants'
import {
    TPermission,
    TPermissionAction,
    TPermissionResource,
} from './permission.types'

export interface IHasPermissionOpts<
    TResourceData extends IAuditable = IAuditable,
    TUser extends { user_id: TEntityId } = IUserOrganization,
> {
    userOrg?: TUser | null
    resourceType: TPermissionResource
    action: TPermissionAction
    resource?: TResourceData
}

export function hasPermission({
    userOrg,
    action,
    resourceType,
    resource,
}: IHasPermissionOpts): boolean {
    // NO user org, no permission by default
    if (!userOrg) return false

    // OWNER CAN DO ANYTHING
    if (userOrg.user_type === 'owner') {
        return true
    }

    // CHECKS IF IT OWNS THE RESOURCE(DATA), THIS CHECKS THE CREATEOR USER ID VS RESOURCE CREATED BY ID
    if (action.startsWith('Own')) {
        const ownPerm = `${resourceType}:${action}` as TPermission

        if (resource && userOrg.permissions.includes(ownPerm)) {
            return resource.created_by_id === userOrg.user_id
        }
    }

    // CHECKS IF THE PERMISSION EXISTS ON USER PERMISSIONS LIST
    const generalPerm: TPermission = `${resourceType}:${action}` as TPermission
    if (
        userOrg.permissions.includes(generalPerm) &&
        !action.startsWith('Own')
    ) {
        return true
    }

    // RETURN FALSE BY DEFAULT
    return false
}

// Extract only CRUD PERMS and returned as object of actions
export interface GetCrudPermissionOpts<
    TResourceData extends IAuditable = IAuditable,
    TUser extends { user_id: TEntityId } = IUserOrganization,
> {
    userOrg?: TUser | null
    resourceType: TPermissionResource
    resource?: TResourceData
}

export const getCrudPermissions = ({
    userOrg,
    resourceType,
    resource,
}: GetCrudPermissionOpts): Record<TPermissionAction, boolean> => {
    const CONSTRUCTED_PERMS = PERMISSION_BASE_ACTIONS.reduce(
        (acc, action) => {
            if (!userOrg) {
                acc[action] = false
                return acc
            }

            acc[action] = hasPermission({
                userOrg,
                resourceType,
                action,
                resource,
            })

            return acc
        },
        {} as Record<TPermissionAction, boolean>
    )

    return CONSTRUCTED_PERMS
}

// FOR HELPERS FOR CONVERTING PERMISSION STRING FROM SERVER TO
// ARRAY OR BACK TO PERMISSION STRING
export const permissionArrayToMap = (perms: string[]) => {
    console.time('perm-string-to-map')
    const permMap = perms.reduce(
        (acc, perm) => {
            const [key, action] = perm.split(':')
            if (!acc[key as TPermissionResource])
                acc[key as TPermissionResource] = []
            acc[key as TPermissionResource].push(action as TPermissionAction)
            return acc
        },
        {} as Record<TPermissionResource, TPermissionAction[]>
    )

    console.timeEnd('perm-string-to-map')
    return permMap
}

// CONVERT ROLES BACK TO ARRAY PERMISSION
export const permissionMapToPermissionArray = (
    value: Record<string, TPermissionAction[]>
) => {
    console.time('perm-map-to-perm-array')

    const perms = Object.entries(value).flatMap(([key, actions]) =>
        actions.map((action) => `${key}:${action}`)
    )

    console.timeEnd('perm-map-to-perm-array')

    return perms
}
