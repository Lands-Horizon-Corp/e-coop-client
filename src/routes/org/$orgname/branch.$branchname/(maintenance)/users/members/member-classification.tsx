import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberClassificationTable from '@/components/tables/member/member-classification-table'
import { MemberClassificationCreateUpdateFormModal } from '@/components/forms/member-forms/member-classification-create-update-form'
import MemberClassificationTableOwnerAction from '@/components/tables/member/member-classification-table/row-actions/member-classification-table-owner-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/member-classification'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)

    return (
        <PageContainer>
            <MemberClassificationCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
            />
            <MemberClassificationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberClassificationTableOwnerAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
