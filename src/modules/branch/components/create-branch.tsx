import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useGetBranchesByOrganizationId } from '@/modules/branch'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { useGetById } from '@/modules/organization'
import { useSeedOrganization } from '@/modules/user-organization/user-organization.service'

import { Alert, AlertDescription } from '@/components/ui/alert'

import { useLocationInfo } from '@/hooks/use-location-info'
import { useModalState } from '@/hooks/use-modal-state'

import { BranchesSection } from './branches-section'
import { CompletionSection } from './completion-section'
import OrganizationCard from './organization-card'

const CreateBranch = () => {
    const { organization_id: organizationId } = useParams({
        from: '/onboarding/create-branch/$organization_id',
    })
    const countryCode = useLocationInfo().countryCode
    const navigate = useNavigate()
    const { mutateAsync: seed, isPending: isSeeding } = useSeedOrganization()
    const queryClient = useQueryClient()
    const createModal = useModalState()

    const {
        data: organization,
        isPending: isPendingOrganization,
        error: organizationError,
    } = useGetById({ id: organizationId })

    const {
        data: branches,
        isPending: isPendingBranches,
        error: branchesError,
    } = useGetBranchesByOrganizationId({ organizationId })

    const isNoBranches = branches?.length === 0
    const hasError = organizationError || branchesError

    const handleSeedOrganizationWithBranch = async () => {
        if (!organization?.id) return

        try {
            const response = await seed(organization.id)
            if (response) {
                toast.success(
                    'Successfully seeded the Organization with Branch!'
                )
                navigate({ to: '/onboarding' })
            }
        } catch (error) {
            toast.error('Failed to seed organization. Please try again.')
            console.error('Seed error:', error)
        }
    }

    const handleCreateBranch = () => {
        createModal.onOpenChange(true)
    }

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6">
                <Alert className="max-w-md" variant="destructive">
                    <AlertDescription>
                        Failed to load organization data. Please refresh the
                        page or try again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6">
            <CreateUpdateBranchFormModal
                {...createModal}
                className="w-full min-w-[80rem] max-w-[80rem]"
                description="Fill out the form to add new branch"
                formProps={{
                    organizationId,
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

            {/* Organization Header */}
            <OrganizationCard
                isLoading={isPendingOrganization}
                onCreateBranch={handleCreateBranch}
                organization={organization}
            />
            {/* <Separator /> */}
            {/* Branches Section */}
            <BranchesSection
                branches={branches}
                isPending={isPendingBranches}
                isSeeding={isSeeding}
                onCreateBranch={handleCreateBranch}
                organizationId={organizationId}
            />
            {/* Completion Section */}
            <CompletionSection
                isNoBranches={isNoBranches}
                isSeeding={isSeeding}
                onFinishSetup={handleSeedOrganizationWithBranch}
            />
        </div>
    )
}
export default CreateBranch
