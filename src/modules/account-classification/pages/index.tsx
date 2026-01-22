import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    AccountClassificationAction,
    AccountClassificationFormModal,
    AccountClassificationTable,
} from '@/modules/account-classification'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { AccountClassificationTableProps } from '../components/tables'

export const AccountClassificationPage = () => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()
    const createModal = useModalState(false)

    const { user_organization } = currentAuth

    const organizationId = user_organization.organization_id
    const branchId = user_organization.branch_id

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="AdjustmentEntry">
                <>
                    <AccountClassificationFormModal
                        formProps={{
                            defaultValues: {},
                            onSuccess: () => {
                                toast.success(
                                    'Account classification created successfully'
                                )
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        'account-classification',
                                        'paginated',
                                    ],
                                })
                            },
                        }}
                        {...createModal}
                        titleClassName="font-bold"
                    />

                    <AccountClassificationTable
                        actionComponent={(props) => (
                            <AccountClassificationAction
                                {...props}
                                onDeleteSuccess={() => {
                                    toast.success(
                                        '1 account classification deleted successfully'
                                    )
                                    queryClient.invalidateQueries({
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
                                onClick: () => createModal.onOpenChange(true),
                                disabled: !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'AccountClassification',
                                    userOrg: user_organization,
                                }),
                            },
                            exportActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Export',
                                    resourceType: 'Account',
                                }),
                            } as NonNullable<
                                AccountClassificationTableProps['toolbarProps']
                            >['exportActionProps'],
                        }}
                    />
                </>
            </PermissionGuard>
        </PageContainer>
    )
}

export default AccountClassificationPage
