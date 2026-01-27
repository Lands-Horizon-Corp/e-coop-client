import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberTypeCreateUpdateFormModal } from '@/modules/member-type/components/forms/member-type-create-update-form'
import MemberTypeTable, {
    MemberTypeTableProps,
} from '@/modules/member-type/components/member-type-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberTypePage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`member_type.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'paginated'],
        })
    })

    useSubscribe(`member_type.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'paginated'],
        })
    })

    useSubscribe(`member_type.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberType">
                <MemberTypeCreateUpdateFormModal {...createModal} />
                <MemberTypeTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'MemberProfile',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'MemberProfile',
                            }),
                        } as NonNullable<
                            MemberTypeTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberTypePage
