import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberOccupationCreateUpdateFormModal } from '@/modules/member-occupation/components/member-occupation-create-update-form'
import MemberOccupationTable from '@/modules/member-occupation/components/tables/member-occupation-table'

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
            <MemberOccupationCreateUpdateFormModal {...createModal} />
            <MemberOccupationTable
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

export default MemberOccupationPage
