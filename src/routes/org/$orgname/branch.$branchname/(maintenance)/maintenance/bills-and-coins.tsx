import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { BillsAndCoinCreateUpdateFormModal } from '@/modules/bill-and-coins/components/bills-and-coin-create-update-form'
import BillsAndCoinsTable from '@/modules/bill-and-coins/components/bills-and-coins-table'
import BillsAndCoinsAction from '@/modules/bill-and-coins/components/bills-and-coins-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

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
