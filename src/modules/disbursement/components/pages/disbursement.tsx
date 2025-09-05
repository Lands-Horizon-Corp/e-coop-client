import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import DisbursementTable from '../disbursement-table'
import DisbursementAction from '../disbursement-table/row-action-context'
import { DisbursementCreateUpdateFormModal } from '../forms/disbursement-create-update-form'

const DisbursementPage = () => {
    const createModal = useModalState()
    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`disbursement.create.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'paginated'],
        })
    )

    useSubscribe(`disbursement.update.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'paginated'],
        })
    )

    useSubscribe(`disbursement.delete.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['dibursement', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <DisbursementCreateUpdateFormModal {...createModal} />
            <DisbursementTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                actionComponent={(props) => <DisbursementAction {...props} />}
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

export default DisbursementPage
