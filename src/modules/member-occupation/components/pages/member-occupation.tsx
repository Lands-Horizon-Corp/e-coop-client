import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberOccupationCreateUpdateFormModal } from '@/modules/member-occupation/components/member-occupation-create-update-form'
import MemberOccupationTable, {
    MemberOccupationTableProps,
} from '@/modules/member-occupation/components/tables/member-occupation-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberOccupationPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`member_occupation.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'paginated'],
        })
    })

    useSubscribe(`member_occupation.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'paginated'],
        })
    })

    useSubscribe(`member_occupation.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberOccupation">
                <MemberOccupationCreateUpdateFormModal {...createModal} />
                <MemberOccupationTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'MemberOccupation',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'MemberOccupation',
                            }),
                        } as NonNullable<
                            MemberOccupationTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberOccupationPage
