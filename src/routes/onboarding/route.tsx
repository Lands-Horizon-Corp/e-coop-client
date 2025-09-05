import { createFileRoute } from '@tanstack/react-router'

import { Onboarding } from '@/modules/organization'

export const Route = createFileRoute('/onboarding')({
    component: () => {
        return <Onboarding />
    },
})
