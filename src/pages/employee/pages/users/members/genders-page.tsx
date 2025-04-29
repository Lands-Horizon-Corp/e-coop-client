import { useState } from 'react'

import GenderTable from '@/components/tables/genders-table'
import PageContainer from '@/components/containers/page-container'
import { GenderCreateUpdateFormModal } from '@/components/forms/gender-forms/gender-create-update-form'
import GenderTableOwnerAction from '@/components/tables/genders-table/row-actions/gender-table-owner-action'

const GenderPage = () => {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <GenderCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
            />
            <GenderTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
                actionComponent={(props) => (
                    <GenderTableOwnerAction {...props} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default GenderPage
