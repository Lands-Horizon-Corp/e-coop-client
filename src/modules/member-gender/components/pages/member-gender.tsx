import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import { MemberGenderCreateUpdateFormModal } from '@/modules/member-gender/components/member-gender-create-update-form'
import MemberGenderTable, {
    MemberGenderTableProps,
} from '@/modules/member-gender/components/member-genders-table'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberGenderPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`member_gender.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'paginated'],
        })
    })

    useSubscribe(`member_gender.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'paginated'],
        })
    })

    useSubscribe(`member_gender.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="MemberGender">
                <MemberGenderCreateUpdateFormModal {...createModal} />
                <MemberGenderTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'MemberGender',
                            }),
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'MemberGender',
                            }),
                        } as NonNullable<
                            MemberGenderTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberGenderPage
