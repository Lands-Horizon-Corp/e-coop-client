import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberGenderTable from '@/components/tables/member/member-genders-table'
import MemberGenderTableAction from '@/components/tables/member/member-genders-table/action'
import { MemberGenderCreateUpdateFormModal } from '@/components/forms/member-forms/member-gender-create-update-form'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-gender'
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
                    <MemberGenderTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
