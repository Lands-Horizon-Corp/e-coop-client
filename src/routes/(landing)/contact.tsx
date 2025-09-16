import { createFileRoute } from '@tanstack/react-router'

import ContactPage from '@/modules/home/pages/contact-us'

export const Route = createFileRoute('/(landing)/contact')({
    component: ContactPage,
})
