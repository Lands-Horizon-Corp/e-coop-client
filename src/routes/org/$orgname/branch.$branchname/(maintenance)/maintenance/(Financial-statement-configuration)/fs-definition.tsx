import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import { useGetAllFinancialStatementAccountsGroupings } from '@/hooks/api-hooks/financial-statement-definition/use-financial-statement-definition'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(Financial-statement-configuration)/fs-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: getllFinancialStatementDefinitions } =
        useGetAllFinancialStatementAccountsGroupings()

    console.log(
        'Financial Statement Definitions:',
        getllFinancialStatementDefinitions
    )

    return <PageContainer>Hello</PageContainer>
}
