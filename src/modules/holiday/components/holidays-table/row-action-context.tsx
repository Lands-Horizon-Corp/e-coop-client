import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IHoliday, useDeleteHolidayById } from '../..'
import { IHolidayTableActionComponentProp } from './columns'
import { HolidayCreateUpdateFormModal } from '../forms/holiday-create-update-form'

interface UseHolidayActionsProps {
    row: Row<IHoliday>
    onDeleteSuccess?: () => void
}

const useHolidayActions = ({
    row,
    onDeleteSuccess,
}: UseHolidayActionsProps) => {
    const updateModal = useModalState()
    const holiday = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingHoliday, mutate: deleteHoliday } =
        useDeleteHolidayById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Holiday created',
                    textError: 'Failed to create holiday',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Holiday',
            description: 'Are you sure you want to delete this holiday?',
            onConfirm: () => deleteHoliday(holiday.id),
        })
    }

    return {
        holiday,
        updateModal,
        isDeletingHoliday,
        handleEdit,
        handleDelete,
    }
}

interface IHolidayTableActionProps extends IHolidayTableActionComponentProp {
    onHolidayUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const HolidayAction = ({
    row,
    onDeleteSuccess,
}: IHolidayTableActionProps) => {
    const {
        holiday,
        updateModal,
        isDeletingHoliday,
        handleEdit,
        handleDelete,
    } = useHolidayActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <HolidayCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        holidayId: holiday.id,
                        defaultValues: holiday,
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingHoliday,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

interface IHolidayRowContextProps extends IHolidayTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const HolidayRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IHolidayRowContextProps) => {
    const {
        holiday,
        updateModal,
        isDeletingHoliday,
        handleEdit,
        handleDelete,
    } = useHolidayActions({ row, onDeleteSuccess })

    return (
        <>
            <HolidayCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    holidayId: holiday.id,
                    defaultValues: holiday,
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingHoliday,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default HolidayAction
