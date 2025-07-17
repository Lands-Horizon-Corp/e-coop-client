import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { InivationCodeFormModal } from '@/components/forms/inivitation-code-create-update.form'
import InvitationCodeTable from '@/components/tables/invitation-code-table'
import InvitationCodeAction from '@/components/tables/invitation-code-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(access-and-onboarding)/invitation-code'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [createModal, setCreateModal] = useState(false)
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(
        `invitation_code.create.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

    useSubscribe(
        `invitation_code.update.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

    useSubscribe(
        `invitation_code.delete.branch.${user_organization.branch_id}`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['invitation-code', 'resource-query'],
            })
        }
    )

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
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
