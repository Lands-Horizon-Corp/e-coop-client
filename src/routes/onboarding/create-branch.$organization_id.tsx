import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { CreateBranch } from '@/modules/organization'
import { entityIdSchema } from '@/validation'

const routeSchema = z.object({
    organization_id: entityIdSchema,
})

export const Route = createFileRoute(
    '/onboarding/create-branch/$organization_id'
)({
    component: () => {
        return <CreateBranch />
    },
    params: {
        parse: (params) => {
            return routeSchema.parse(params)
        },
    },
})
