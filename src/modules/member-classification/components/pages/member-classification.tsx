import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberClassificationCreateUpdateFormModal } from '@/modules/member-classification/components/member-classification-create-update-form'
import MemberClassificationTable, {
    MemberClassificationTableProps,
} from '@/modules/member-classification/components/tables/member-classification-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberClassificationPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`member_classification.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'paginated'],
        })
    })

    useSubscribe(`member_classification.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'paginated'],
        })
    })

    useSubscribe(`member_classification.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberClassification">
                <MemberClassificationCreateUpdateFormModal {...createModal} />
                <MemberClassificationTable
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
                            MemberClassificationTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberClassificationPage
