import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { Organization } from '@/modules/organization'

const paramSchema = z.object({
    invitation_code: z.string().optional(),
})

export const Route = createFileRoute('/onboarding/organization/')({
    component: () => <Organization />,
    validateSearch: (search) => paramSchema.parse(search),
})
