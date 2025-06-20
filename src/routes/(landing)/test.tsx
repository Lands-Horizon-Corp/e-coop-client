import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(landing)/test')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer className="flex h-fit w-full flex-row items-start overflow-auto bg-black">
            Test page
        </PageContainer>
    )
}
