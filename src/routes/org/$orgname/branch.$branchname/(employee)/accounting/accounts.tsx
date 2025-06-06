import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import FinancialStatementTreeViewer from './-components/financial-statement-tree'
import GeneralLedgerTreeViewer from './-components/general-ledger-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/accounting/accounts'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer>
            <div className="flex">
                <FinancialStatementTreeViewer treeData={[]} />
                <GeneralLedgerTreeViewer treeData={[]} />
            </div>
        </PageContainer>
    )
}
