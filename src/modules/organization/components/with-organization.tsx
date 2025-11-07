import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { toReadableDateShort } from '@/helpers/date-utils'
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

import {
    ArrowRightIcon,
    BuildingIcon,
    DotBigIcon,
    EyeIcon,
    LoadingCircleIcon,
    PencilFillIcon,
    PinLocationIcon,
    PlusIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import FormErrorMessage from '@/components/ui/form-error-message'
import TruncatedText from '@/components/ui/truncated-text'

import { useModalState } from '@/hooks/use-modal-state'
import { useUrlModal } from '@/hooks/use-url-modal'

import { TEntityId } from '@/types'

import OrganizationBranchesModal from './modal/org-branches-modal'
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
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-5 mt-10">
                {organizationsWithBranches.map((org) => {
                    const mediaUrl = org.media?.download_url
                    const coverUrl = org.cover_media?.download_url
                    const isUserOwner =
                        org.user_organizations[0]?.user_type === 'owner'
                    const isOrgCreator = org.created_by_id === user.id

                    return (
                        <Card
                            className="relative bg-sidebar/90 duration-300 max-w-xs min-h-60 rounded-3xl hover:bg-background dark:hover:bg-background/50"
                            key={org.id}
                        >
                            <ImageDisplay
                                className="h-full w-auto rounded-3xl -z-10  absolute inset-0"
                                src={coverUrl ?? ''}
                            />
                            <CardHeader>
                                <div className="flex items-center ">
                                    <ImageDisplay
                                        className="size-12"
                                        src={mediaUrl ?? ''}
                                    />
                                    <Badge
                                        className="h-8 ml-4"
                                        variant={'outline'}
                                    >
                                        {toReadableDateShort(org.created_at)}
                                    </Badge>
                                </div>
                                <CardTitle className="truncate min-w-0 text-xl">
                                    {org.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="">
                                <TruncatedText
                                    className="text-xs max-h-16 text-card-foreground ecoop-scroll overflow-auto"
                                    maxLength={100}
                                    text={org.description ?? ''}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-1">
                                {(isUserOwner || isOrgCreator) && (
                                    <div className="flex justify-start gap-x-2">
                                        <Button
                                            className="rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate({
                                                    to: `/onboarding/create-branch/${org.id}` as string,
                                                })
                                            }}
                                            size="icon"
                                            variant={'secondary'}
                                        >
                                            <PencilFillIcon className=" h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    className="rounded-full font-thin cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openOrganizationModal(org.id)
                                    }}
                                    size={'icon'}
                                    variant={'secondary'}
                                >
                                    <EyeIcon className="h-4 w-4" />
                                </Button>

                                <Button
                                    className=" cursor-pointer"
                                    onClick={() => {
                                        openOrgBranch.onOpenChange(true)
                                        setSelectedOrg(org)
                                    }}
                                    size={'sm'}
                                >
                                    visit
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

type ListOfBranchesProps = {
    userOrg: IUserOrganization
    onClick: () => void
    isCurrent: boolean
    isLoading: boolean
    onSelect: (org: IUserOrganization) => void
}

export const ListOfBranches = ({
    userOrg,
    onClick,
    isCurrent,
    isLoading,
    onSelect,
}: ListOfBranchesProps) => {
    const mediaUrl = userOrg.branch?.media?.download_url
    const isPending = userOrg.application_status === 'pending'
    return (
        <div key={userOrg.branch?.id ?? ''}>
            <div className="relative inline-flex min-h-16 w-full justify-between rounded-xl bg-card cursor-pointer items-center gap-x-2 border-0 p-2 hover:bg-card/70 ">
                <div className="flex max-w-full min-w-0">
                    <div className="inline-flex space-x-2 truncate">
                        <div className="relative">
                            <Avatar className="relative size-12">
                                <AvatarImage src={mediaUrl} />
                            </Avatar>
                            <Button
                                className="absolute rounded-full size-6 cursor-pointer bottom-0 right-0 "
                                onClick={() => {
                                    onSelect?.(userOrg)
                                }}
                                size={'icon'}
                            >
                                <PinLocationIcon className="size-fit" />
                            </Button>{' '}
                        </div>
                        <div className="w-full items-center truncate min-w-0 max-w-full ">
                            <div className="flex items-center text-xs text-muted-foreground">
                                {userOrg.application_status}
                                <DotBigIcon
                                    className={cn(
                                        'inline ml-1',
                                        userOrg.application_status ===
                                            'accepted'
                                            ? 'text-green-400'
                                            : 'text-destructive'
                                    )}
                                />
                            </div>
                            <h1 className="truncate">{userOrg.branch?.name}</h1>
                            <div className="w-full">
                                <div className="flex items-center max-w-full gap-y-2 text-xs">
                                    <p className="truncate min-w-0 text-xs text-muted-foreground/80">
                                        {userOrg.branch?.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isPending && (
                    <div className="flex flex-col items-center ">
                        <span className="text-muted-foreground text-xs">
                            {' '}
                            as {userOrg.user_type}
                        </span>
                        <Button
                            disabled={
                                userOrg.application_status === 'pending' ||
                                isLoading
                            }
                            onClick={onClick}
                            size="sm"
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
                                <>
                                    Switch <ArrowRightIcon />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserOrganizationsDashboard
