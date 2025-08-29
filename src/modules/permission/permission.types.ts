import {
    PERMISSION_ALL_ACTIONS,
    PERMISSION_ALL_RESOURCE_ACTION,
} from './permission.constants'

export type TPermissionAction =
    (typeof PERMISSION_ALL_ACTIONS)[number]['action']

export type TPermissionResource =
    (typeof PERMISSION_ALL_RESOURCE_ACTION)[number]['resource']

export type TPermission = `${TPermissionResource}:${TPermissionAction}`
