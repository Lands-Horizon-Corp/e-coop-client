import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

// import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/role-permission-template'
)({
    component: RouteComponent,
})

function RouteComponent() {
    // const createModal = useModalState()

    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`member_profile.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            {/* <PermissionTemplateCreateUpdateFormModal {...createModal} />
            <PermissionTemplateTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <PermissionTemplateTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            /> */}
        </PageContainer>
    )
}
