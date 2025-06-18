import AccountsTable from '@/components/tables/account-table'
import PageContainer from '@/components/containers/page-container'
import AccountTableAction from '@/components/tables/account-table/action'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'

import { useModalState } from '@/hooks/use-modal-state'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/accounting/accounts'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()

    return (
        <PageContainer>
            <div className="flex w-full flex-col items-start gap-4">
                <AccountCreateUpdateFormModal {...createModal} />
                <AccountsTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                        },
                    }}
                    actionComponent={(prop) => <AccountTableAction {...prop} />}
                />
            </div>
        </PageContainer>
    )
}
