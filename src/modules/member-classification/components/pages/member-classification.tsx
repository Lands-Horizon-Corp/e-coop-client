import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberClassificationCreateUpdateFormModal } from '@/modules/member-classification/components/member-classification-create-update-form'
import MemberClassificationTable from '@/modules/member-classification/components/tables/member-classification-table'

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
            <MemberClassificationCreateUpdateFormModal {...createModal} />
            <MemberClassificationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default MemberClassificationPage
