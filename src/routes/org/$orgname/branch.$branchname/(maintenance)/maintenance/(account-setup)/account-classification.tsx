import PageContainer from '@/components/containers/page-container'
import { AccountClassificationFormModal } from '@/components/forms/account-classification-forms/account-classification-create-update-form'
import AccountClassificationTable from '@/components/tables/account-classification-table'
import AccountClassificationAction from '@/components/tables/account-classification-table/action'

import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-classification'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const invalidateQueries = useQueryClient()
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <AccountClassificationFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        invalidateQueries.invalidateQueries({
                            queryKey: [
                                'account-classification',
                                'resource-query',
                            ],
                        })
                    },
                }}
            />
            <AccountClassificationTable
                actionComponent={(props) => (
                    <AccountClassificationAction {...props} />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
