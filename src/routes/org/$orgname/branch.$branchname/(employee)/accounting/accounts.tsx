import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import FinancialStatementTreeViewer from './-components/financial-statement-tree'
import GeneralLedgerTreeViewer from './-components/general-ledger-tree'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
import { useQuery } from '@tanstack/react-query'
import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'

const FINANCIAL_DATA_FILE_PATH = '/data/financialStatementDefinitionSample.json'
const GL_DATA_FILE_PATH = '/data/generalLedgerDefinitionSample.json'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/accounting/accounts'
)({
    component: RouteComponent,
})

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
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
        refetchOnWindowFocus: false, // Prevents automatic refetching on window focus
    })
}

export const useTemporaryFetchGeneralLedgerDefinationData = () => {
    return useQuery<IGeneralLedgerDefinition[], Error>({
        queryKey: ['GeneralLEdgerDefinitions'],
        queryFn: async () => {
            const response = await fetch(GL_DATA_FILE_PATH)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
}

function RouteComponent() {
    const { data: financialTreeData } =
        useTemporaryFetchFinancialStatementDefinationData()

    const { data: GLTreeData } = useTemporaryFetchGeneralLedgerDefinationData()

    if (!financialTreeData || financialTreeData.length === 0 || !GLTreeData) {
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
            <div className="flex w-full">
                <FinancialStatementTreeViewer treeData={financialTreeData} />
                <GeneralLedgerTreeViewer treeData={GLTreeData} />
            </div>
        </PageContainer>
    )
}
