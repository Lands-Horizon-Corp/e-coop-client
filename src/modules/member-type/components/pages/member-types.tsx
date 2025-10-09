import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberTypeCreateUpdateFormModal } from '@/modules/member-type/components/forms/member-type-create-update-form'
import MemberTypeTable from '@/modules/member-type/components/member-type-table'

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
            <MemberTypeCreateUpdateFormModal {...createModal} />
            <MemberTypeTable
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

export default MemberTypePage
