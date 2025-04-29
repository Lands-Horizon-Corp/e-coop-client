import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import MemberTypeTable from '@/components/tables/member-type-table'
import EnsureOwnerCompany from '@/pages/owner/components/ensure-company'
import { MemberTypeCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-create-update-form'
import MemberTypeTableOwnerAction from '@/components/tables/member-type-table/row-actions/member-type-owner-action'

const OwnerViewMemberTypesPage = () => {
    const [modalState, setModalState] = useState(false)

    return (
        <PageContainer>
            <EnsureOwnerCompany disabled>
                <MemberTypeCreateUpdateFormModal
                    open={modalState}
                    onOpenChange={setModalState}
                />
                <MemberTypeTable
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => setModalState(true),
                        },
                    }}
                    actionComponent={(prop) => (
                        <MemberTypeTableOwnerAction {...prop} />
                    )}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                />
            </EnsureOwnerCompany>
        </PageContainer>
    )
}

export default OwnerViewMemberTypesPage
