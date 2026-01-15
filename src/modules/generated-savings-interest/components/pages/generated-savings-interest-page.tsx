import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { GeneratedSavingsInterestCreateFormModal } from '../forms/generate-savings-interest-create-form'
import GeneratedSavingsInterestTable from '../tables/generated-savings-interest-table'

const GeneratedSavingsInterestPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: {
                branch_id,
                branch: {
                    branch_setting: { tax_interest },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`generated-savings-interest.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['generated-savings-interest'],
        })
    )

    useSubscribe(`generated-savings-interest.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['generated-savings-interest'],
        })
    )

    useSubscribe(`generated-savings-interest.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['generated-savings-interest'],
        })
    )

    return (
        <PageContainer>
            {/* TODO: Create GeneratedSavingsInterestCreateUpdateFormModal */}
            <GeneratedSavingsInterestCreateFormModal
                formProps={{
                    defaultValues: {
                        interest_tax_rate: tax_interest,
                    },
                }}
                {...createModal}
            />
            <GeneratedSavingsInterestTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default GeneratedSavingsInterestPage
