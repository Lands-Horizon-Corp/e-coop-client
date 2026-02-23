import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { PermissionTemplateCreateUpdateFormModal } from '../permission-template-create-update-form'
import PermissionTemplateTable, {
    PermissionTemplateTableProps,
} from '../permission-template-table'

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
            <PermissionGuard action="Read" resourceType="PermissionTemplate">
                <PermissionTemplateCreateUpdateFormModal {...createModal} />
                <PermissionTemplateTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'PermissionTemplate',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'PermissionTemplate',
                            }),
                        } as NonNullable<
                            PermissionTemplateTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default PermissionTemplatePage
