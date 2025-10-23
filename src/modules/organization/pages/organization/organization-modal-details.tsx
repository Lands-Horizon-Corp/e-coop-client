import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    OrganizationPreviewDisplay,
    useGetBranchesByOrganizationId,
} from '@/modules/branch'
import { BranchesSection } from '@/modules/branch/components/branches-section'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'

import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import OrganizationDetails from '../../components/organization-details'
import { IOrganization } from '../../organization.types'

type OrganizationModalDetailsProps = {
    organization: IOrganization
    isPending?: boolean
    showActions?: boolean
    handleJoin?: () => void
}

const OrganizationModalDetails = ({
    organization,
    isPending: isPendingOrganization,
    showActions = true,
    handleJoin,
}: OrganizationModalDetailsProps) => {
    const countryCode = useLocationInfo().countryCode
    const queryClient = useQueryClient()
    const createModal = useModalState()

    const { data: branches, isPending: isPendingBranches } =
        useGetBranchesByOrganizationId({ organizationId: organization.id })

    const handleCreateBranch = () => {
        createModal.onOpenChange(true)
    }

    return (
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
                organization={organization}
                showActions={showActions}
            />
            <BranchesSection
                branches={branches}
                isPending={isPendingBranches}
                isSeeding={false}
                onCreateBranch={handleCreateBranch}
                organizationId={organization.id}
                showActions={showActions}
            />
            <OrganizationDetails
                onJoin={handleJoin}
                organization={organization}
                showActions={showActions}
            />
        </div>
    )
}
export default OrganizationModalDetails
