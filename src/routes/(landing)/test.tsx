import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import { financialStatementDefinitionSample } from '@/types/coop-types/financial-statement-definition'
import { IFinancialStatementAccountsGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'

import FinancialStatementTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/financial-statement-tree'
import GeneralLedgerTreeViewer from '../org/$orgname/branch.$branchname/(employee)/accounting/-components/general-ledger-tree'
import { generalLedgerDefinitionSample } from '@/types/coop-types/general-ledger-definitions'

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
    return (
        <div>
            <PageContainer>
                <div className="flex w-full flex-col bg-black">
                    <FinancialStatementTreeViewer
                        treeData={financialStatementDefinitionSample}
                    />
                    <GeneralLedgerTreeViewer
                        treeData={generalLedgerDefinitionSample}
                    />
                </div>
            </PageContainer>
        </div>
    )
}
