import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { getOrgBranchSafeURLNames } from '@/helpers/function-utils'
import { useSignOut } from '@/modules/authentication'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import {
    IUserOrganization,
    switchOrganization,
    useGetCurrentUserOrganizations,
} from '@/modules/user-organization'
import UserAvatar from '@/modules/user/components/user-avatar'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    ArrowRightIcon,
    BadgeCheckFillIcon,
    BuildingBranchIcon,
    BuildingIcon,
    GearIcon,
    LogoutIcon,
    WoodSignsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

const NavProfileMenu = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { onOpen } = useConfirmModalStore()
    const {
        currentAuth: { user, user_organization: currentUserOrg },
        authStatus,
        resetAuth,
        updateCurrentAuth,
    } = useAuthStore()

    const { mutate: handleSignout, isPending } = useSignOut({
        options: {
            onSuccess: () => {
                router.navigate({ to: '/auth/sign-in' as string })
                resetAuth()
                toast.success('Signed out')
            },
        },
    })

    const {
        data: userOrganizations,
        isPending: isLoading,
        refetch,
    } = useGetCurrentUserOrganizations()

    const handleSwitch = async (
        userOrganization: IUserOrganization,
        branchOverride?: IUserOrganization['branch']
    ) => {
        try {
            const nextUserOrg = branchOverride
                ? {
                      ...userOrganization,
                      branch: branchOverride,
                      branch_id: branchOverride.id,
                  }
                : userOrganization

            const res = await switchOrganization(nextUserOrg.id)
            if (!res) throw new Error('Failed to switch organization')

            updateCurrentAuth({
                user_organization: nextUserOrg,
                user: nextUserOrg.user,
            })

            const { orgName, branchName } = getOrgBranchSafeURLNames(
                nextUserOrg.organization.name,
                nextUserOrg.branch.name
            )

            router.navigate({
                to: `/org/${orgName}/branch/${branchName}/dashboard`,
                params: {
                    // user_organization_id: nextUserOrg.id,
                    organization_id: nextUserOrg.organization.id,
                },
            })

            queryClient.invalidateQueries()
        } catch {
            toast.error("Can't switch Branch")
        }
    }

    if (!user || authStatus !== 'authorized') return null

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    className="rounded-full p-0.5"
                    size="icon"
                    variant="outline"
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <UserAvatar
                            className="size-full capitalize"
                            fallback={user.user_name.charAt(0) ?? '-'}
                            fallbackClassName="bg-transparent"
                            src={user.media?.download_url ?? ''}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="relative flex flex-col max-h-[80vh] w-[24rem] !max-w-md space-y-2 rounded-2xl border-none bg-transparent p-1 shadow-none"
                side="bottom"
            >
                <div className="rounded-xl shrink-0 border bg-popover p-4 shadow-md">
                    <div className="flex flex-col items-center space-y-2">
                        <PreviewMediaWrapper media={user.media}>
                            <ImageDisplay
                                className="size-20 capitalize"
                                fallback={user.user_name.charAt(0) ?? '-'}
                                src={user.media?.download_url}
                            />
                        </PreviewMediaWrapper>
                        <p className="text-sm font-medium leading-none">
                            {user.user_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}

                            {user.is_email_verified && (
                                <BadgeCheckFillIcon className="ml-1 inline size-3 text-primary" />
                            )}
                        </p>
                        <Button
                            className="mx-auto w-fit justify-center"
                            onClick={() =>
                                router.navigate({ to: '/account-profile' })
                            }
                            size="sm"
                            variant="ghost"
                        >
                            <GearIcon className="mr-1" /> Manage Profile
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-xl border bg-popover p-4 shadow-md">
                        <LoadingSpinner />
                    </div>
                ) : userOrganizations && userOrganizations.length > 0 ? (
                    <div className="rounded-xl flex flex-col flex-1 max-h-full min-h-0 border bg-popover shadow-md">
                        <div className="flex p-4 items-center justify-between text-sm font-semibold text-muted-foreground">
                            <span>Organizations</span>
                            <span className="text-xs">
                                ({userOrganizations?.length ?? ''})
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 ecoop-scroll">
                            <Accordion
                                className="w-full"
                                collapsible
                                type="single"
                            >
                                {userOrganizations.map((orgGroup, index) => {
                                    const orgName = orgGroup.name

                                    return (
                                        <AccordionItem
                                            className="border-none"
                                            key={orgGroup.id}
                                            value={`org-${index}`}
                                        >
                                            <AccordionTrigger className="rounded-md px-2 py-2 hover:bg-accent hover:no-underline">
                                                <div className="flex flex-1 items-center gap-3">
                                                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        {orgName}
                                                    </span>
                                                    {currentUserOrg?.organization_id ===
                                                        orgGroup.id && (
                                                        <Badge
                                                            className="bg-primary text-xs text-primary-foreground"
                                                            variant="default"
                                                        >
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-2">
                                                <div className="ml-4 space-y-2">
                                                    {orgGroup.user_organizations
                                                        .length > 0 && (
                                                        <div className="space-y-1">
                                                            <div className="px-2 text-xs font-medium text-muted-foreground">
                                                                Branches (
                                                                {
                                                                    orgGroup
                                                                        .user_organizations
                                                                        .length
                                                                }
                                                                )
                                                            </div>
                                                            {orgGroup.user_organizations.map(
                                                                (userOrg) => {
                                                                    return (
                                                                        <div
                                                                            className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                                                                                currentUserOrg?.branch_id ===
                                                                                userOrg.branch_id
                                                                                    ? 'border border-primary bg-primary/20'
                                                                                    : 'hover:bg-muted/50'
                                                                            }`}
                                                                            key={
                                                                                userOrg.id
                                                                            }
                                                                        >
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="mb-1 flex items-center gap-2">
                                                                                    <BuildingBranchIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                                                                    <span className="truncate text-xs font-medium">
                                                                                        {
                                                                                            userOrg
                                                                                                .branch
                                                                                                .name
                                                                                        }
                                                                                    </span>
                                                                                    {userOrg
                                                                                        .branch
                                                                                        .is_main_branch && (
                                                                                        <Badge
                                                                                            className="text-xs"
                                                                                            variant="outline"
                                                                                        >
                                                                                            Main
                                                                                        </Badge>
                                                                                    )}

                                                                                    {userOrg.application_status !==
                                                                                        'accepted' && (
                                                                                        <Badge
                                                                                            className="ml-auto text-xs"
                                                                                            variant="warning"
                                                                                        >
                                                                                            Pending
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <div className="ml-5 truncate text-xs text-muted-foreground">
                                                                                    {
                                                                                        userOrg
                                                                                            .branch
                                                                                            .city
                                                                                    }

                                                                                    ,{' '}
                                                                                    {
                                                                                        userOrg
                                                                                            .branch
                                                                                            .province
                                                                                    }
                                                                                </div>
                                                                                <div className="ml-5 text-xs capitalize text-muted-foreground">
                                                                                    {
                                                                                        userOrg
                                                                                            .branch
                                                                                            .type
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col items-end space-y-1">
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    as{' '}
                                                                                    {
                                                                                        userOrg.user_type
                                                                                    }
                                                                                </p>

                                                                                <Button
                                                                                    className="ml-2 h-6 flex-shrink-0 px-2 text-xs"
                                                                                    disabled={
                                                                                        isLoading ||
                                                                                        [
                                                                                            'pending',
                                                                                            'ban',
                                                                                            'reported',
                                                                                        ].includes(
                                                                                            userOrg.application_status
                                                                                        )
                                                                                    }
                                                                                    onClick={() =>
                                                                                        toast.promise(
                                                                                            handleSwitch(
                                                                                                userOrg
                                                                                            ),
                                                                                            {
                                                                                                loading:
                                                                                                    'Switching...',
                                                                                                success: `Switched to ${userOrg.branch.name}`,
                                                                                                error: "Can't switch branch",
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                >
                                                                                    {currentUserOrg?.branch_id ===
                                                                                    userOrg.branch_id
                                                                                        ? 'Go'
                                                                                        : 'Switch'}
                                                                                    {isLoading ? (
                                                                                        <LoadingSpinner className="ml-1 h-3 w-3" />
                                                                                    ) : (
                                                                                        <ArrowRightIcon className="ml-1 h-3 w-3" />
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </div>
                    </div>
                ) : (
                    <div className="border p-4 text-center text-sm text-muted-foreground bg-popover rounded-xl shadow-md">
                        <WoodSignsIcon className="opacity-70 mx-auto size-8 my-4" />
                        <p>
                            No organizations found{' '}
                            <span
                                className="cursor-pointer underline"
                                onClick={() => refetch()}
                            >
                                retry
                            </span>
                        </p>
                    </div>
                )}

                <div className="flex items-center shrink-0 gap-x-2 rounded-xl border bg-popover p-1 shadow-md">
                    <Button
                        className="justify-center flex-1"
                        disabled={
                            router.state.location.pathname === '/onboarding'
                        }
                        onClick={() =>
                            onOpen({
                                title: 'Onboarding',
                                description:
                                    'Are you sure you want to go to onboarding page?',
                                onConfirm: () =>
                                    router.navigate({
                                        to: '/onboarding' as string,
                                    }),
                            })
                        }
                        variant="ghost"
                    >
                        <ArrowRightIcon className="mr-2 size-4 -rotate-45 duration-150 ease-in-out" />
                        <span>Onboarding</span>
                    </Button>
                    <Button
                        className="flex-1 justify-center"
                        onClick={() =>
                            onOpen({
                                title: 'Sign Out',
                                description:
                                    'Are you sure you want to sign out?',
                                onConfirm: () => handleSignout(),
                            })
                        }
                        variant="destructive"
                    >
                        <LogoutIcon className="mr-2 size-4 duration-150 ease-in-out" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NavProfileMenu
