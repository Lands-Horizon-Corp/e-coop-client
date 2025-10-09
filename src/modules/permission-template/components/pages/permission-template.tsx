import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { PermissionTemplateCreateUpdateFormModal } from '../permission-template-create-update-form'
import PermissionTemplateTable from '../permission-template-table'

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
            queryKey: ['permission-template', 'paginated'],
        })
    })

    useSubscribe(`permission_template.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'paginated'],
        })
    })

    useSubscribe(`permission_template.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['permission-template', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionTemplateCreateUpdateFormModal {...createModal} />
            <PermissionTemplateTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default PermissionTemplatePage
