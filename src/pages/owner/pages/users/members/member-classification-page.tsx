import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import MemberClassificationTable from '@/components/tables/member-classification-table'
import { MemberClassificationCreateUpdateFormModal } from '@/components/forms/member-forms/member-classification-create-update-form'
import MemberClassificationTableOwnerAction from '@/components/tables/member-classification-table/row-actions/member-classification-table-owner-action'

const MemberClassificationPage = () => {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <MemberClassificationCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
            />
            <MemberClassificationTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: { onClick: () => setCreateModal(true) },
                }}
                actionComponent={(props) => (
                    <MemberClassificationTableOwnerAction {...props} />
                )}
            />
        </PageContainer>
    )
}

export default MemberClassificationPage
