import { IOnlineEntryTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import { OnlineEntryCreateUpdateFormModal } from '@/components/forms/online-entry-create-update-form'

interface IOnlineEntryTableActionProps
    extends IOnlineEntryTableActionComponentProp {
    onOnlineEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchOnlineEntryAction = (_props: IOnlineEntryTableActionProps) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <OnlineEntryCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: onlineEntry,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchOnlineEntryAction
