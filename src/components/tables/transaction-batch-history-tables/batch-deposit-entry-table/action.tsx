import { IDepositEntryTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import { DepositEntryCreateUpdateFormModal } from '@/components/forms/deposit-entry-create-update-form'

interface IDepositEntryTableActionProps
    extends IDepositEntryTableActionComponentProp {
    onDepositEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchDepositEntryAction = (_props: IDepositEntryTableActionProps) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <DepositEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: depositEntry,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchDepositEntryAction
