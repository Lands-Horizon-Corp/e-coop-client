import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { AccountCategoryFormModal, AccountCategoryTable } from '..'
import { AccountCategoryTableProps } from '../components/tables'
import AccountCategoryAction from '../components/tables/row-action-context'

export const AccountCategoryPage = () => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const [createModal, setCreateModal] = useState(false)
    const queryClient = useQueryClient()

    const { user_organization } = currentAuth

    const organizationId = user_organization.organization_id
    const branchId = user_organization.branch_id

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="AccountCategory">
                <>
                    <AccountCategoryFormModal
                        branchId={branchId}
                        formProps={{
                            defaultValues: {},
                            onSuccess: () => {
                                toast.success(
                                    'Account category created successfully'
                                )
                                queryClient.invalidateQueries({
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
                                    queryClient.invalidateQueries({
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
                                disabled: !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'AccountCategory',
                                    userOrg: user_organization,
                                }),
                            },
                            exportActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Export',
                                    resourceType: 'Account',
                                }),
                            } as NonNullable<
                                AccountCategoryTableProps['toolbarProps']
                            >['exportActionProps'],
                        }}
                    />
                </>
            </PermissionGuard>
        </PageContainer>
    )
}

export default AccountCategoryPage
