import { useQueryClient } from '@tanstack/react-query'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { AdjustmentEntryTotal } from '../components/adjustment-entry-total'
import { AdjustmentEntryCreateUpdateFormModal } from '../components/forms/adjustment-entry-form-modal'
import AdjustmentEntryTable from '../components/tables'

const AdjustmentEntryPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)

    return (
        <PageContainer>
            <AdjustmentEntryCreateUpdateFormModal
                {...createModal}
                description="Enter the details for the new adjustment entry."
                formProps={{
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['adjustment-entry', 'total'],
                        })
                    },
                }}
                title="Create Adjustment Entry"
            />
            <AdjustmentEntryTable
                className="max-h-[90vh] min-h-[80vh] w-full py-2"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
            <div className="w-full justify-end flex mb-4">
                <AdjustmentEntryTotal />
            </div>
        </PageContainer>
    )
}

export default AdjustmentEntryPage
