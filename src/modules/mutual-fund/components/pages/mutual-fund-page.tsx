import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { MutualFundCreateUpdateFormModal } from '../forms/mutual-fund-create-update-form/mutual-fund-create-update-form'
import MutualFundTable from '../mutual-fund-table'

const MutualFundPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`mutual-fund.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['mutual-fund'],
        })
    )

    useSubscribe(`mutual-fund.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['mutual-fund'],
        })
    )

    useSubscribe(`mutual-fund.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['mutual-fund'],
        })
    )

    return (
        <PageContainer>
            <MutualFundCreateUpdateFormModal
                formProps={{
                    onSuccess: () => createModal.onOpenChange(false),
                }}
                {...createModal}
            />
            <MutualFundTable
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

export default MutualFundPage
