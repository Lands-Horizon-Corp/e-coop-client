import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers/tw-utils'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { IOrganization } from '@/modules/organization'

import Modal, { IModalProps } from '@/components/modals/modal'

import { useModalState } from '@/hooks/use-modal-state'

import OrganizationPreviewDisplaySkeleton from '../organization-preview-display-skeleton'
import OrganizationDetailsModals from './organization-details-modal'

interface OrganizationModalProps extends IModalProps {
    organization?: IOrganization | null
    onCreateBranch?: (organization: IOrganization) => void
    className?: string
    showActions?: boolean
    isLoading?: boolean
    showJoinBranch?: boolean
}

const OrganizationPreviewModal = ({
    organization,
    className,
    showActions = true,
    isLoading,
    showJoinBranch,
    ...modalProps
}: OrganizationModalProps) => {
    const createModal = useModalState()
    const queryClient = useQueryClient()

    if (!organization) return null

    return (
        <Modal
            {...modalProps}
            className={cn(
                '!max-w-4xl w-full border-0 p-0 !rounded-[10px] max-h-[90vh]',
                isLoading ? 'overflow-y-hidden' : '',
                className
            )}
            showCloseButton={false}
            titleClassName="hidden"
        >
            <CreateUpdateBranchFormModal
                {...createModal}
                description="Fill out the form to add new branch"
                formProps={{
                    organizationId: organization.id,
                    defaultValues: {},
                    hiddenFields: ['is_main_branch'],
                    onSuccess: () => {
                        createModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: ['get-branches-by-organization-id'],
                        })
                    },
                }}
                title="Create Branch"
            />
            <div className="relative">
                {isLoading ? (
                    <OrganizationPreviewDisplaySkeleton className="rounded-none min-h-screen overflow-y-hidden" />
                ) : (
                    <OrganizationDetailsModals
                        organization={organization}
                        showActions={showActions}
                        showJoinBranch={showJoinBranch}
                    />
                )}
            </div>
        </Modal>
    )
}

export default OrganizationPreviewModal
