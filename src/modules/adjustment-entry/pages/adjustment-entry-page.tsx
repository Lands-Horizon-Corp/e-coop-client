// src/modules/adjustment-entry/pages/AdjustmentEntryPage.tsx
import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { AdjustmentEntryCreateUpdateFormModal } from '../components/forms/adjustment-entry-form-modal'
import AdjustmentEntryTable from '../components/tables'

const AdjustmentEntryPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryKey = ['adjustment-entry', 'paginated']

    useSubscribe(`adjustment-entry.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey,
        })
    )

    useSubscribe(`adjustment-entry.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey,
        })
    )

    useSubscribe(`adjustment-entry.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey,
        })
    )

    return (
        <PageContainer>
            <AdjustmentEntryCreateUpdateFormModal
                {...createModal}
                title="Create Adjustment Entry"
                description="Enter the details for the new adjustment entry."
            />

            <AdjustmentEntryTable
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

export default AdjustmentEntryPage
