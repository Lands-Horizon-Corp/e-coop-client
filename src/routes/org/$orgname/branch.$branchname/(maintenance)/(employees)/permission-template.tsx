import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { PermissionTemplateCreateUpdateFormModal } from '@/components/forms/permission-template-create-update-form'
import PermissionTemplateTable from '@/components/tables/permission-template-table'
import PermissionTemplateTableAction from '@/components/tables/permission-template-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/permission-template'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()

    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`permission_template.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    useSubscribe(`permission_template.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    useSubscribe(`permission_template.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <PermissionTemplateCreateUpdateFormModal {...createModal} />
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
            />
        </PageContainer>
    )
}
