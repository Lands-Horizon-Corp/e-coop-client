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
                title="Create Adjustment Entry"
                description="Enter the details for the new adjustment entry."
                formProps={{
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['adjustment-entry', 'total'],
                        })
                    },
                }}
            />
            <AdjustmentEntryTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                className="max-h-[90vh] min-h-[80vh] w-full py-2"
            />
            <div className="w-full justify-end flex mb-4">
                <AdjustmentEntryTotal />
            </div>
        </PageContainer>
    )
}

export default AdjustmentEntryPage
