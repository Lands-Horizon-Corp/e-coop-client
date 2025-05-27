import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import { InivationCodeFormModal } from '@/components/forms/inivitation-code-create-update.form'
import InvitationCodeTable from '@/components/tables/invitation-code-table'
import InvitationCodeAction from '@/components/tables/invitation-code-table/action'

import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(access-and-onboarding)/invitation-code'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { currentAuth: user } = useAuthUser()
    const [createModal, setCreateModal] = useState(false)

    if (
        !user.user_organization?.organization_id ||
        !user.user_organization?.branch_id
    )
        return <>Organization And Branch not Found</>

    const organizationId = user.user_organization.organization_id
    const branchId = user.user_organization.branch_id

    return (
        <PageContainer>
            <InivationCodeFormModal
                open={createModal}
                organizationId={organizationId}
                branchId={branchId}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <InvitationCodeTable
                actionComponent={(props) => <InvitationCodeAction {...props} />}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
