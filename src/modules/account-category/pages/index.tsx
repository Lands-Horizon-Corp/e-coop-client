import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { AccountCategoryFormModal, AccountCategoryTable } from '..'
import AccountCategoryAction from '../components/tables/row-action-context'

export const AccountCategoryPage = () => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const [createModal, setCreateModal] = useState(false)
    const invalidateQueries = useQueryClient()

    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    return (
        <PageContainer>
            <AccountCategoryFormModal
                branchId={branchId}
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        toast.success('Account category created successfully')
                        invalidateQueries.invalidateQueries({
                            queryKey: [
                                'account-category',
                                'paginated',
                                organizationId,
                                branchId,
                            ],
                        })
                    },
                }}
                onOpenChange={setCreateModal}
                open={createModal}
                organizationId={organizationId}
                titleClassName="font-bold"
            />
            <AccountCategoryTable
                actionComponent={(props) => (
                    <AccountCategoryAction
                        {...props}
                        onDeleteSuccess={() => {
                            toast.success(
                                '1 account category deleted successfully'
                            )
                            invalidateQueries.invalidateQueries({
                                queryKey: [
                                    'account-category',
                                    'paginated',
                                    organizationId,
                                    branchId,
                                ],
                            })
                        }}
                    />
                )}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => setCreateModal(true),
                    },
                }}
            />
        </PageContainer>
    )
}
export default AccountCategoryPage
