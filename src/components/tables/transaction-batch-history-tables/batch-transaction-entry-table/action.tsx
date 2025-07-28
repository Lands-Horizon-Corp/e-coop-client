import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { ITransactionEntryTableActionComponentProp } from './columns'

// import { TransactionEntryCreateUpdateFormModal } from '@/components/forms/transaction-entry-create-update-form'

interface ITransactionEntryTableActionProps
    extends ITransactionEntryTableActionComponentProp {
    onTransactionEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchTransactionEntryAction = (
    _props: ITransactionEntryTableActionProps
) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <TransactionEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: transactionEntry,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchTransactionEntryAction
