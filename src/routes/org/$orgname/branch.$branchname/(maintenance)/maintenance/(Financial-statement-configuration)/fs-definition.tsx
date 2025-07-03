import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import { useGetALlFinancialStatement } from '@/hooks/api-hooks/financial-statement-definition'

import FinancialStatementTreeViewer from './-components/financial-statement-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(Financial-statement-configuration)/fs-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: financialTreeData } = useGetALlFinancialStatement()

    if (!financialTreeData || financialTreeData.length === 0) {
        return (
            <PageContainer className="flex h-fit w-full flex-row items-start overflow-auto bg-black">
                <div className="p-4 text-center text-white">
                    No financial statement data available.
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <FinancialStatementTreeViewer treeData={financialTreeData} />
        </PageContainer>
    )
}
