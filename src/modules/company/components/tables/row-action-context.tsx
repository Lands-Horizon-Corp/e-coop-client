import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteCompanyById } from '../../company.service'
import { ICompany } from '../../company.types'
import { CompanyCreateUpdateFormModal } from '../forms/company-create-update-modal'
import { ICompanyTableActionComponentProp } from './columns'

interface UseCompanyActionsProps {
    row: Row<ICompany>
    onDeleteSuccess?: () => void
}

const useCompanyActions = ({
    row,
    onDeleteSuccess,
}: UseCompanyActionsProps) => {
    const updateModal = useModalState()
    const company = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCompany, mutate: deleteCompany } =
        useDeleteCompanyById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted company',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Company',
            description: 'Are you sure you want to delete this company?',
            onConfirm: () => deleteCompany(company.id),
        })
    }

    return {
        company,
        updateModal,
        isDeletingCompany,
        handleEdit,
        handleDelete,
    }
}

interface ICompanyTableActionProps extends ICompanyTableActionComponentProp {
    onCompanyUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const CompanyAction = ({
    row,
    onDeleteSuccess,
}: ICompanyTableActionProps) => {
    const {
        company,
        updateModal,
        isDeletingCompany,
        handleEdit,
        handleDelete,
    } = useCompanyActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CompanyCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        companyId: company.id,
                        defaultValues: { ...company },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCompany,
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

interface ICompanyRowContextProps extends ICompanyTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CompanyRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICompanyRowContextProps) => {
    const {
        company,
        updateModal,
        isDeletingCompany,
        handleEdit,
        handleDelete,
    } = useCompanyActions({ row, onDeleteSuccess })

    return (
        <>
            <CompanyCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    companyId: company.id,
                    defaultValues: { ...company },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCompany,
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

export default CompanyAction
