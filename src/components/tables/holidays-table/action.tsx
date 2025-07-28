import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { HolidayCreateUpdateFormModal } from '@/components/forms/holiday-create-update-form'

import { useDeleteHoliday } from '@/hooks/api-hooks/use-holiday'
import { useModalState } from '@/hooks/use-modal-state'

import { IHolidayTableActionComponentProp } from './columns'

interface IHolidayTableActionComponentProps
    extends IHolidayTableActionComponentProp {
    onBankUpdate?: () => void
    onDeleteSuccess?: () => void
}

const HolidayTableAction = ({
    row,
    onDeleteSuccess,
}: IHolidayTableActionComponentProps) => {
    const updateModal = useModalState()
    const holiday = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingHoliday, mutate: deleteHoliday } =
        useDeleteHoliday({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <HolidayCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        holidayId: holiday.id,
                        defaultValues: holiday,
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingHoliday,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Holiday',
                            description:
                                'Are you sure you want to delete this holiday?',
                            onConfirm: () => deleteHoliday(holiday.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => updateModal.onOpenChange(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default HolidayTableAction
