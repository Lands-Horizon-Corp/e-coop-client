import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import BankTable from '@/components/tables/bank-table'
import BankAction from '@/components/tables/bank-table/action'
import PageContainer from '@/components/containers/page-container'
import { BankCreateUpdateFormModal } from '@/components/forms/bank-create-update-form'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/banks'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <BankCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <BankTable
                actionComponent={(props) => <BankAction {...props} />}
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
