import { ScrollArea } from '@/components/ui/scroll-area'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import { GearIcon, PinLocationIcon } from '@/components/icons'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'

import {
    IBranch,
    IUserOrganization,
    TEntityId,
    UserOrganizationGroup,
} from '@/types'
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion'

import { orgBannerList } from '@/assets/pre-organization-banner-background'

import { useSwitchOrganization } from '@/hooks/api-hooks/use-user-organization'

import { toast } from 'sonner'
import { cn } from '@/lib'
import { useNavigate } from '@tanstack/react-router'
import { useCategoryStore } from '@/store/onboarding/category-store'
import { useAuthStore } from '@/store/user-auth-store'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import OrganizationItemSkeleton from '@/components/Skeleton/organization-item-skeleton'

type WithOrganizationViewProps = {
    organizationsWithBranches: UserOrganizationGroup[]
    isLoading: boolean
}

const WithOrganization = ({
    organizationsWithBranches,
    isLoading,
}: WithOrganizationViewProps) => {
    const navigate = useNavigate()
    const { updateCurrentAuth } = useAuthStore()
    const { mutateAsync: switchOrganization } = useSwitchOrganization()
    const { handleProceedToSetupOrg } = useCategoryStore()

    const handleVisit = async (
        userOrganization: IUserOrganization,
        userOrganizationId: TEntityId,
        organizationId: TEntityId,
        orgName: string,
        branchName: string
    ) => {
        const response = await switchOrganization(userOrganizationId)

        if (response) {
            updateCurrentAuth({
                user_organization: userOrganization,
                user: userOrganization.user,
            })

            navigate({
                to: `/org/${orgName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}/branch/${branchName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}`,
                params: {
                    user_organization_id: userOrganizationId,
                    organization_id: organizationId,
                },
            })
        } else {
            toast.error("can't switch Branch")
        }
    }

    return (
        <div className="w-full">
            <div className="my-3 flex w-full justify-center space-x-2">
                <Button
                    onClick={() => {
                        handleProceedToSetupOrg(navigate)
                    }}
                    className={cn('w-[300px] rounded-xl')}
                >
                    Create your own Organization
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => {
                        navigate({ to: '/onboarding/organization' })
                    }}
                    className={cn('w-[300px] rounded-xl')}
                >
                    Join an Organization
                </Button>
            </div>
            <div className="mt-5 w-full px-10">
                <h4>
                    You have existing organization. Choose where to operate.
                </h4>
            </div>
            <ScrollArea className="w-full overflow-auto p-10">
                <Accordion
                    type="single"
                    collapsible
                    className={cn('w-full space-y-4')}
                >
                    {isLoading &&
                        Array.from({ length: 3 }).map((_, index) => (
                            <OrganizationItemSkeleton key={index} />
                        ))}
                    {organizationsWithBranches.map((org) => {
                        const mediaUrl =
                            org.organizationDetails.media?.url ??
                            orgBannerList[0]

                        return (
                            <AccordionItem
                                key={org.userOrganizationId}
                                value={org.organizationDetails.name ?? ''}
                                className={cn('rounded-3xl border-0')}
                            >
                                <GradientBackground mediaUrl={mediaUrl}>
                                    <AccordionTrigger className="relative flex min-h-32 w-full cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                        <div className="flex flex-col">
                                            <p className="touch-pan-up text-start text-2xl font-bold">
                                                {org.organizationDetails.name}
                                            </p>
                                            <PlainTextEditor
                                                content={
                                                    org.organizationDetails
                                                        .description
                                                }
                                            />
                                            {org.organizationDetails?.id &&
                                                org.userOrganization
                                                    .user_type === 'owner' && (
                                                    <span
                                                        onClick={() => {
                                                            navigate({
                                                                to: '/onboarding/create-branch/$user_organization_id/$organization_id',
                                                                params: {
                                                                    user_organization_id:
                                                                        org.userOrganizationId,
                                                                    organization_id:
                                                                        org.orgnizationId,
                                                                },
                                                            })
                                                        }}
                                                        className="mt-2 flex w-fit items-center gap-x-2 rounded-lg border border-border bg-secondary/40 p-2 px-4 text-sm text-foreground duration-300 ease-in-out hover:scale-105 hover:bg-primary/90 hover:text-primary-foreground hover:dark:bg-primary/90 hover:dark:text-primary-foreground"
                                                    >
                                                        <GearIcon /> Manage
                                                        Branch
                                                    </span>
                                                )}
                                        </div>
                                    </AccordionTrigger>
                                </GradientBackground>
                                <AccordionContent className="p-4">
                                    {org.branches.length === 0 && (
                                        <GradientBackground opacity={0.1}>
                                            <div
                                                className={`flex min-h-16 flex-col items-center justify-center gap-y-2`}
                                            >
                                                <p className="text-secondary-foreground/50">
                                                    This organization has no
                                                    branches yet.
                                                </p>
                                                🍃
                                            </div>
                                        </GradientBackground>
                                    )}
                                    <div className="flex flex-col gap-y-2">
                                        {org.branches.map((branch: IBranch) => {
                                            const mediaUrl =
                                                branch.media?.url ??
                                                orgBannerList[0]
                                            return (
                                                <div key={branch.id}>
                                                    <GradientBackground
                                                        gradientOnly
                                                    >
                                                        <div className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                                            <Avatar className="size-16">
                                                                <AvatarImage
                                                                    src={
                                                                        mediaUrl
                                                                    }
                                                                />
                                                            </Avatar>
                                                            <div className="flex grow flex-col">
                                                                <h1>
                                                                    {
                                                                        branch?.name
                                                                    }
                                                                </h1>
                                                                {branch.description && (
                                                                    <PlainTextEditor
                                                                        className="text-xs"
                                                                        content={
                                                                            branch.description ??
                                                                            ''
                                                                        }
                                                                    />
                                                                )}
                                                                <span className="flex items-center gap-y-2 text-xs">
                                                                    {' '}
                                                                    <PinLocationIcon className="mr-2 text-destructive/60" />
                                                                    {
                                                                        branch.address
                                                                    }
                                                                </span>
                                                            </div>
                                                            <StatusBadge
                                                                status={
                                                                    org.isPending
                                                                }
                                                            />
                                                            <Button
                                                                disabled={
                                                                    org.isPending ===
                                                                    'pending'
                                                                }
                                                                onClick={async () => {
                                                                    handleVisit(
                                                                        org.userOrganization,
                                                                        org.userOrganizationId,
                                                                        org.orgnizationId,
                                                                        org
                                                                            .organizationDetails
                                                                            .name,
                                                                        branch.name
                                                                    )
                                                                }}
                                                                size={'sm'}
                                                                variant={
                                                                    'secondary'
                                                                }
                                                            >
                                                                visit
                                                            </Button>
                                                        </div>
                                                    </GradientBackground>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </ScrollArea>
        </div>
    )
}

export default WithOrganization
