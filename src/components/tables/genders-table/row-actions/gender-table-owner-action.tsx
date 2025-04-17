import { useState } from 'react'
import { IGenderTableActionComponentProp } from '../columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteGender } from '@/hooks/api-hooks/use-gender'
import { GenderCreateUpdateFormModal } from '@/components/forms/gender-forms/gender-create-update-form'

interface IGenderTableActionProps extends IGenderTableActionComponentProp {
    onGenderUpdate?: () => void
    onDeleteSuccess?: () => void
}

const GenderTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IGenderTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const gender = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGender, mutate: deleteGender } =
        useDeleteGender({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <GenderCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        genderId: gender.id,
                        defaultValues: {
                            ...gender,
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGender,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Gender',
                            description:
                                'Are you sure you want to delete this Gender?',
                            onConfirm: () => deleteGender(gender.id),
                        })
                    },
                }}
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

export default GenderTableOwnerAction
