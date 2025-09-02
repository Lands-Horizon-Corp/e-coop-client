import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { TagTemplateCreateUpdateFormModal } from '../forms/tag-template-create-update-form'
import TagTemplateTable from '../tag-template-table'
import TagTemplateAction from '../tag-template-table/row-action-context'

const TagTemplatePage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id, organization_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`tag_template.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'paginated'],
        })
    )

    useSubscribe(`tag_template.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'paginated'],
        })
    )

    useSubscribe(`tag_template.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['tag-template', 'paginated'],
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
                actionComponent={TagTemplateAction}
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

export default TagTemplatePage
