import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteAdjustmentEntryById } from '../..'
import { IAdjustmentEntry } from '../../adjustment-entry.types'
import { AdjustmentEntryCreateUpdateFormModal } from '../forms/adjustment-entry-form-modal'
import { IAdjustmentEntryTableActionComponentProp } from './columns'

export type AdjustmentEntryActionType = 'edit' | 'delete' | 'view'

export interface AdjustmentEntryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseAdjustmentEntryActionsProps {
    row: Row<IAdjustmentEntry>
    onDeleteSuccess?: () => void
}

const useAdjustmentEntryActions = ({
    row,
    onDeleteSuccess,
}: UseAdjustmentEntryActionsProps) => {
    const adjustmentEntry = row.original
    const { open } = useTableRowActionStore<
        IAdjustmentEntry,
        AdjustmentEntryActionType,
        AdjustmentEntryActionExtra
    >()
    const { onOpen } = useConfirmModalStore()
    const onViewModal = useModalState()
    const { isPending: isDeletingEntry, mutate: deleteEntry } =
        useDeleteAdjustmentEntryById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted adjustment entry',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: adjustmentEntry.id,
            defaultValues: adjustmentEntry,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Adjustment Entry',
            description:
                'Are you sure you want to delete this adjustment entry?',
            onConfirm: () => deleteEntry(adjustmentEntry.id),
        })
    }

    const handleOnView = () => {
        open('view', {
            id: adjustmentEntry.id,
            defaultValues: adjustmentEntry,
            extra: {},
        })
        onViewModal.onOpenChange(true)
    }

    return {
        adjustmentEntry,
        isDeletingEntry,
        handleEdit,
        handleDelete,
        handleOnView,
        onViewModal,
    }
}

interface IAdjustmentEntryTableActionProps extends IAdjustmentEntryTableActionComponentProp {
    onEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AdjustmentEntryAction = ({
    row,
    onDeleteSuccess,
}: IAdjustmentEntryTableActionProps) => {
    const { adjustmentEntry, handleOnView } = useAdjustmentEntryActions({
        row,
        onDeleteSuccess,
    })

    const canView = hasPermissionFromAuth({
        action: ['Read', 'OwnRead'],
        resourceType: 'AdjustmentEntry',
        resource: adjustmentEntry,
    })

    return (
        <>
            <RowActionsGroup
                canSelect={false}
                onView={{
                    text: 'view',
                    isAllowed: canView,
                    onClick: handleOnView,
                }}
                row={row}
            />
        </>
    )
}

interface IAdjustmentEntryRowContextProps extends IAdjustmentEntryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AdjustmentEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAdjustmentEntryRowContextProps) => {
    const { adjustmentEntry, handleOnView } = useAdjustmentEntryActions({
        row,
        onDeleteSuccess,
    })

    const canView = hasPermissionFromAuth({
        action: ['Read', 'OwnRead'],
        resourceType: 'AdjustmentEntry',
        resource: adjustmentEntry,
    })

    return (
        <>
            <DataTableRowContext
                canSelect={false}
                onView={{
                    text: 'view',
                    isAllowed: canView,
                    onClick: handleOnView,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const AdjustmentEntryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IAdjustmentEntry,
        AdjustmentEntryActionType,
        AdjustmentEntryActionExtra
    >()
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    return (
        <>
            {state.action === 'view' && (
                <>
                    <AdjustmentEntryCreateUpdateFormModal
                        formProps={{
                            readOnly: true,
                            defaultValues: state.defaultValues,
                            baseCurrency:
                                user_organization.branch.branch_setting
                                    .currency,
                        }}
                        onOpenChange={close}
                        open={state.isOpen}
                    />
                </>
            )}
        </>
    )
}
