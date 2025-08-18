import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { CollateralCreateUpdateFormModal } from '@/components/forms/collateral-create-update-form'
import CollateralTable from '@/components/tables/collateral-table'
import CollateralAction from '@/components/tables/collateral-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/collateral'
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

    useSubscribe(`collateral.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'resource-query'],
        })
    )

    useSubscribe(`collateral.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'resource-query'],
        })
    )

    useSubscribe(`collateral.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <CollateralCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        branch_id,
                        organization_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <CollateralTable
                actionComponent={(props) => <CollateralAction {...props} />}
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
