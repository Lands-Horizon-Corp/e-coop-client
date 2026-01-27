import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberGroupCreateUpdateFormModal } from '@/modules/member-group/components/member-group-create-update-form'
import MemberGroupTable, {
    MemberGroupTableProps,
} from '@/modules/member-group/components/member-group-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberGroupPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`member_group.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'paginated'],
        })
    })

    useSubscribe(`member_group.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'paginated'],
        })
    })

    useSubscribe(`member_group.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberGroup">
                <MemberGroupCreateUpdateFormModal {...createModal} />
                <MemberGroupTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'Account',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'Account',
                            }),
                        } as NonNullable<
                            MemberGroupTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberGroupPage
