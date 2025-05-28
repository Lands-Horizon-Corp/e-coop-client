import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import { InivationCodeFormModal } from '@/components/forms/inivitation-code-create-update.form'
import InvitationCodeTable from '@/components/tables/invitation-code-table'
import InvitationCodeAction from '@/components/tables/invitation-code-table/action'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(access-and-onboarding)/invitation-code'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <InivationCodeFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <InvitationCodeTable
                actionComponent={(props) => <InvitationCodeAction {...props} />}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
