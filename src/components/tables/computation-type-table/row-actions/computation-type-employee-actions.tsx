import { useState } from 'react'

import { IAccountsComputationTypeTableActionComponentProp } from '../column'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { ComputationTypeCreateFormModal } from '@/components/forms/computation-type-forms/computation-type-create-update-form'

interface IComputationTypeTableEmployeeActionProps
    extends IAccountsComputationTypeTableActionComponentProp {
    onComputationTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const ComputationTypeTableEmployeeAction = ({
    row,
}: IComputationTypeTableEmployeeActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const computationType = row.original

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <ComputationTypeCreateFormModal
                    formProps={{
                        computationTypeId: computationType.id,
                        defaultValues: {
                            ...computationType,
                        },
                    }}
                    open={updateModalForm}
                    title="Update Computation Type"
                    onOpenChange={setUpdateModalForm}
                    description="Modify/Update computation type..."
                />
            </div>
            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default ComputationTypeTableEmployeeAction
