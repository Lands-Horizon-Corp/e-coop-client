import { ReactNode } from 'react'

import { toast } from 'sonner'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BoxesStackedIcon,
    PaperPlaneIcon,
    PrinterFillIcon,
    UndoIcon,
} from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { GeneratedSavingsInterestEntryTableModal } from '../../../../generated-savings-interest-entry/components/tables/generated-savings-interest-entry-table'
import { useUndoPrintGeneratedSavingsInterest } from '../../../generated-savings-interest.service'
import { IGeneratedSavingsInterest } from '../../../generated-savings-interest.types'
import { GeneratedSavingsInterestCreateFormModal } from '../../forms/generate-savings-interest-create-form'
import { GenerateSavingsInterestPostFormModal } from '../../forms/generate-savings-interest-post-form'
import { GeneratedSavingsInterestPrintFormModal } from '../../forms/mutual-fund-print-form'
import { IGeneratedSavingsInterestTableActionComponentProp } from './columns'

export type GeneratedSavingsInterestActionType =
    | 'edit'
    | 'print'
    | 'delete'
    | 'view'
    | 'manageEntries'
    | 'post'

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

    // const {
    //     isPending: isDeletingGeneratedSavingsInterest,
    //     mutate: deleteGeneratedSavingsInterest,
    // } = useDeleteGeneratedSavingsInterestById({
    //     options: {
    //         onSuccess: onDeleteSuccess,
    //     },
    // })

    const {
        isPending: isUnprinting,
        mutateAsync: undoPrintGeneratedSavingsInterest,
    } = useUndoPrintGeneratedSavingsInterest({
        options: {
            onSuccess: () => {
                toast.success(
                    'Generated savings interest unprinted successfully'
                )
            },
        },
    })

    const handleView = () => {
        open('view', {
            id: generatedSavingsInterest.id,
            defaultValues: generatedSavingsInterest,
            extra: { onDeleteSuccess },
        })
    }

    const handleManageEntries = () => {
        open('manageEntries', {
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

    const handlePost = () => {
        open('post', {
            id: generatedSavingsInterest.id,
            defaultValues: generatedSavingsInterest,
            extra: { onDeleteSuccess },
        })
    }

    const handlePrint = () => {
        open('print', {
            id: generatedSavingsInterest.id,
            defaultValues: generatedSavingsInterest,
        })
    }

    const handleUndoPrint = () => {
        onOpen({
            title: 'Undo Print',
            description:
                'Are you sure you want to undo print for this generated savings interest?',
            onConfirm: () =>
                toast.promise(
                    undoPrintGeneratedSavingsInterest({
                        generatedSavingsInterestId: generatedSavingsInterest.id,
                    }),
                    {
                        loading: 'Undoing print...',
                        success:
                            'Generated savings interest unprinted successfully',
                        error: 'Failed to undo print',
                    }
                ),
        })
    }

    // const handleDelete = () => {
    //     onOpen({
    //         title: 'Delete Generated Savings Interest',
    //         description:
    //             'Are you sure you want to delete this generated savings interest record?',
    //         onConfirm: () =>
    //             deleteGeneratedSavingsInterest(generatedSavingsInterest.id),
    //     })
    // }

    const isPosted = !!generatedSavingsInterest.posted_date
    const isPrinted = !!generatedSavingsInterest.printed_date

    const canPrint = !isPrinted && !isPosted
    const canUndoPrint = isPrinted && !isPosted
    const canPost = isPrinted && !isPosted

    return {
        generatedSavingsInterest,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleView,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
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
    const {
        generatedSavingsInterest,
        // isDeletingGeneratedSavingsInterest,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
        // handleDelete,
    } = useGeneratedSavingsInterestActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                // onDelete={{
                //     text: 'Delete',
                //     isAllowed: !isDeletingGeneratedSavingsInterest,
                //     onClick: handleDelete,
                // }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            disabled={!canPrint}
                            onClick={handlePrint}
                        >
                            <PrinterFillIcon className="size-4 mr-2" />
                            Print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canUndoPrint || isUnprinting}
                            onClick={handleUndoPrint}
                        >
                            <UndoIcon className="size-4 mr-2" />
                            Undo Print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!!generatedSavingsInterest.printed_date}
                            onClick={handleManageEntries}
                        >
                            <BoxesStackedIcon className="mr-2 size-4" />
                            Manage Entries
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canPost}
                            onClick={handlePost}
                        >
                            <PaperPlaneIcon className="mr-2 size-4" />
                            Post
                        </DropdownMenuItem>
                    </>
                }
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
    const {
        // isDeletingGeneratedSavingsInterest,
        generatedSavingsInterest,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
        // handleDelete,
    } = useGeneratedSavingsInterestActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                // onDelete={{
                //     text: 'Delete',
                //     isAllowed: !isDeletingGeneratedSavingsInterest,
                //     onClick: handleDelete,
                // }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem
                            disabled={!canPrint}
                            onClick={handlePrint}
                        >
                            <PrinterFillIcon className="mr-2 size-4" />
                            Print
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!canUndoPrint || isUnprinting}
                            onClick={handleUndoPrint}
                        >
                            <UndoIcon className="mr-2 size-4" />
                            Undo Print
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!!generatedSavingsInterest.printed_date}
                            onClick={handleManageEntries}
                        >
                            <BoxesStackedIcon className="mr-2 size-4" />
                            Manage Entries
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!canPost}
                            onClick={handlePost}
                        >
                            <PaperPlaneIcon className="mr-2 size-4" />
                            Post
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
                        readOnly: !!state.defaultValues?.printed_date,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'manageEntries' && state.id && (
                <GeneratedSavingsInterestEntryTableModal
                    onOpenChange={close}
                    open={state.isOpen}
                    tableProps={{
                        readOnly: !!state.defaultValues?.posted_date,
                        generatedSavingsInterestId: state.id,
                    }}
                    title={`Manage Entries ${state.defaultValues?.document_no ? `for DOC ${state.defaultValues?.document_no}` : ''}`}
                />
            )}
            {state.action === 'post' && state.id && (
                <GenerateSavingsInterestPostFormModal
                    formProps={{
                        generatedSavingsInterestId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'print' && state.id && (
                <GeneratedSavingsInterestPrintFormModal
                    formProps={{
                        generatedSavingsInterestId: state.id,
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
