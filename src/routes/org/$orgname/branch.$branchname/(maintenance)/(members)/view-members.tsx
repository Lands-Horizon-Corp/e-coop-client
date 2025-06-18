import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberProfileTable from '@/components/tables/member/members-profile-table'
import MemberProfileTableEmployeeAction from '@/components/tables/member/members-profile-table/action'
import { MemberProfileQuickCreateFormModal } from '@/components/forms/member-forms/member-profile-quick-create-form'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/view-members'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id, organization_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`member_profile.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberProfileQuickCreateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        organization_id,
                        branch_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <MemberProfileTable
                actionComponent={(props) => (
                    <MemberProfileTableEmployeeAction {...props} />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
