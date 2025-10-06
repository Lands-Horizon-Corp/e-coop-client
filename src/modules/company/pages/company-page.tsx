import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

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
            <CompanyCreateUpdateFormModal {...createModal} />
            <CompanyTable
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

export default CompanyPage
