import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { TagTemplateCreateUpdateFormModal } from '@/components/forms/tag-template-create-update-form'
import TagTemplateTable from '@/components/tables/tag-template-table'
import TagTemplateAction from '@/components/tables/tag-template-table/action'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/tag-template'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id, organization_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`tag_template.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'resource-query'],
        })
    )

    useSubscribe(`tag_template.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'resource-query'],
        })
    )

    useSubscribe(`tag_template.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <TagTemplateCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        branch_id,
                        organization_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <TagTemplateTable
                actionComponent={(props) => <TagTemplateAction {...props} />}
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
