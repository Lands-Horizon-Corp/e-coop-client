import PageContainer from '@/components/containers/page-container'
import { createFileRoute } from '@tanstack/react-router'
import { IFinancialStatementAccountsGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'

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
            <PageContainer>test</PageContainer>
        </div>
    )
}
