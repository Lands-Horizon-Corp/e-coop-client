import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberTypeCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-create-update-form'
import MemberTypeTable from '@/components/tables/member/member-type-table'
import MemberTypeTableOwnerAction from '@/components/tables/member/member-type-table/row-actions/member-type-owner-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-types'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)
    return (
        <PageContainer>
            <MemberTypeCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
            />
            <MemberTypeTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberTypeTableOwnerAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
