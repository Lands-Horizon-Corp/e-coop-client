import { createFileRoute } from '@tanstack/react-router'

import AboutUsPage from '@/modules/home/pages/about'

const AboutPage = () => {
    return <AboutUsPage />
}
export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})
