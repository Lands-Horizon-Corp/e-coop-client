import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberProfileQuickCreateFormModal } from '@/modules/member-profile/components/forms/member-profile-quick-create-form'
import MemberProfileTable from '@/modules/member-profile/components/tables/members-profile-table'
import { MemberProfileRowContext } from '@/modules/member-profile/components/tables/members-profile-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

function ViewMemberProfilePage() {
    const queryClient = useQueryClient()
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: {
                branch_id,
                organization_id,
                branch: {
                    branch_setting: { default_member_type_id },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`member_profile.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    useSubscribe(`member_profile.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    useSubscribe(`member_profile.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <MemberProfileQuickCreateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        organization_id,
                        branch_id,
                        member_type_id: default_member_type_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <MemberProfileTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                RowContextComponent={MemberProfileRowContext}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default ViewMemberProfilePage
