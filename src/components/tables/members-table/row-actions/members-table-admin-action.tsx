import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { IMemberTableActionComponentProp } from '../columns'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMember } from '@/hooks/api-hooks/member/use-member'

interface IMembersTableAdminActionProps
    extends IMemberTableActionComponentProp {
    onDeleteSuccess?: () => void
    onMemberUpdate?: () => void
}

const MembersTableAdminAction = ({
    row,
    onDeleteSuccess,
}: IMembersTableAdminActionProps) => {
    const member = row.original

    // const router = useRouter()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCompany, mutate: deleteCompany } =
        useDeleteMember({
            onSuccess: onDeleteSuccess,
        })

    return (
        <RowActionsGroup
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingCompany,
                onClick: () => {
                    onOpen({
                        title: 'Delete Company',
                        description: 'Are you sure to delete this company?',
                        onConfirm: () => deleteCompany(member.id),
                    })
                },
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: () => {
                    // router.navigate({
                    //     to: '/admin/companies-management/$companyId/edit',
                    //     params: { companyId: member.id },
                    // })
                },
            }}
            onView={{
                text: 'View',
                isAllowed: true,
                onClick: () => {
                    // router.navigate({
                    //     to: '/admin/companies-management/$companyId/view',
                    //     params: { companyId: member.id },
                    // })
                },
            }}
            otherActions={
                <>
                    {/* {!member. && (
                        <DropdownMenuItem
                            onClick={() => {
                                // onOpen({
                                //     title: 'Approve Company',
                                //     description:
                                //         'Are you sure you want to approve this company? Approval will enable them to begin their operations.',
                                //     onConfirm: () => approveCompany(company.id),
                                // })
                            }}
                        >
                            {isApprovingCompany ? (
                                <LoadingSpinner />
                            ) : (
                                <BadgeCheckIcon className="mr-2" />
                            )}{' '}
                            Approve
                        </DropdownMenuItem>
                    )} */}
                </>
            }
        />
    )
}

export default MembersTableAdminAction
