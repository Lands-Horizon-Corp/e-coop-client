import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import { IFinancialStatementAccountsGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'
import GeneralLedgerTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/general-ledger-tree'
import FinancialStatementTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/financial-statement-tree'
import {
    useTemporaryFetchFinancialStatementDefinationData,
    useTemporaryFetchGeneralLedgerDefinationData,
} from '../org/$orgname/branch.$branchname/(employee)/accounting/accounts'

export const Route = createFileRoute('/(landing)/test')({
    component: RouteComponent,
})

export const FinancialStatementAccountsGroupingMapper = ({
    data,
}: {
    data?: IFinancialStatementAccountsGrouping
}) => {
    return <div>{data?.name}</div>
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
        <PageContainer className="flex h-fit w-full flex-row items-start overflow-auto bg-black">
            <FinancialStatementTreeViewer treeData={financialTreeData} />
            <GeneralLedgerTreeViewer treeData={GLTreeData} />
        </PageContainer>
    )
}
