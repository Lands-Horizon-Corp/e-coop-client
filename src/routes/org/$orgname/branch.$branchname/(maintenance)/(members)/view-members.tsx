import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberProfileTable from '@/components/tables/member/members-profile-table'
import { MemberProfileQuickCreateFormModal } from '@/components/forms/member-forms/member-profile-quick-create-form'
import MemberProfileTableEmployeeAction from '@/components/tables/member/members-profile-table/action'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/view-members'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    return (
        <PageContainer>
            <MemberProfileQuickCreateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {
                        organization_id: user_organization.organization_id,
                        branch_id: user_organization.branch_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <MemberProfileTable
                actionComponent={(props) => (
                    <MemberProfileTableEmployeeAction {...props} />
                )}
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
