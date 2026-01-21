import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    AccountClassificationAction,
    AccountClassificationFormModal,
    AccountClassificationTable,
} from '@/modules/account-classification'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'
import PermissionNotAllowedDisplay from '@/modules/permission/components/permission-not-allowed-display'
import { hasPermission } from '@/modules/permission/permission.utils'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

export const AccountClassificationPage = () => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()
    const createModal = useModalState(false)

    const { user_organization } = currentAuth

    const organizationId = user_organization.organization_id
    const branchId = user_organization.branch_id

    return (
        <PageContainer>
            <PermissionGuard
                action="Read"
                NotAllowedComponent={(props) => (
                    <PermissionNotAllowedDisplay {...props} />
                )}
                resourceType="AccountClassification"
            >
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
                                disabled: !hasPermission({
                                    action: 'Create',
                                    resourceType: 'AccountClassification',
                                    userOrg: user_organization,
                                }),
                            },
                            // exportActionProps: {
                            //     disabled: !hasPermissionFromAuth({
                            //         action: 'Export',
                            //         resourceType: 'AccountClassification',
                            //     }),
                            // },
                        }}
                    />
                </>
            </PermissionGuard>
        </PageContainer>
    )
}

export default AccountClassificationPage
