import { createFileRoute } from '@tanstack/react-router'

import LoanSchemeEditor from '@/components/computation-sheet-scheme/computation-sheet-scheme-editor'
import PageContainer from '@/components/containers/page-container'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/computation-sheet-scheme/'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <LoanSchemeEditor />
        </PageContainer>
    )
}
