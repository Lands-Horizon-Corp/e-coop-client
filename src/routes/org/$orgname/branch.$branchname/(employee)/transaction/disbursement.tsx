import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { DisbursementCreateUpdateFormModal } from '@/components/forms/disbursement-create-update-form'
import DisbursementTable from '@/components/tables/disbursement-table'
import DisbursementTableAction from '@/components/tables/disbursement-table/action'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/disbursement'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()
    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`disbursement.create.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'resource-query'],
        })
    )

    useSubscribe(`disbursement.update.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'resource-query'],
        })
    )

    useSubscribe(`disbursement.delete.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <DisbursementCreateUpdateFormModal {...createModal} />
            <DisbursementTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                actionComponent={(props) => (
                    <DisbursementTableAction {...props} />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick() {
                            createModal.onOpenChange(true)
                        },
                    },
                }}
            />
        </PageContainer>
    )
}
