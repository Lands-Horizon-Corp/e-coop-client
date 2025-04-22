import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import MemberOccupationTable from '@/components/tables/member-occupation-table'
import { MemberOccupationCreateUpdateFormModal } from '@/components/forms/member-forms/member-occupation-create-update-form'
import MemberOccupationTableOwnerAction from '@/components/tables/member-occupation-table/row-actions/member-occupation-table-owner-action'

const OwnerOccupationPage = () => {
    const [createModalState, setCreateModalState] = useState(false)

    return (
        <PageContainer>
            <MemberOccupationCreateUpdateFormModal
                open={createModalState}
                onOpenChange={setCreateModalState}
            />
            <MemberOccupationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModalState((val) => !val),
                    },
                }}
                actionComponent={(props) => (
                    <MemberOccupationTableOwnerAction {...props} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default OwnerOccupationPage
