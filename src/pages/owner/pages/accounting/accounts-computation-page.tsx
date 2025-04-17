import PageContainer from '@/components/containers/page-container'
import { ComputationTypeCreateFormModal } from '@/components/forms/computation-type-forms/computation-type-create-update-form'
import AccountsComputationTypeTable from '@/components/tables/computation-type-table'
import ComputationTypeTableOwnerAction from '@/components/tables/computation-type-table/row-actions/computation-type-owner-actions'
import { useState } from 'react'

const AccountsComputationPage = () => {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <ComputationTypeCreateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                className="w-[30rem]"
            />

            <AccountsComputationTypeTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
                className="min-h-[90vh] w-full"
                actionComponent={(props) => (
                    <ComputationTypeTableOwnerAction {...props} />
                )}
            />
        </PageContainer>
    )
}

export default AccountsComputationPage
