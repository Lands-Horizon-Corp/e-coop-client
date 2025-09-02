import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    AccountClassificationAction,
    AccountClassificationFormModal,
    AccountClassificationTable,
} from '@/modules/account-classification'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

export const AccountClassificationPage = () => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const invalidateQueries = useQueryClient()
    const [createModal, setCreateModal] = useState(false)

    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    return (
        <PageContainer>
            <AccountClassificationFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                titleClassName="font-bold"
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {
                        toast.success(
                            'Account classification created successfully'
                        )
                        invalidateQueries.invalidateQueries({
                            queryKey: ['account-classification', 'paginated'],
                        })
                    },
                }}
            />
            <AccountClassificationTable
                actionComponent={(props) => (
                    <AccountClassificationAction
                        {...props}
                        onDeleteSuccess={() => {
                            toast.success(
                                '1 account classification deleted successfully'
                            )
                            invalidateQueries.invalidateQueries({
                                queryKey: [
                                    'account-classification',
                                    'paginated',
                                    branchId,
                                    organizationId,
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

export default AccountClassificationPage
