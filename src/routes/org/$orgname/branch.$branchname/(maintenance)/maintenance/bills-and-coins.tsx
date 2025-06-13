import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import BillsAndCoinsTable from '@/components/tables/bills-and-coins-table'
import BillsAndCoinsAction from '@/components/tables/bills-and-coins-table/action'
import { BillsAndCoinCreateUpdateFormModal } from '@/components/forms/bills-and-coin-create-update-form'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQueryClient } from '@tanstack/react-query'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/bills-and-coins'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id, organization_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`bills_and_coins.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bills-and-coins', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bills-and-coins', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['bills-and-coins', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <BillsAndCoinCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        branch_id,
                        organization_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <BillsAndCoinsTable
                actionComponent={(props) => <BillsAndCoinsAction {...props} />}
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
