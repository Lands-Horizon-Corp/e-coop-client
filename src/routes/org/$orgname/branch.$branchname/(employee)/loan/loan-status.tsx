import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import LoanStatusTable from '@/components/tables/loan-tables/loan-status-table'
import LoanStatusTableAction from '@/components/tables/loan-tables/loan-status-table/action'
import { LoanStatusCreateUpdateFormModal } from '@/components/forms/loan/loan-status-create-update-form'

import { useModalState } from '@/hooks/use-modal-state'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/loan-status'
)({
    component: RouteComponent,
})

function RouteComponent() {
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
                actionComponent={(prop) => <LoanStatusTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
