import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberGenderCreateUpdateFormModal } from '@/components/forms/member-forms/member-gender-create-update-form'

import { useDeleteGender } from '@/hooks/api-hooks/member/use-member-gender'

import { IMemberGenderTableActionComponentProp } from './columns'

interface IMemberGenderTableActionProps
    extends IMemberGenderTableActionComponentProp {
    onGenderUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberGenderTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberGenderTableActionProps) => {
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
                <MemberGenderCreateUpdateFormModal
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

export default MemberGenderTableAction
