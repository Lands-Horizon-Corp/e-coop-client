import { useState } from 'react'

import { IAccount } from '@/types/coop-types/accounts/account'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'

interface IMemberAccountGeneralLedgerActionProps {
    account: IAccount
}

const MemberAccountGeneralLedgerAction = ({
    account,
}: IMemberAccountGeneralLedgerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <AccountCreateUpdateFormModal
                formProps={{
                    defaultValues: { ...account },
                    readOnly: true,
                }}
                open={updateModalForm}
                onOpenChange={setUpdateModalForm}
            />
            <RowActionsGroup
                onView={{
                    text: 'View',
                    isAllowed: true,
                    onClick: () => {
                        setUpdateModalForm(true)
                    },
                }}
            />
        </div>
    )
}

export default MemberAccountGeneralLedgerAction
