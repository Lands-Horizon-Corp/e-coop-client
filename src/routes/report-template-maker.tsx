import { createFileRoute } from '@tanstack/react-router'

import NunjucksTemplateEditor from '@/modules/generated-report/components/generated-report-template-maker'

import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute('/report-template-maker')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <NunjucksTemplateEditor />
        </PageContainer>
    )
}
