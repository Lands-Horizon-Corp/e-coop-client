import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { IBatchFundingTableActionComponentProp } from './columns'

// import { BatchFundingCreateUpdateFormModal } from '@/components/forms/batch-funding-create-update-form'

interface IBatchFundingTableActionProps
    extends IBatchFundingTableActionComponentProp {
    onBatchFundingUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BatchFundingAction = (_props: IBatchFundingTableActionProps) => {
    return (
        <>
            {/* <div onClick={(e) => e.stopPropagation()}>
                <BatchFundingCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: batchFunding,
                    }}
                />
            </div> */}
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default BatchFundingAction
