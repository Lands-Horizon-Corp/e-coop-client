import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'
import AccountsTable from '@/components/tables/account-table'
import AccountTableAction from '@/components/tables/account-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'

import AccountTag from './-component/account-tag'

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
                        otherActionLeft: <AccountTag />,
                    }}
                    actionComponent={(prop) => <AccountTableAction {...prop} />}
                />
            </div>
        </PageContainer>
    )
}
