import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberGenderCreateUpdateFormModal } from '@/modules/member-gender/components/member-gender-create-update-form'
import MemberGenderTable from '@/modules/member-gender/components/member-genders-table'

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
            <MemberGenderCreateUpdateFormModal {...createModal} />
            <MemberGenderTable
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

export default MemberGenderPage
