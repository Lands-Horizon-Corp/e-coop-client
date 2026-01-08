import { useQueryClient } from '@tanstack/react-query'

import { BranchesSection } from '@/modules/branch/components/branches-section'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { BranchesProvider } from '@/modules/branch/context/branches-context'
import { useGetCurrentUserOrganizations } from '@/modules/user-organization'

import { useModalState } from '@/hooks/use-modal-state'

import { IOrganization } from '../../organization.types'
import OrganizationPreviewModalDetails from '../../pages/onboarding/with-organization/organization-preview-details-modal'
import { OrganizationPreviewDisplay } from '../organization-preview-display'

type OrganizationDetailsModalProps = {
    organization: IOrganization
    isPending?: boolean
    showActions?: boolean
    handleJoin?: () => void
    showBranchesSection?: boolean
    showJoinBranch?: boolean
    isSeeding?: boolean
}

const OrganizationDetailsModal = ({
    isPending: isPendingOrganization,
    showActions = true,
    handleJoin,
    showBranchesSection = true,
    showJoinBranch,
    organization,
    isSeeding,
}: OrganizationDetailsModalProps) => {
    const queryClient = useQueryClient()
    const createModal = useModalState()

    const { data: userOrganizationsData, isPending: isPendingBranches } =
        useGetCurrentUserOrganizations()

    const organizationId = organization.id

    const userOrganizations = userOrganizationsData?.find(
        (org) => org.id === organizationId
    )?.user_organizations

    const handleCreateBranch = () => {
        createModal.onOpenChange(true)
    }

    return (
        <BranchesProvider
            value={{
                isSeeding,
                organizationId,
                showActions,
                showJoinBranch,
                userOrganizations,
            }}
        >
            <div className="w-full flex flex-col space-y-6">
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
                            queryClient.invalidateQueries({
                                queryKey: ['user-organization', 'current'],
                            })
                        },
                    }}
                    title="Create Branch"
                />
                <OrganizationPreviewDisplay
                    isLoading={isPendingOrganization}
                    onCreateBranch={handleCreateBranch}
                    organization={organization}
                    showActions={showActions}
                />
                {showBranchesSection && (
                    <BranchesSection
                        isPending={isPendingBranches}
                        onCreateBranch={handleCreateBranch}
                    />
                )}
                <OrganizationPreviewModalDetails
                    onJoin={handleJoin}
                    organization={organization}
                    showActions={showActions}
                />
            </div>
        </BranchesProvider>
    )
}
export default OrganizationDetailsModal
