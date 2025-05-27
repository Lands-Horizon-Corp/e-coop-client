import PageContainer from '@/components/containers/page-container'
import { AccountClassificationFormModal } from '@/components/forms/account-classification-forms/account-classification-create-update-form'
import AccountClassificationTable from '@/components/tables/account-classification-table'
import AccountClassificationAction from '@/components/tables/account-classification-table/action'
import { useAuthUser } from '@/store/user-auth-store'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-classification'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { currentAuth: user } = useAuthUser()
    const [createModal, setCreateModal] = useState(false)
    const invalidateQueries = useQueryClient()
    if (
        !user.user_organization?.organization_id ||
        !user.user_organization?.branch_id
    )
        return <>Organization And Branch not Found</>

    const organizationId = user.user_organization.organization_id
    const branchId = user.user_organization.branch_id

    return (
        <PageContainer>
            <AccountClassificationFormModal
                open={createModal}
                organizationId={organizationId}
                branchId={branchId}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        invalidateQueries.invalidateQueries({
                            queryKey: [
                                'account-classification',
                                'resource-query',
                                organizationId,
                                branchId,
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
