import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import FinancialStatementTreeViewer from './-components/financial-statement-tree'
import GeneralLedgerTreeViewer from './-components/general-ledger-tree'
import { financialStatementDefinitionSample } from '@/types/coop-types/financial-statement-definition'
import { generalLedgerDefinitionSample } from '@/types/coop-types/general-ledger-definitions'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/accounting/accounts'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <div className="flex w-full">
                <FinancialStatementTreeViewer
                    treeData={financialStatementDefinitionSample}
                />
                <GeneralLedgerTreeViewer
                    treeData={generalLedgerDefinitionSample}
                />
            </div>
        </PageContainer>
    )
}
