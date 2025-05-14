import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberProfileTable from '@/components/tables/member/members-profile-table'
import { MemberProfileQuickCreateFormModal } from '@/components/forms/member-forms/member-profile-quick-create-form'
import MemberProfileTableEmployeeAction from '@/components/tables/member/members-profile-table/row-actions/members-table-employee-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/view-members'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <MemberProfileQuickCreateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {
                        // TODO: Once org was established, and branch id exist, put it here
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
