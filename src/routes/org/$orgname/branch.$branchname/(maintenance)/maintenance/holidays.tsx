import { createFileRoute } from '@tanstack/react-router'

import HolidaysTable from '@/components/tables/holidays-table'
import PageContainer from '@/components/containers/page-container'
import HolidayTableAction from '@/components/tables/holidays-table/action'
import { BankCreateUpdateFormModal } from '@/components/forms/bank-create-update-form'

import { useModalState } from '@/hooks/use-modal-state'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/holidays'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()

    return (
        <PageContainer>
            <BankCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <HolidaysTable
                actionComponent={HolidayTableAction}
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
