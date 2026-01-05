import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { useGetOrganizationById } from '@/modules/organization'
import {
    IOrgUserOrganizationGroup,
    IUserOrganization,
} from '@/modules/user-organization'
import { useSwitchOrganization } from '@/modules/user-organization/user-organization.service'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { BuildingIcon, PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useModalState } from '@/hooks/use-modal-state'
import { useUrlModal } from '@/hooks/use-url-modal'

import { TEntityId } from '@/types'

import OrganizationBranchesModal from './modal/org-branches-modal'
import OrganizationList from './organization-list'
import OrganizationPreviewModal from './organization-modal'

type UserOrganizationsDashboardProps = {
    organizationsWithBranches: IOrgUserOrganizationGroup[]
}

const UserOrganizationsDashboard = ({
    organizationsWithBranches,
}: UserOrganizationsDashboardProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const openOrgBranch = useModalState(false)
    const {
        updateCurrentAuth,
        currentAuth: { user },
    } = useAuthUser()

    const {
        isOpen: isModalOpen,
        paramValue: organizationId,
        openWithParam: openOrganizationModal,
        onOpenChange,
    } = useUrlModal({ paramName: 'organization_id', defaultOpen: false })

    const {
        data: organization,
        isLoading: isLoadingOrganization,
        error: organizationError,
    } = useGetOrganizationById({
        id: organizationId || '',
        options: {
            enabled: !!organizationId,
        },
    })

    const { mutateAsync: switchOrganization } = useSwitchOrganization()
    const { handleProceedToSetupOrg } = useCategoryStore()
    const [switchingOrgId, setSwitchingOrgId] = useState<TEntityId | null>(null)
    const [selectedOrg, setSelectedOrg] =
        useState<IOrgUserOrganizationGroup | null>(null)

    const error = serverRequestErrExtractor({ error: organizationError })

    const handleVisit = async (userOrganization: IUserOrganization) => {
        setSwitchingOrgId(userOrganization.id)

        try {
            const response = await switchOrganization(userOrganization.id)

            if (response) {
                await queryClient.invalidateQueries({
                    queryKey: ['auth', 'context'],
                })

                updateCurrentAuth({
                    user_organization: userOrganization,
                    user: userOrganization.user,
                })

                const orgName = userOrganization.organization.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                const branchName = userOrganization.branch.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                navigate({
                    to: `/org/${orgName}/branch/${branchName}`,
                })
            } else {
                throw new Error('Server failed to switch organization')
            }
        } catch (error) {
            console.error('Failed to switch organization:', error)
            toast.error('Failed to switch organization')
        } finally {
            setSwitchingOrgId(null)
        }
    }

    return (
        <div className="w-full mt-2">
            {selectedOrg && (
                <OrganizationBranchesModal
                    {...openOrgBranch}
                    className="min-w-fit"
                    handleVisit={handleVisit}
                    organization={selectedOrg}
                    overlayClassName="!bg-transparent"
                    switchingOrgId={switchingOrgId}
                    title="List of Branches"
                />
            )}
            <OrganizationPreviewModal
                isLoading={isLoadingOrganization}
                onOpenChange={onOpenChange}
                open={isModalOpen}
                organization={organization}
                showActions={false}
            />
            <div className="mb-7 flex w-full justify-center space-x-2">
                <Button
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                    onClick={() => handleProceedToSetupOrg(navigate)}
                >
                    <PlusIcon />
                    Create your own Organization
                </Button>
                <Button
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                    // disabled

                    onClick={() =>
                        navigate({ to: '/onboarding/organization' as string })
                    }
                    variant="secondary"
                >
                    <BuildingIcon />
                    Join an Organization
                </Button>
            </div>
            <FormErrorMessage errorMessage={error} />
            <OrganizationList
                openOrgModal={(id) => {
                    openOrganizationModal(id)
                }}
                organization={organizationsWithBranches}
                user={user}
                visitOrgBranch={(org) => {
                    openOrgBranch.onOpenChange(true)
                    setSelectedOrg(org)
                }}
            />
        </div>
    )
}

export default UserOrganizationsDashboard
