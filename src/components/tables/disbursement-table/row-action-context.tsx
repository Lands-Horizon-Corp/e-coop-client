import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { DisbursementCreateUpdateFormModal } from '@/components/forms/disbursement-create-update-form'

import { useDeleteDisbursement } from '@/hooks/api-hooks/use-disbursement'
import { useModalState } from '@/hooks/use-modal-state'

import { IDisbursement } from '@/types'

import { IDisbursementTableActionComponentProp } from './columns'

interface UseDisbursementActionsProps {
    row: Row<IDisbursement>
    onDeleteSuccess?: () => void
}

const useDisbursementActions = ({
    row,
    onDeleteSuccess,
}: UseDisbursementActionsProps) => {
    const updateModal = useModalState()
    const disbursement = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingDisbursement, mutate: deleteDisbursement } =
        useDeleteDisbursement({
            onSuccess: onDeleteSuccess,
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Disbursement',
            description:
                'Are you sure you want to delete this disbursement? This action cannot be undone.',
            onConfirm: () => deleteDisbursement(disbursement.id),
        })
    }

    return {
        disbursement,
        updateModal,
        isDeletingDisbursement,
        handleEdit,
        handleDelete,
    }
}

interface IDisbursementTableActionProps
    extends IDisbursementTableActionComponentProp {
    onDisbursementUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const DisbursementAction = ({
    row,
    onDeleteSuccess,
}: IDisbursementTableActionProps) => {
    const {
        disbursement,
        updateModal,
        isDeletingDisbursement,
        handleEdit,
        handleDelete,
    } = useDisbursementActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <DisbursementCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        disbursementId: disbursement.id,
                        defaultValues: { ...disbursement },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingDisbursement,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<></>}
            />
        </>
    )
}

interface IDisbursementRowContextProps
    extends IDisbursementTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const DisbursementRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IDisbursementRowContextProps) => {
    const {
        disbursement,
        updateModal,
        isDeletingDisbursement,
        handleEdit,
        handleDelete,
    } = useDisbursementActions({ row, onDeleteSuccess })

    return (
        <>
            <DisbursementCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    disbursementId: disbursement.id,
                    defaultValues: { ...disbursement },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingDisbursement,
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

export default DisbursementAction
