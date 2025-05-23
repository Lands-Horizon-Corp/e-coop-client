import PageContainer from '@/components/containers/page-container'
import { MemberGroupCreateUpdateFormModal } from '@/components/forms/member-forms/member-group-create-update-form'
import MemberGroupTable from '@/components/tables/member/member-group-table'
import MemberGroupTableAction from '@/components/tables/member/member-group-table/member-group-table-action'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-group'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [modalState, setModalState] = useState(false)
    return (
        <PageContainer>
            <MemberGroupCreateUpdateFormModal
                open={modalState}
                onOpenChange={setModalState}
                formProps={{
                    onSuccess() {
                        setModalState(false)
                    },
                }}
            />
            <MemberGroupTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setModalState(true),
                    },
                }}
                actionComponent={(prop) => <MemberGroupTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
