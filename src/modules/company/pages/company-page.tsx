import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { CompanyCreateUpdateFormModal } from '../components/forms/company-create-update-modal'
import CompanyTable from '../components/tables'

const CompanyPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`company.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['company', 'paginated'],
        })
    )

    useSubscribe(`company.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['company', 'paginated'],
        })
    )

    useSubscribe(`company.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['company', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Company">
                <CompanyCreateUpdateFormModal {...createModal} />
                <CompanyTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                        },
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default CompanyPage
