import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { LoanPurposeCreateUpdateFormModal } from '@/components/forms/loan/loan-purpose-create-update-form'
import LoanPurposeTable from '@/components/tables/loan-tables/loan-purpose-table'
import LoanPurposeTableAction from '@/components/tables/loan-tables/loan-purpose-table/action'

import { useModalState } from '@/hooks/use-modal-state'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/loan/loan-purpose'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()

    return (
        <PageContainer>
            <LoanPurposeCreateUpdateFormModal {...createModal} />
            <LoanPurposeTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => <LoanPurposeTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
