import z from 'zod'

import {
    PERMISSION_BASE_ACTIONS,
    PERMISSION_BASE_RESOURCE,
} from './permission.constants'
import { TPermissionAction, TPermissionResource } from './permission.types'

export const PermissionSchema = z.string().refine(
    (val) => {
        const [resource, action] = val.split(':')
        return (
            !!resource &&
            !!action &&
            PERMISSION_BASE_RESOURCE.map((res) => res).includes(
                resource as TPermissionResource
            ) &&
            PERMISSION_BASE_ACTIONS.includes(action as TPermissionAction)
        )
    },
    {
        message:
            'Invalid permission string. Must be in the form Resource:Action and both must be valid.',
    }
)
