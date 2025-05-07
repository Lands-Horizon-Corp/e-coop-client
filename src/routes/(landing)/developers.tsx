import { createFileRoute } from '@tanstack/react-router'

const DevelopersPage = () => {
    return <div className="h-[100vh]">Hello Developers</div>
}

export const Route = createFileRoute('/(landing)/developers')({
    component: DevelopersPage,
})
export default DevelopersPage
