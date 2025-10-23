import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { IOrganization } from '@/modules/organization'

import Modal, { IModalProps } from '@/components/modals/modal'

import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import OrganizationModalDetails from '../pages/organization/organization-modal-details'
import { OrganizationPreviewDisplaySkeleton } from '../pages/organization/organization-preview-display'

interface OrganizationModalProps extends IModalProps {
    organization?: IOrganization | null
    onCreateBranch?: (organization: IOrganization) => void
    className?: string
    showActions?: boolean
    isLoading?: boolean
}

const OrganizationModal = ({
    organization,
    className,
    showActions = true,
    isLoading,
    ...modalProps
}: OrganizationModalProps) => {
    const createModal = useModalState()
    const queryClient = useQueryClient()
    const countryCode = useLocationInfo().countryCode

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
                className="w-full min-w-[80rem] max-w-[80rem]"
                description="Fill out the form to add new branch"
                formProps={{
                    organizationId: organization.id,
                    defaultValues: {
                        country_code: countryCode || 'PH',
                    },
                    hiddenFields: ['is_main_branch'],
                    onSuccess: () => {
                        createModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: ['get-branches-by-organization-id'],
                        })
                        toast.success('Branch created successfully!')
                    },
                }}
                title="Create Branch"
            />
            <div className="relative">
                {isLoading ? (
                    <OrganizationPreviewDisplaySkeleton
                        className="rounded-none min-h-screen overflow-y-hidden"
                        variant="default"
                    />
                ) : (
                    <OrganizationModalDetails
                        organization={organization}
                        showActions={showActions}
                    />
                )}
            </div>
        </Modal>
    )
}

export default OrganizationModal
