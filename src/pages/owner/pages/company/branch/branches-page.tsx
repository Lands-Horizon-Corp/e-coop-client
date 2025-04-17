import { useState } from 'react'

import { BranchCreateFormModal } from '@/components/forms'
import PageContainer from '@/components/containers/page-container'

import EnsureOwnerCompany from '../../../components/ensure-company'

import { ICompanyResource, TEntityId } from '@/server'
import { useUserAuthStore } from '@/store/user-auth-store'
import OwnerBranchesTable from '@/components/tables/branches-table/owner-branches-table'

const OwnerCompanyBranchesPage = () => {
    const { currentUser } = useUserAuthStore()
    const [modal, setModal] = useState(false)
    const [company, setCompany] = useState<ICompanyResource | undefined>()

    return (
        <PageContainer>
            <EnsureOwnerCompany onSuccess={setCompany}>
                {company && currentUser && (
                    <>
                        <BranchCreateFormModal
                            open={modal}
                            onOpenChange={setModal}
                            formProps={{
                                disabledFields: ['companyId'],
                                defaultValues: {
                                    companyId: company.id,
                                    ownerId: company.owner?.id,
                                    longitude: company.longitude,
                                    latitude: company.latitude,
                                },
                            }}
                        />
                        <OwnerBranchesTable
                            ownerId={currentUser.id as TEntityId}
                            toolbarProps={{
                                createActionProps: {
                                    onClick: () => setModal((val) => !val),
                                },
                            }}
                            className="min-h-[90vh] w-full"
                            defaultFilter={{
                                companyId: {
                                    value: company?.id,
                                    mode: 'equal',
                                    displayText: '',
                                    isStaticFilter: true,
                                    dataType: 'number',
                                },
                            }}
                        />
                    </>
                )}
            </EnsureOwnerCompany>
        </PageContainer>
    )
}

export default OwnerCompanyBranchesPage
