import { ReactNode } from 'react'

import { IGeneratedSavingsInterestEntry } from '@/modules/generated-savings-interest-entry'
import { GeneratedSavingsInterestEntryCreateUpdateFormModal } from '@/modules/generated-savings-interest-entry/components/forms/generated-savings-interest-entry-create-update-form'
import { SavingsInterestEntryDailyBalanceViewModal } from '@/modules/generated-savings-interest-entry/components/savings-interest-entry-daily-balance-view'
import { useDeleteGeneratedSavingsInterestEntryById } from '@/modules/generated-savings-interest-entry/generated-savings-interest-entry.service'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { Button } from '@/components/ui/button'
import { ContextMenuItem } from '@/components/ui/context-menu'

import { IGeneratedSavingsInterestEntryTableActionComponentProp } from './index'

export type GeneratedSavingsInterestEntryActionType = 'edit' | 'delete' | 'view'

export interface GeneratedSavingsInterestEntryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseGeneratedSavingsInterestEntryActionsProps {
    row: Row<IGeneratedSavingsInterestEntry>
    onDeleteSuccess?: () => void
}

const useGeneratedSavingsInterestEntryActions = ({
    row,
    onDeleteSuccess,
}: UseGeneratedSavingsInterestEntryActionsProps) => {
    const entry = row.original
    const { open } = useTableRowActionStore<
        IGeneratedSavingsInterestEntry,
        GeneratedSavingsInterestEntryActionType,
        GeneratedSavingsInterestEntryActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingEntry, mutate: deleteEntry } =
        useDeleteGeneratedSavingsInterestEntryById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: entry.id,
            defaultValues: entry,
            extra: { onDeleteSuccess },
        })
    }

    const handleView = () => {
        open('view', {
            id: entry.id,
            defaultValues: entry,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Savings Interest Entry',
            description:
                'Are you sure you want to delete this savings interest entry?',
            onConfirm: () => deleteEntry(entry.id),
        })
    }

    return {
        entry,
        isDeletingEntry,
        handleEdit,
        handleView,
        handleDelete,
    }
}

interface IGeneratedSavingsInterestEntryTableActionProps
    extends IGeneratedSavingsInterestEntryTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestEntryAction = ({
    row,
    onDeleteSuccess,
}: IGeneratedSavingsInterestEntryTableActionProps) => {
    const { entry, isDeletingEntry, handleEdit, handleView, handleDelete } =
        useGeneratedSavingsInterestEntryActions({ row, onDeleteSuccess })

    return (
        <div className="flex items-center gap-1">
            <Button onClick={handleView} size="icon-sm" variant="ghost">
                <Eye className="size-3" />
            </Button>
            <Button
                disabled={!!entry.generated_savings_interest?.posted_date}
                onClick={handleEdit}
                size="icon-sm"
                variant="ghost"
            >
                <Pencil className="size-3" />
            </Button>
            <Button
                disabled={
                    isDeletingEntry ||
                    !!entry.generated_savings_interest?.posted_date
                }
                hoverVariant="destructive"
                onClick={handleDelete}
                size="icon-sm"
                variant="ghost"
            >
                <Trash2 className="size-3" />
            </Button>
        </div>
    )
}

interface IGeneratedSavingsInterestEntryRowContextProps
    extends IGeneratedSavingsInterestEntryTableActionComponentProp {
    children?: ReactNode
    readOnly?: boolean
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IGeneratedSavingsInterestEntryRowContextProps) => {
    const { entry, isDeletingEntry, handleEdit, handleView, handleDelete } =
        useGeneratedSavingsInterestEntryActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                canSelect={false}
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingEntry &&
                        !entry.generated_savings_interest?.posted_date,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: !entry.generated_savings_interest?.posted_date,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleView}>
                            <Eye className="mr-2 size-4" />
                            View Daily Balance
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const GeneratedSavingsInterestEntryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IGeneratedSavingsInterestEntry,
        GeneratedSavingsInterestEntryActionType,
        GeneratedSavingsInterestEntryActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <GeneratedSavingsInterestEntryCreateUpdateFormModal
                    description="Update the savings interest entry details."
                    formProps={{
                        readOnly:
                            !!state.defaultValues?.generated_savings_interest
                                ?.posted_date,
                        generatedSavingsInterestEntryId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Savings Interest Entry"
                />
            )}
            {state.action === 'view' && state.id && (
                <SavingsInterestEntryDailyBalanceViewModal
                    // description="View the daily balance history and summary for this savings interest entry."
                    onOpenChange={close}
                    open={state.isOpen}
                    // title="Daily Balance View"
                    viewProps={{
                        generatedSavingsInterestEntryId: state.id,
                    }}
                />
            )}
        </>
    )
}

export default GeneratedSavingsInterestEntryAction
