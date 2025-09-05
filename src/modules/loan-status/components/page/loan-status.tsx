import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { LoanStatusCreateUpdateFormModal } from '../forms/loan-status-create-update-form'
import LoanStatusTable from '../loan-status-table'
import LoanStatusAction from '../loan-status-table/row-action-context'

const LoanStatusPage = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <LoanStatusCreateUpdateFormModal {...createModal} />
            <LoanStatusTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={LoanStatusAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default LoanStatusPage
