import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    OrganizationPreviewDisplay,
    useGetBranchesByOrganizationId,
} from '@/modules/branch'
import { BranchesSection } from '@/modules/branch/components/branches-section'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { BranchesProvider } from '@/modules/branch/context/branches-context'

import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import OrganizationPreviewModalDetails from '../components/organization-preview-modal-details'
import { IOrganization } from '../organization.types'

type OrganizationModalDetailsProps = {
    organization: IOrganization
    isPending?: boolean
    showActions?: boolean
    handleJoin?: () => void
    showBranchesSection?: boolean
    showJoinBranch?: boolean
    isSeeding?: boolean
}

const OrganizationModalDetails = ({
    isPending: isPendingOrganization,
    showActions = true,
    handleJoin,
    showBranchesSection = true,
    showJoinBranch,
    organization,
    isSeeding,
}: OrganizationModalDetailsProps) => {
    const countryCode = useLocationInfo().countryCode
    const queryClient = useQueryClient()
    const createModal = useModalState()

    const organizationId = organization.id
    const { data: branches, isPending: isPendingBranches } =
        useGetBranchesByOrganizationId({ organizationId: organization.id })

    const handleCreateBranch = () => {
        createModal.onOpenChange(true)
    }

    return (
        <BranchesProvider
            value={{
                branches,
                isSeeding,
                organizationId,
                showActions,
                showJoinBranch,
            }}
        >
            <div className="w-full flex flex-col space-y-6">
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
                <OrganizationPreviewDisplay
                    isLoading={isPendingOrganization}
                    onCreateBranch={handleCreateBranch}
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
export default OrganizationModalDetails
