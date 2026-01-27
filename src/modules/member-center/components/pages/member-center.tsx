import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberCenterCreateUpdateFormModal } from '@/modules/member-center/components/member-center-create-update-form'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import MemberCenterTable, {
    MemberCenterTableProps,
} from '../member-center-table'

const MemberCenterPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`member_center.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'paginated'],
        })
    })

    useSubscribe(`member_center.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'paginated'],
        })
    })

    useSubscribe(`member_center.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberCenter">
                <MemberCenterCreateUpdateFormModal {...createModal} />
                <MemberCenterTable
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
                            MemberCenterTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberCenterPage
