import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import MemberCenterTable from '@/components/tables/member-center-table'
import EnsureOwnerCompany from '@/pages/owner/components/ensure-company'
import MemberCenterTableOwnerAction from '@/components/tables/member-center-table/row-actions/member-center-action'
import { MemberCenterCreateUpdateFormModal } from '@/components/forms/member-forms/member-center-create-update-form'

const OwnerMemberCenterPage = () => {
    const [modalState, setModalState] = useState(false)

    return (
        <PageContainer>
            <EnsureOwnerCompany disabled>
                <MemberCenterCreateUpdateFormModal
                    open={modalState}
                    onOpenChange={setModalState}
                />
                <MemberCenterTable
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => setModalState(true),
                        },
                    }}
                    actionComponent={(prop) => (
                        <MemberCenterTableOwnerAction {...prop} />
                    )}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                />
            </EnsureOwnerCompany>
        </PageContainer>
    )
}

export default OwnerMemberCenterPage
