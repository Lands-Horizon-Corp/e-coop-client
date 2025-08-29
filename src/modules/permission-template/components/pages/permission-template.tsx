import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { PermissionTemplateCreateUpdateFormModal } from '../permission-template-create-update-form'
import PermissionTemplateTable from '../permission-template-table'
import PermissionTemplateAction from '../permission-template-table/row-action-context'

const PermissionTemplatePage = () => {
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
                    <PermissionTemplateAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default PermissionTemplatePage
