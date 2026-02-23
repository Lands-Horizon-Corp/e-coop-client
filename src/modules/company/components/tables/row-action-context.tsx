import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteCompanyById } from '../../company.service'
import { ICompany } from '../../company.types'
import { CompanyCreateUpdateFormModal } from '../forms/company-create-update-modal'
import { ICompanyTableActionComponentProp } from './columns'

export type CompanyActionType = 'edit'

export type CompanyActionExtra = Record<string, never>

interface UseCompanyActionsProps {
    row: Row<ICompany>
    onDeleteSuccess?: () => void
}

const useCompanyActions = ({
    row,
    onDeleteSuccess,
}: UseCompanyActionsProps) => {
    const company = row.original

    const { open } = useTableRowActionStore<
        ICompany,
        CompanyActionType,
        CompanyActionExtra
    >()

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

    const handleEdit = () => {
        open('edit', {
            id: company.id,
            defaultValues: company,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Company',
            description: 'Are you sure you want to delete this company?',
            onConfirm: () => deleteCompany(company.id),
        })
    }

    return {
        company,
        isDeletingCompany,
        handleEdit,
        handleDelete,
    }
}

interface ICompanyTableActionProps extends ICompanyTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const CompanyAction = ({
    row,
    onDeleteSuccess,
}: ICompanyTableActionProps) => {
    const { company, isDeletingCompany, handleEdit, handleDelete } =
        useCompanyActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingCompany &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Company',
                        resource: company,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Company',
                    resource: company,
                }),
                onClick: handleEdit,
            }}
            row={row}
        />
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
    const { company, isDeletingCompany, handleEdit, handleDelete } =
        useCompanyActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingCompany &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Company',
                        resource: company,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Company',
                    resource: company,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const CompanyTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ICompany,
        CompanyActionType,
        CompanyActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <CompanyCreateUpdateFormModal
                    formProps={{
                        companyId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default CompanyAction
