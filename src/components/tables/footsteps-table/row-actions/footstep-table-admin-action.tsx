import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { IFootstepTableActionComponentProp } from '../columns'
// import useConfirmModalStore from '@/store/confirm-modal-store';

interface IFootstepTableAdminActionProps
    extends IFootstepTableActionComponentProp {
    onDeleteSuccess?: () => void
    onFootstepUpdate?: () => void
}

const FootstepTableAdminAction: React.FC<
    IFootstepTableAdminActionProps
> = () => {
    // const footstep = row.original;

    // const { onOpen } = useConfirmModalStore();

    // const { isPending: isDeleting, mutate: deleteFootstep } =
    //     useDeleteFootstep({
    //         onSuccess: onDeleteSuccess,
    //     });

    return (
        <RowActionsGroup
            onDelete={{
                text: 'Delete',
                // isAllowed: !isDeleting,
                onClick: () => {
                    // onOpen({
                    //     title: 'Delete Footstep',
                    //     description: `Are you sure you want to delete this footstep with ID "${footstep.id}"?`,
                    //     onConfirm: () => deleteFootstep(footstep.id),
                    // });
                },
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: () => {
                    // Navigate to edit page, e.g., `/admin/footsteps-management/$footstepId/edit`
                },
            }}
            onView={{
                text: 'View',
                isAllowed: true,
                onClick: () => {
                    // Navigate to view page, e.g., `/admin/footsteps-management/$footstepId/view`
                },
            }}
            otherActions={
                <>
                    {/* Example of other admin-specific actions */}
                    {/* Add any additional dropdown items or buttons specific to admin */}
                </>
            }
        />
    )
}

export default FootstepTableAdminAction
