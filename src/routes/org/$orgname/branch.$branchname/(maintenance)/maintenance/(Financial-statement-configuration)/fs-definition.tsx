import PageContainer from '@/components/containers/page-container'
import FinancialStatementTreeViewer from './-components/financial-statement-tree'

import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const FINANCIAL_DATA_FILE_PATH = '/data/financialStatementDefinitionSample.json'

export const useTemporaryFetchFinancialStatementDefinationData = () => {
    return useQuery<IFinancialStatementDefinition[], Error>({
        queryKey: ['financialStatementDefinitions'],
        queryFn: async () => {
            const response = await fetch(FINANCIAL_DATA_FILE_PATH)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}
export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(Financial-statement-configuration)/fs-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: financialTreeData } =
        useTemporaryFetchFinancialStatementDefinationData()

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
