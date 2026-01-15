import { AccountCreateUpdateFormModal, AccountsTable } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

export const Account = () => {
    const createModal = useModalState()

    const {
        currentAuth: {
            user_organization: { settings_payment_type_default_value },
        },
    } = useAuthUserWithOrgBranch()

    return (
        <PageContainer>
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
                        },
                    }}
                />
            </div>
        </PageContainer>
    )
}
export default Account
