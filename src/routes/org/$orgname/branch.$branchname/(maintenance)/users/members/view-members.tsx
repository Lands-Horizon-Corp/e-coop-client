// import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberProfileTable from '@/components/tables/footsteps-table/member/members-profile-table'
import MemberProfileTableEmployeeAction from '@/components/tables/footsteps-table/member/members-profile-table/row-actions/members-table-employee-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/view-members'
)({
    component: RouteComponent,
})

function RouteComponent() {
    // const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            {/* <MemberCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {
                        mode: 'create',
                        companyId: company?.id,
                    },
                    onSuccess: () => {},
                }}
            /> */}
            <MemberProfileTable
                actionComponent={(props) => (
                    <MemberProfileTableEmployeeAction {...props} />
                )}
                toolbarProps={
                    {
                        // createActionProps: {
                        //     onClick: () => setCreateModal(true),
                        // },
                    }
                }
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
