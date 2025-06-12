import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberCenterTable from '@/components/tables/member/member-center-table'
import { MemberCenterCreateUpdateFormModal } from '@/components/forms/member-forms/member-center-create-update-form'
import MemberCenterTableOwnerAction from '@/components/tables/member/member-center-table/row-actions/member-center-action'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-center'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)
    return (
        <PageContainer>
            <MemberCenterCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
                formProps={{
                    onSuccess() {
                        setModalState(false)
                    },
                }}
            />
            <MemberCenterTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberCenterTableOwnerAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
