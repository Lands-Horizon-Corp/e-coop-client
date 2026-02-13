import { AccountCreateUpdateFormModal, AccountsTable } from '@/modules/account'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'

import { AccountsTableProps } from '../components/tables'
import { useAccountContext } from '../context/account-provider'

const AccountWrapper = () => {
    const { settings_payment_type_default_value, createModal } =
        useAccountContext()

    return (
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
    )
}

export default AccountWrapper
