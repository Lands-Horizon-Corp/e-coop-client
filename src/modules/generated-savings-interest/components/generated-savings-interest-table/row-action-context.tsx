import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteGeneratedSavingsInterestById } from '../../generated-savings-interest.service'
import { IGeneratedSavingsInterest } from '../../generated-savings-interest.types'
import { GeneratedSavingsInterestCreateFormModal } from '../forms/generate-savings-interest-create-form'
import { IGeneratedSavingsInterestTableActionComponentProp } from './columns'

export type GeneratedSavingsInterestActionType = 'edit' | 'delete' | 'view'

export interface GeneratedSavingsInterestActionExtra {
    onDeleteSuccess?: () => void
}

interface UseGeneratedSavingsInterestActionsProps {
    row: Row<IGeneratedSavingsInterest>
    onDeleteSuccess?: () => void
}

const useGeneratedSavingsInterestActions = ({
    row,
    onDeleteSuccess,
}: UseGeneratedSavingsInterestActionsProps) => {
    const generatedSavingsInterest = row.original
    const { open } = useTableRowActionStore<
        IGeneratedSavingsInterest,
        GeneratedSavingsInterestActionType,
        GeneratedSavingsInterestActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingGeneratedSavingsInterest,
        mutate: deleteGeneratedSavingsInterest,
    } = useDeleteGeneratedSavingsInterestById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleView = () => {
        open('view', {
            id: generatedSavingsInterest.id,
            defaultValues: generatedSavingsInterest,
            extra: { onDeleteSuccess },
        })
    }

    const handleEdit = () => {
        open('edit', {
            id: generatedSavingsInterest.id,
            defaultValues: generatedSavingsInterest,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Generated Savings Interest',
            description:
                'Are you sure you want to delete this generated savings interest record?',
            onConfirm: () =>
                deleteGeneratedSavingsInterest(generatedSavingsInterest.id),
        })
    }

    return {
        generatedSavingsInterest,
        isDeletingGeneratedSavingsInterest,
        handleView,
        handleEdit,
        handleDelete,
    }
}

interface IGeneratedSavingsInterestTableActionProps
    extends IGeneratedSavingsInterestTableActionComponentProp {
    onGeneratedSavingsInterestUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestAction = ({
    row,
    onDeleteSuccess,
}: IGeneratedSavingsInterestTableActionProps) => {
    const { isDeletingGeneratedSavingsInterest, handleEdit, handleDelete } =
        useGeneratedSavingsInterestActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGeneratedSavingsInterest,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<></>}
                row={row}
            />
        </>
    )
}

interface IGeneratedSavingsInterestRowContextProps
    extends IGeneratedSavingsInterestTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IGeneratedSavingsInterestRowContextProps) => {
    const { isDeletingGeneratedSavingsInterest, handleEdit, handleDelete } =
        useGeneratedSavingsInterestActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGeneratedSavingsInterest,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const GeneratedSavingsInterestTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IGeneratedSavingsInterest,
        GeneratedSavingsInterestActionType,
        GeneratedSavingsInterestActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <GeneratedSavingsInterestCreateFormModal
                    formProps={{
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default GeneratedSavingsInterestAction
