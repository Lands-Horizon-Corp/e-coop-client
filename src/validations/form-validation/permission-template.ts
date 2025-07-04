import z from 'zod'

import {
    PERMISSION_BASE_ACTIONS,
    PERMISSION_BASE_RESOURCE,
} from '@/constants/permission'

import { TPermissionAction, TPermissionResource } from '@/types'

import { entityIdSchema } from '../common'

export const permissionSchema = z.string().refine(
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

export const permissionTemplateSchema = z.object({
    id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    name: z.coerce.string().min(1, 'Role template name is required'),
    description: z.string().min(1, 'A simple/short description is required'),
    permissions: z
        .array(permissionSchema)
        .min(1, 'Must have atleast 1 permission'),
})
