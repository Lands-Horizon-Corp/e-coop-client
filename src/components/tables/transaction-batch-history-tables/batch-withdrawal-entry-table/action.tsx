import { IWithdrawalEntryTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import { WithdrawalEntryCreateUpdateFormModal } from '@/components/forms/withdrawal-entry-create-update-form'

interface IWithdrawalEntryTableActionProps
    extends IWithdrawalEntryTableActionComponentProp {
    onWithdrawalEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchWithdrawalEntryAction = (
    _props: IWithdrawalEntryTableActionProps
) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <WithdrawalEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: withdrawalEntry,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchWithdrawalEntryAction
