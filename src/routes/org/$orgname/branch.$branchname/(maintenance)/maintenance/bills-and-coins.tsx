import PageContainer from '@/components/containers/page-container'
import { BillsAndCoinCreateUpdateFormModal } from '@/components/forms/bills-and-coin-create-update-form'
import BillsAndCoinsTable from '@/components/tables/bills-and-coins-table'
import BillsAndCoinsAction from '@/components/tables/bills-and-coins-table/action'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/bills-and-coins'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <BillsAndCoinCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <BillsAndCoinsTable
                actionComponent={(props) => <BillsAndCoinsAction {...props} />}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
