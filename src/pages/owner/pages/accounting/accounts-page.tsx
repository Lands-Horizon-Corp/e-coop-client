import PageContainer from '@/components/containers/page-container'
import { AccountsCreateFormModal } from '@/components/forms/accounts-forms/accounts-create-form'
import AccountsTable from '@/components/tables/accounts-table'
import { useState } from 'react'

const AccountsPage = () => {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <AccountsCreateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
            />
            <AccountsTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
                className="min-h-[90vh] w-full"
                actionComponent={() => <></>}
            />
        </PageContainer>
    )
}

export default AccountsPage
