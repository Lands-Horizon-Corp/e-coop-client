import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { LoanPurposeCreateUpdateFormModal } from '../forms/loan-purpose-create-update-form'
import LoanPurposeTable from '../loan-purpose-table'
import LoanPurposeAction from '../loan-purpose-table/row-action-context'

const LoanPurposePage = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <LoanPurposeCreateUpdateFormModal {...createModal} />
            <LoanPurposeTable
                actionComponent={LoanPurposeAction}
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

export default LoanPurposePage
