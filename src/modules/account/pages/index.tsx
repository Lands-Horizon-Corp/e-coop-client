import { AccountCreateUpdateFormModal, AccountsTable } from '@/modules/account'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import { AccountsTableProps } from '../components/tables'

export const Account = () => {
    const createModal = useModalState()

    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const { settings_payment_type_default_value } = user_organization

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Account">
                <div className="flex w-full flex-col  items-start gap-4">
                    <AccountCreateUpdateFormModal
                        className=" min-w-[80vw] max-w-[80vw]"
                        formProps={{
                            defaultValues: {
                                default_payment_type_id:
                                    settings_payment_type_default_value?.id,
                                default_payment_type:
                                    settings_payment_type_default_value,
                            },
                        }}
                        {...createModal}
                    />
                    <AccountsTable
                        className="max-h-[90vh] min-h-[90vh] w-full"
                        toolbarProps={{
                            createActionProps: {
                                onClick: () => createModal.onOpenChange(true),
                                disabled: !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'Account',
                                }),
                            },
                            exportActionProps: {
                                disabled: !hasPermissionFromAuth({
                                    action: 'Export',
                                    resourceType: 'Account',
                                }),
                            } as NonNullable<
                                AccountsTableProps['toolbarProps']
                            >['exportActionProps'],
                        }}
                    />
                </div>
            </PermissionGuard>
        </PageContainer>
    )
}
export default Account
