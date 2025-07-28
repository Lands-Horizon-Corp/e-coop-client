import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { ICheckEntryTableActionComponentProp } from './columns'

// import { CheckEntryCreateUpdateFormModal } from '@/components/forms/check-entry-create-update-form'

interface ICheckEntryTableActionProps
    extends ICheckEntryTableActionComponentProp {
    onCheckEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchCheckEntryAction = (_props: ICheckEntryTableActionProps) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <CheckEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: checkEntry,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchCheckEntryAction
