import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberCenterCreateUpdateFormModal } from '@/modules/member-center/components/member-center-create-update-form'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import MemberCenterTable from '../member-center-table'

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
            <MemberCenterCreateUpdateFormModal {...createModal} />
            <MemberCenterTable
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

export default MemberCenterPage
