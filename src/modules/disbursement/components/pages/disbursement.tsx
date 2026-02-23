import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import DisbursementTable from '../disbursement-table'
import { DisbursementCreateUpdateFormModal } from '../forms/disbursement-create-update-form'

const DisbursementTypePage = () => {
    const createModal = useModalState()
    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: {
                branch_id,
                branch: {
                    branch_setting: { currency, currency_id },
                },
            },
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
            <PermissionGuard action="Read" resourceType="DisburesmentType">
                <DisbursementCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {
                            currency,
                            currency_id,
                        },
                    }}
                />
                <DisbursementTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick() {
                                createModal.onOpenChange(true)
                            },
                        },
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default DisbursementTypePage
