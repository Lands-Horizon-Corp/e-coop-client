import { useRouter } from '@tanstack/react-router'

import { BadgeCheckIcon, StoreIcon } from '@/components/icons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    useDeleteCompany,
    useApproveCompany,
} from '@/hooks/api-hooks/use-company'
import { ICompanyTableActionComponentProp } from '../columns'

interface ICompaniesTableAdminActionProps
    extends ICompanyTableActionComponentProp {
    onDeleteSuccess?: () => void
    onCompanyUpdate?: () => void
}

const CompaniesTableAdminAction = ({
    row,
    onDeleteSuccess,
    onCompanyUpdate,
}: ICompaniesTableAdminActionProps) => {
    const company = row.original

    const router = useRouter()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCompany, mutate: deleteCompany } =
        useDeleteCompany({
            onSuccess: onDeleteSuccess,
        })

    const { mutate: approveCompany, isPending: isApprovingCompany } =
        useApproveCompany({
            onSuccess: onCompanyUpdate,
        })

    return (
        <RowActionsGroup
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingCompany,
                onClick: () =>
                    onOpen({
                        title: 'Delete Company',
                        description: 'Are you sure to delete this company?',
                        onConfirm: () => deleteCompany(company.id),
                    }),
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: () => {
                    router.navigate({
                        to: '/admin/companies-management/$companyId/edit',
                        params: { companyId: company.id },
                    })
                },
            }}
            onView={{
                text: 'View',
                isAllowed: true,
                onClick: () => {
                    router.navigate({
                        to: '/admin/companies-management/$companyId/view',
                        params: { companyId: company.id },
                    })
                },
            }}
            otherActions={
                <>
                    {!company.isAdminVerified && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen({
                                    title: 'Approve Company',
                                    description:
                                        'Are you sure you want to approve this company? Approval will enable them to begin their operations.',
                                    onConfirm: () => approveCompany(company.id),
                                })
                            }}
                        >
                            {isApprovingCompany ? (
                                <LoadingSpinner />
                            ) : (
                                <BadgeCheckIcon className="mr-2" />
                            )}{' '}
                            Approve
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={() => {
                            router.navigate({
                                to: '/admin/companies-management/$companyId/branch',
                                params: { companyId: company.id },
                            })
                        }}
                    >
                        <StoreIcon className="mr-2" />
                        Manage Branches
                    </DropdownMenuItem>{' '}
                </>
            }
        />
    )
}

export default CompaniesTableAdminAction
