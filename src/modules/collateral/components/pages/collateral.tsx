import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import CollateralTable from '../collateral-table'
import { CollateralCreateUpdateFormModal } from '../forms/collateral-create-update-form'

const CollateralPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`collateral.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'paginated'],
        })
    )

    useSubscribe(`collateral.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'paginated'],
        })
    )

    useSubscribe(`collateral.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['collateral', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <CollateralCreateUpdateFormModal
                {...createModal}
                formProps={{
                    onSuccess: () => {},
                }}
            />
            <CollateralTable
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
export default CollateralPage
