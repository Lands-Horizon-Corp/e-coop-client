import { useState } from 'react'

import MembersTable from '@/components/tables/members-table'
import PageContainer from '@/components/containers/page-container'
import EnsureOwnerCompany from '@/pages/owner/components/ensure-company'
import { MemberCreateUpdateFormModal } from '@/components/forms/member-forms/member-create-update-form'

import { ICompanyResource } from '@/server'
import MembersTableOwnerAction from '@/components/tables/members-table/row-actions/members-table-owner-action'

const OwnerViewMembersPage = () => {
    const [createModal, setCreateModal] = useState(false)
    const [company, setCompany] = useState<ICompanyResource | undefined>(
        undefined
    )

    return (
        <PageContainer>
            <MemberCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    defaultValues: {
                        mode: 'create',
                        companyId: company?.id,
                    },
                    onSuccess: () => {},
                }}
            />
            <EnsureOwnerCompany disabled onSuccess={setCompany}>
                <MembersTable
                    actionComponent={(props) => (
                        <MembersTableOwnerAction {...props} />
                    )}
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => setCreateModal(true),
                        },
                    }}
                    defaultFilter={{
                        companyId: {
                            mode: 'equal',
                            displayText: '',
                            dataType: 'number',
                            value: company?.id,
                            isStaticFilter: true,
                        },
                    }}
                    className="max-h-[90vh] min-h-[90vh] w-full"
                />
            </EnsureOwnerCompany>
        </PageContainer>
    )
}

export default OwnerViewMembersPage
