import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberOccupationCreateUpdateFormModal } from '@/components/forms/member-forms/member-occupation-create-update-form'
import MemberOccupationTable from '@/components/tables/footsteps-table/member/member-occupation-table'
import MemberOccupationTableOwnerAction from '@/components/tables/footsteps-table/member/member-occupation-table/row-actions/member-occupation-table-owner-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/member-occupation'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)
    return (
        <PageContainer>
            <MemberOccupationCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
            />
            <MemberOccupationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberOccupationTableOwnerAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
