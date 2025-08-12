import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { AccountCategoryFormModal } from '@/components/forms/account-category-forms/account-category-create-update-form'
import AccountCategoryTable from '@/components/tables/account-category-table'
import AccountCategoryAction from '@/components/tables/account-category-table/row-action-context'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-category'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const [createModal, setCreateModal] = useState(false)
    const invalidateQueries = useQueryClient()

    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    return (
        <PageContainer>
            <AccountCategoryFormModal
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
            <AccountCategoryTable
                actionComponent={(props) => (
                    <AccountCategoryAction {...props} />
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
