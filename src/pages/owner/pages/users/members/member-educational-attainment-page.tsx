import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import MemberEducationalAttainmentTable from '@/components/tables/member-educational-attainment-table'
import { MemberEducationalAttainmentCreateUpdateFormModal } from '@/components/forms/member-forms/member-educational-attainment-create-update-form'
import MemberEducationalAttainmentTableOwnerAction from '@/components/tables/member-educational-attainment-table/row/member-educational-attainment-owner-action'

const OwnerMemberEducationalAttainmentPage = () => {
    const [createModal, setCreateModal] = useState(false)

    return (
        <PageContainer>
            <MemberEducationalAttainmentCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
            />
            <MemberEducationalAttainmentTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                actionComponent={(props) => (
                    <MemberEducationalAttainmentTableOwnerAction {...props} />
                )}
                toolbarProps={{
                    createActionProps: { onClick: () => setCreateModal(true) },
                }}
            />
        </PageContainer>
    )
}

export default OwnerMemberEducationalAttainmentPage
