import { ScrollArea } from '@/components/ui/scroll-area'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import { PinLocationIcon } from '@/components/icons'
import { StatusBadge } from '@/components/status-badge'
import SafeImage from '@/components/safe-image'
import { Button } from '@/components/ui/button'

import { IBranch, TEntityId, UserOrganizationGroup } from '@/types'
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

type WithOrganizationViewProps = {
    organizationsWithBranches: UserOrganizationGroup[]
}

const WithOrganization = ({
    organizationsWithBranches,
}: WithOrganizationViewProps) => {
    const navigate = useNavigate()
    const { mutateAsync: switchOrganization } = useSwitchOrganization()
    const { handleProceedToSetupOrg } = useCategoryStore()

    const handleVisit = async (
        userOrganizationId: TEntityId,
        organizationId: TEntityId,
        orgName: string,
        branchName: string
    ) => {
        const response = await switchOrganization(userOrganizationId)
        if (response) {
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
            <ScrollArea className="ecoop-scroll max-h-[40rem] w-full overflow-auto p-10">
                <Accordion
                    type="single"
                    collapsible
                    className={cn('w-full space-y-4')}
                >
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
                                            <p className="text-start text-xs text-white/80">
                                                <PlainTextEditor
                                                    content={
                                                        org.organizationDetails
                                                            .description
                                                    }
                                                />
                                            </p>
                                            {org.organizationDetails?.id && (
                                                <Button
                                                    size={'sm'}
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
                                                    variant={'secondary'}
                                                    className="mt-2 max-w-32"
                                                >
                                                    Add Branch
                                                </Button>
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
                                                <GradientBackground gradientOny>
                                                    <div
                                                        key={branch.id}
                                                        className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline"
                                                    >
                                                        <SafeImage
                                                            className="size-16"
                                                            src={mediaUrl}
                                                        />
                                                        <div className="flex grow flex-col">
                                                            <h1>
                                                                {branch?.name}
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
                                                            <p className="flex items-center gap-y-2 text-xs">
                                                                {' '}
                                                                <PinLocationIcon className="mr-2 text-destructive/60" />
                                                                {branch.address}
                                                            </p>
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
