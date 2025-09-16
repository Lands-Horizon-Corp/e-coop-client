import { createFileRoute } from '@tanstack/react-router'

import SubscriptionPage from '@/modules/home/pages/subscription'

export const Route = createFileRoute('/(landing)/subscription')({
    component: SubscriptionPage,
})
