import { toast } from 'sonner'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { cn } from '@/lib'
import { useCategoryStore } from '@/store/onboarding/category-store'
import { useAuthUser } from '@/store/user-auth-store'
import { useNavigate } from '@tanstack/react-router'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    BuildingIcon,
    GearIcon,
    PinLocationIcon,
    PlusIcon,
} from '@/components/icons'
import PlainTextEditor from '@/components/plain-text-editor'
import { StatusBadge } from '@/components/status-badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useSwitchOrganization } from '@/hooks/api-hooks/use-user-organization'

import { IOrgUserOrganizationGroup, IUserOrganization } from '@/types'

type WithOrganizationViewProps = {
    organizationsWithBranches: IOrgUserOrganizationGroup[]
}

const WithOrganization = ({
    organizationsWithBranches,
}: WithOrganizationViewProps) => {
    const navigate = useNavigate()
    const {
        updateCurrentAuth,
        currentAuth: { user },
    } = useAuthUser()
    const { mutateAsync: switchOrganization } = useSwitchOrganization()
    const { handleProceedToSetupOrg } = useCategoryStore()

    const handleVisit = async (userOrganization: IUserOrganization) => {
        const response = await switchOrganization(userOrganization.id)

        if (response) {
            updateCurrentAuth({
                user_organization: userOrganization,
                user: userOrganization.user,
            })

            navigate({
                to: `/org/${userOrganization.organization.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(
                        /^-+|-+$/g,
                        ''
                    )}/branch/${userOrganization.branch.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}`,
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
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                >
                    <PlusIcon />
                    Create your own Organization
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => {
                        navigate({ to: '/onboarding/organization' })
                    }}
                    className={cn('w-[300px] gap-x-2 rounded-xl')}
                >
                    <BuildingIcon />
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
                    {organizationsWithBranches.map((org) => {
                        const mediaUrl = org.media?.url ?? orgBannerList[0]

                        return (
                            <AccordionItem
                                key={org.id}
                                value={org.name ?? ''}
                                className={cn('rounded-3xl border-0')}
                            >
                                <GradientBackground mediaUrl={mediaUrl}>
                                    <AccordionTrigger className="relative flex min-h-32 w-full cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                        <div className="flex flex-col">
                                            <p className="touch-pan-up text-start text-2xl font-bold">
                                                {org.name}
                                            </p>
                                            <PlainTextEditor
                                                content={org.description}
                                            />
                                            {org?.id &&
                                                org.created_by_id ===
                                                    user.id && (
                                                    <span
                                                        onClick={() => {
                                                            navigate({
                                                                to: '/onboarding/create-branch/$organization_id',
                                                                params: {
                                                                    organization_id:
                                                                        org.id,
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
                                    {org.user_organizations.length === 0 && (
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
                                        {org.user_organizations.map(
                                            (userOrg, i) => {
                                                const mediaUrl =
                                                    userOrg.branch?.media
                                                        ?.url ??
                                                    orgBannerList[0]
                                                return (
                                                    <div
                                                        key={
                                                            userOrg.branch
                                                                ?.id ?? i
                                                        }
                                                    >
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
                                                                            userOrg
                                                                                .branch
                                                                                ?.name
                                                                        }
                                                                    </h1>
                                                                    {userOrg
                                                                        .branch
                                                                        ?.description && (
                                                                        <PlainTextEditor
                                                                            className="text-xs"
                                                                            content={
                                                                                userOrg
                                                                                    .branch
                                                                                    ?.description ??
                                                                                ''
                                                                            }
                                                                        />
                                                                    )}
                                                                    <span className="flex items-center gap-y-2 text-xs">
                                                                        {' '}
                                                                        <PinLocationIcon className="mr-2 text-destructive/60" />
                                                                        {
                                                                            userOrg
                                                                                .branch
                                                                                ?.address
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <StatusBadge
                                                                    status={
                                                                        userOrg.application_status
                                                                    }
                                                                />
                                                                <Button
                                                                    disabled={
                                                                        userOrg.application_status ===
                                                                        'pending'
                                                                    }
                                                                    onClick={async () => {
                                                                        handleVisit(
                                                                            userOrg
                                                                        )
                                                                    }}
                                                                    size={'sm'}
                                                                    variant={
                                                                        'secondary'
                                                                    }
                                                                >
                                                                    visit as{' '}
                                                                    {
                                                                        userOrg.user_type
                                                                    }
                                                                </Button>
                                                            </div>
                                                        </GradientBackground>
                                                    </div>
                                                )
                                            }
                                        )}
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
