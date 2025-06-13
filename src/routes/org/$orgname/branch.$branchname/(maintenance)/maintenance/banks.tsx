import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import BankTable from '@/components/tables/bank-table'
import BankAction from '@/components/tables/bank-table/action'
import PageContainer from '@/components/containers/page-container'
import { BankCreateUpdateFormModal } from '@/components/forms/bank-create-update-form'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/banks'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`bank.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bank', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <BankCreateUpdateFormModal {...createModal} />
            <BankTable
                actionComponent={(props) => <BankAction {...props} />}
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
