import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberGenderCreateUpdateFormModal } from '@/components/forms/member-forms/member-gender-create-update-form'
import MemberGenderTable from '@/components/tables/footsteps-table/member/member-genders-table'
import MemberGenderTableOwnerAction from '@/components/tables/footsteps-table/member/member-genders-table/row-actions/member-gender-table-owner-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/member-gender'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)

    return (
        <PageContainer>
            <MemberGenderCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
            />
            <MemberGenderTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberGenderTableOwnerAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
