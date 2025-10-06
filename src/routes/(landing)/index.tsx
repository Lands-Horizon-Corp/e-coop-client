import { createFileRoute } from '@tanstack/react-router'

import HomePage from '@/modules/home/pages'

const LandingPage = () => {
    return <HomePage />
}

export const Route = createFileRoute('/(landing)/')({
    component: LandingPage,
})
