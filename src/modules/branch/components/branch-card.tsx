import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { IBranch, useDeleteBranch } from '@/modules/branch'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { EditPencilIcon, TrashIcon } from '@/components/icons'
import CardTopImage from '@/components/ui/card-top-image'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

interface BranchCardProps {
    branch: IBranch
    organizationId: TEntityId
    isSeeding: boolean
}

export const BranchCard = ({
    branch,
    organizationId,
    isSeeding,
}: BranchCardProps) => {
    const updateModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const queryClient = useQueryClient()

    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch({
        options: {
            onSuccess: () => {
                toast.success('Branch deleted successfully!')
                queryClient.invalidateQueries({
                    queryKey: [
                        'get-branches-by-organization-id',
                        organizationId,
                    ],
                })
            },
            onError: () => {
                toast.error('Failed to delete branch. Please try again.')
            },
        },
    })

    const handleDelete = () => {
        onOpen({
            title: 'Delete Branch',
            description: `Are you sure you want to delete "${branch.name}"? This action cannot be undone.`,
            onConfirm: () => deleteBranch(branch.id),
            confirmString: 'Delete',
        })
    }

    const handleEdit = () => {
        updateModal.onOpenChange(true)
    }

    return (
        <>
            <CreateUpdateBranchFormModal
                {...updateModal}
                className="w-full min-w-[80rem] max-w-[80rem]"
                description="Update branch information"
                formProps={{
                    organizationId,
                    branchId: branch.id,
                    hiddenFields: ['is_main_branch'],
                    defaultValues: branch,
                    onSuccess: () => {
                        updateModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: [
                                'get-branches-by-organization-id',
                                organizationId,
                            ],
                        })
                        toast.success('Branch updated successfully!')
                    },
                }}
                title={`Update ${branch.name}`}
            />
            <CardTopImage
                cardContentClassName=""
                cardFooterClassName="justify-end py-2"
                cardHeaderClassName=""
                className="transition-all hover:shadow-lg hover:scale-105"
                description={branch.description}
                imageAlt={`${branch.name} branch`}
                imageSrc={branch.media?.url ?? '/placeholder-branch.jpg'}
                primaryAction={{
                    label: <EditPencilIcon className="h-4 w-4" />,
                    onClick: handleEdit,
                    variant: 'outline',
                    disabled: isSeeding,
                    size: 'sm',
                }}
                secondaryAction={{
                    label: <TrashIcon className="h-4 w-4" />,
                    onClick: handleDelete,
                    variant: 'ghost',
                    disabled: isSeeding || isDeleting,
                    loading: isDeleting,
                    size: 'xs',
                }}
                title={branch.name}
            />
        </>
    )
}
