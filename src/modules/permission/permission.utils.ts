import { IAuditable, TEntityId } from '@/types'

import { IUserOrganization } from '../user-organization'
import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_BASE_ACTIONS,
} from './permission.constants'
import {
    TPermission,
    TPermissionAction,
    TPermissionResource,
} from './permission.types'

export type TPermissionLogic = 'all' | 'some'

export interface IHasPermissionOpts<
    TResourceData extends IAuditable = IAuditable,
    TUser extends { user_id: TEntityId } = IUserOrganization,
> {
    userOrg?: TUser | null
    resourceType: TPermissionResource
    action: TPermissionAction | TPermissionAction[]
    conditionLogic?: TPermissionLogic
    resource?: TResourceData
}

export function hasPermission({
    userOrg,
    action,
    resourceType,
    resource,
    conditionLogic = 'some',
}: IHasPermissionOpts): boolean {
    if (!userOrg) return false

    // OWNER CAN DO ANYTHING
    if (userOrg.user_type === 'owner') return true

    const actions = Array.isArray(action) ? action : [action]

    // THIS EVALUATE IF THE ACTION IS VALID
    const evaluateAction = (act: TPermissionAction): boolean => {
        // ACTION IS OWN PERMISSION
        if (act.startsWith('Own')) {
            const ownPerm = `${resourceType}:${act}` as TPermission

            if (!resource || resource.created_by_id === undefined) return false
            if (!userOrg.permissions.includes(ownPerm)) return false

            return resource.created_by_id === userOrg.user_id
        }

        // GENERAL PERMISSION
        const generalPerm = `${resourceType}:${act}` as TPermission
        return userOrg.permissions.includes(generalPerm)
    }

    return conditionLogic === 'all'
        ? actions.every(evaluateAction)
        : actions.some(evaluateAction)
}
// Extract only CRUD PERMS and returned as object of actions
export interface GetCrudPermissionOpts<
    TResourceData extends IAuditable = IAuditable,
    TUser extends { user_id: TEntityId } = IUserOrganization,
> extends Omit<
    IHasPermissionOpts<TResourceData, TUser>,
    'action' | 'conditionLogic'
> {}

// HELPER UTIL FUNC
export const getActionDetails = (action: TPermissionAction) => {
    return PERMISSION_ALL_ACTIONS.find(
        (PERM_ACTION) => PERM_ACTION.action === action
    )
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

// CONVERT ROLES BACK TO ARRAY PERMISSION
export const permissionMapToPermissionArray = (
    value: Record<string, TPermissionAction[]>
) => {
    return Object.entries(value).flatMap(([key, actions]) =>
        actions.map((action) => `${key}:${action}`)
    )
}
