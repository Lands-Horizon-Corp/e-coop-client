import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import QuickDepositWithdraw from './-component/quick-deposit-withdraw'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/quick-transfer/withdraw'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer className="flex w-full">
            <QuickDepositWithdraw mode="withdraw" />
        </PageContainer>
    )
}
