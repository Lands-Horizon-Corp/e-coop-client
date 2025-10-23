import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import {
    IOrganizationWithPolicies,
    useGetOrganizationById,
} from '@/modules/organization'
import {
    IOrgUserOrganizationGroup,
    IUserOrganization,
} from '@/modules/user-organization'
import { useSwitchOrganization } from '@/modules/user-organization/user-organization.service'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    BuildingIcon,
    DotBigIcon,
    EyeIcon,
    GearIcon,
    LoadingCircleIcon,
    PinLocationIcon,
    PlusIcon,
} from '@/components/icons'
import MapPicker from '@/components/map/map-picker'
import OrganizationPolicies from '@/components/policies'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { useUrlModal } from '@/hooks/use-url-modal'

import OrganizationModal from './organization-modal'

type UserOrganizationsDashboardProps = {
    organizationsWithBranches: IOrgUserOrganizationGroup[]
}

const UserOrganizationsDashboard = ({
    organizationsWithBranches,
}: UserOrganizationsDashboardProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {
        updateCurrentAuth,
        currentAuth: { user, user_organization: currentUserOrg },
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
    const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null)

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
        <div className="w-full">
            <OrganizationModal
                isLoading={isLoadingOrganization}
                onOpenChange={onOpenChange}
                open={isModalOpen}
                organization={organization}
                showActions={false}
            />
            <div className="mb-5 flex w-full justify-center space-x-2">
                <Button
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                    onClick={() => handleProceedToSetupOrg(navigate)}
                >
                    <PlusIcon />
                    Create your own Organization
                </Button>
                <Button
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                    disabled
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
            <ScrollArea className="w-full overflow-auto">
                <Accordion
                    className={cn('w-full space-y-4')}
                    collapsible
                    type="single"
                >
                    {organizationsWithBranches.map((org) => {
                        const mediaUrl = org.media?.download_url
                        const isUserOwner =
                            org.user_organizations[0]?.user_type === 'owner'
                        const isOrgCreator = org.created_by_id === user.id

                        return (
                            <AccordionItem
                                className={cn('rounded-3xl border-0')}
                                key={org.id}
                                value={org.name ?? ''}
                            >
                                <GradientBackground
                                    className="border-secondary/50 border"
                                    imageBackgroundClassName="size-74"
                                    mediaUrl={mediaUrl}
                                >
                                    <AccordionTrigger className="relative flex min-h-32 w-full cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                        <div className="flex flex-col w-full">
                                            <p className="text-start text-2xl font-bold">
                                                {org.name}
                                            </p>
                                            <span className="truncate text-sm line-clamp-2 text-wrap text-start w-fit">
                                                <PlainTextEditor
                                                    content={org.description}
                                                />
                                            </span>
                                            <div className="mt-4 flex gap-x-2">
                                                {(isUserOwner ||
                                                    isOrgCreator) && (
                                                    <div className="flex justify-start gap-x-2">
                                                        <Button
                                                            className="mt-2 w-fit"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                navigate({
                                                                    to: `/onboarding/create-branch/${org.id}` as string,
                                                                })
                                                            }}
                                                            size="sm"
                                                            variant="secondary"
                                                        >
                                                            <GearIcon className="mr-2 h-4 w-4" />
                                                            Manage Organization
                                                        </Button>
                                                    </div>
                                                )}
                                                <Button
                                                    className="mt-2 w-fit"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openOrganizationModal(
                                                            org.id
                                                        )
                                                    }}
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                </GradientBackground>

                                <AccordionContent className="p-4">
                                    {org.user_organizations.length === 0 ? (
                                        <GradientBackground opacity={0.1}>
                                            <div className="flex min-h-16 flex-col items-center justify-center gap-y-2">
                                                <p className="text-secondary-foreground/50">
                                                    This organization has no
                                                    branches yet.
                                                </p>
                                                🍃
                                            </div>
                                        </GradientBackground>
                                    ) : (
                                        <div className="flex flex-col gap-y-2">
                                            {org.user_organizations.map(
                                                (userOrg) => {
                                                    const isCurrentOrg =
                                                        userOrg.id ===
                                                        currentUserOrg?.id
                                                    return (
                                                        <ListOfBranches
                                                            isCurrent={
                                                                isCurrentOrg
                                                            }
                                                            isLoading={
                                                                switchingOrgId ===
                                                                userOrg.id
                                                            }
                                                            key={userOrg.id}
                                                            onClick={() =>
                                                                toast.promise(
                                                                    handleVisit(
                                                                        userOrg
                                                                    ),
                                                                    {
                                                                        loading: `Switching to ${userOrg.branch?.name}...`,
                                                                        success: `Switched to ${userOrg.branch?.name}`,
                                                                        error: `Failed to switch to ${userOrg.branch?.name}`,
                                                                    }
                                                                )
                                                            }
                                                            userOrg={userOrg}
                                                        />
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}

                                    {org && (
                                        <OrganizationPolicies
                                            organization={
                                                org.user_organizations[0]
                                                    ?.organization as IOrganizationWithPolicies
                                            }
                                        />
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </ScrollArea>
        </div>
    )
}

type ListOfBranchesProps = {
    userOrg: IUserOrganization
    onClick: () => void
    isCurrent: boolean
    isLoading: boolean
}

const ListOfBranches = ({
    userOrg,
    onClick,
    isCurrent,
    isLoading,
}: ListOfBranchesProps) => {
    const mediaUrl = userOrg.branch?.media?.download_url
    const isPending = userOrg.application_status === 'pending'
    return (
        <div key={userOrg.branch?.id ?? ''}>
            <GradientBackground className="border" gradientOnly>
                <div className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                    <Avatar className="size-16">
                        <AvatarImage src={mediaUrl} />
                    </Avatar>
                    <div className="flex grow flex-col">
                        <h1>{userOrg.branch?.name}</h1>
                        {userOrg.branch?.description && (
                            <PlainTextEditor
                                className="text-xs"
                                content={userOrg.branch?.description ?? ''}
                            />
                        )}
                        <span className="flex items-center gap-y-2 text-xs">
                            <PinLocationIcon className="mr-2 text-destructive/60" />
                            {userOrg.branch?.address}
                        </span>

                        {userOrg.branch.latitude &&
                            userOrg.branch.longitude && (
                                <div className="mt-2">
                                    <MapPicker
                                        className="text-xs"
                                        disabled={false}
                                        hideButtonCoordinates={true}
                                        onChange={() => {}} // Read-only, no changes allowed
                                        placeholder="View Branch Location"
                                        size="sm"
                                        title={`${userOrg.branch.name} Location`}
                                        value={{
                                            lat: userOrg.branch.latitude,
                                            lng: userOrg.branch.longitude,
                                        }}
                                        variant="outline"
                                        viewOnly={true}
                                    />
                                </div>
                            )}
                    </div>

                    {!isPending && (
                        <>
                            <Button
                                disabled={
                                    userOrg.application_status === 'pending' ||
                                    isLoading
                                }
                                onClick={onClick}
                                size={'sm'}
                                variant={isCurrent ? 'default' : 'outline'}
                            >
                                {isLoading ? (
                                    <>
                                        {isCurrent ? (
                                            <LoadingCircleIcon className=" animate-spin" />
                                        ) : (
                                            'Switching...'
                                        )}
                                    </>
                                ) : isCurrent ? (
                                    'Current'
                                ) : (
                                    `visit as ${userOrg.user_type}`
                                )}
                            </Button>
                            <br />
                            <div className="block">
                                <DotBigIcon
                                    className={cn(
                                        'inline',
                                        userOrg.application_status ===
                                            'accepted'
                                            ? 'text-green-400'
                                            : 'text-destructive'
                                    )}
                                />
                                {userOrg.application_status}
                            </div>
                        </>
                    )}
                </div>
            </GradientBackground>
        </div>
    )
}

export default UserOrganizationsDashboard
