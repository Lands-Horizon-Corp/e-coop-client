import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import BankTable from '@/modules/bank/components/bank-table'
import { BankCreateUpdateFormModal } from '@/modules/bank/components/forms/bank-create-update-form'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const BankPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`bank.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'paginated'],
        })
    )

    useSubscribe(`bills_and_coins.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'paginated'],
        })
    )

    useSubscribe(`bills_and_coins.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <BankCreateUpdateFormModal {...createModal} />
            <BankTable
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

export default BankPage
