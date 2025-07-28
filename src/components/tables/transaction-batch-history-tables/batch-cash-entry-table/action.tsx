// import { useState } from 'react'
import { ICashEntryTableActionComponentProp } from './columns'

// import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import useConfirmModalStore from '@/store/confirm-modal-store'
// import { CashEntryCreateUpdateFormModal } from '@/components/forms/cash-entry-create-update-form'
// import { useDeleteCashEntry } from '@/hooks/api-hooks/use-cash-entry'

interface ICashEntryTableActionProps
    extends ICashEntryTableActionComponentProp {
    onCashEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchCashEntryAction = (_props: ICashEntryTableActionProps) => {
    // const [updateModalForm, setUpdateModalForm] = useState(false)
    // const cashEntry = row.original

    // const { onOpen } = useConfirmModalStore()

    // const { isPending: isDeleting, mutate: deleteCashEntry } =
    //     useDeleteCashEntry({
    //         onSuccess: onDeleteSuccess,
    //     })

    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <CashEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: cashEntry,
                    }}
                />
            </div> */}
            {/* <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Cash Entry',
                            description:
                                'Are you sure you want to delete this cash entry?',
                            onConfirm: () => deleteCashEntry(cashEntry.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: false, // Set to true and implement modal if you have a form
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<></>}
            /> */}
        </>
    )
}

export default BatchCashEntryAction
