import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
import GeneralLedgerTreeViewer from '../../../(employee)/accounting/-components/general-ledger-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(general-ledger-management)/gl-definition'
)({
    component: RouteComponent,
})

const GL_DATA_FILE_PATH = '/data/generalLedgerDefinitionSample.json'

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
    const { data: GLTreeData } = useTemporaryFetchGeneralLedgerDefinationData()

    if (!GLTreeData || GLTreeData.length === 0 || !GLTreeData) {
        return (
            <PageContainer className="flex h-fit w-full flex-row items-start overflow-auto">
                <div className="p-4 text-center">
                    No General Definition data available.
                </div>
            </PageContainer>
        )
    }
    return (
        <PageContainer>
            <GeneralLedgerTreeViewer treeData={GLTreeData} />
        </PageContainer>
    )
}
