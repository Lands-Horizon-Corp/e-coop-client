import { useMemo } from 'react'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { createFileRoute } from '@tanstack/react-router'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { BranchIcon, PhoneIcon, PushPinIcon } from '@/components/icons'
import PlainTextEditor from '@/components/plain-text-editor'
import SafeImage from '@/components/safe-image'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetOrganizationById } from '@/hooks/api-hooks/use-organization'
import { useCanJoinMember } from '@/hooks/api-hooks/use-user-organization'

import Branch from './-branch'

export const Route = createFileRoute(
    '/onboarding/organization/$organization_id'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { organization_id } = Route.useParams()

    const { data: organization, isPending: isPendingOrganization } =
        useGetOrganizationById(organization_id)
    console.log('organization', organization)

    const initialTermsState = useMemo(() => {
        if (!organization) return []

        return [
            {
                name: 'Terms And Condition',
                value: 'terms_and_conditions',
                content: organization.terms_and_conditions,
            },
            {
                name: 'Privacy Policy',
                value: 'privacy_policy',
                content: organization.privacy_policy,
            },
            {
                name: 'Refund Policy',
                value: 'refund_policy',
                content: organization.refund_policy,
            },
            {
                name: 'User Agreement',
                value: 'user_agreement',
                content: organization.user_agreement,
            },
        ]
    }, [organization])

    console.log('initialTermsState', initialTermsState)

    const {
        data: joinableBranches,
        isPending: isPendingBranches,
        isSuccess: isSuccessFetchingBranch,
    } = useCanJoinMember(organization_id)

    const fallBackImage = orgBannerList[0]

    const mediaUrl = organization?.media?.url ?? fallBackImage

    const isNoBranches = joinableBranches?.length === 0

    return (
        <div className="py-5">
            <>
                {isPendingOrganization ? (
                    <div className="w-full">
                        <div className="flex min-h-44 flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5 shadow-md dark:bg-secondary/20">
                            {' '}
                            <div className="flex w-full gap-x-4">
                                <Skeleton className="size-16 rounded-full" />
                                <div className="grow">
                                    <Skeleton className="mb-2 h-8 w-3/4 rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-2/3 rounded-md" />
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-1/2 rounded-md" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <GradientBackground className="w-full" mediaUrl={mediaUrl}>
                        <div className="flex min-h-44 cursor-pointer flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5 hover:bg-secondary/50 hover:no-underline">
                            <div className="flex w-full gap-x-4">
                                <SafeImage className="size-16" src={mediaUrl} />
                                <div className="grow">
                                    <p className="touch-pan-up text-start text-2xl font-bold">
                                        {organization?.name}
                                    </p>
                                    <PlainTextEditor
                                        className="overflow max-h-10 min-w-96 max-w-[30rem] overflow-y-hidden"
                                        content={organization?.description}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <PushPinIcon className="text-red-400" />
                                <p className="text-xs">
                                    {organization?.address}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <PhoneIcon className="text-blue-400" />
                                <p className="text-xs">
                                    {organization?.contact_number}
                                </p>
                            </div>
                        </div>
                    </GradientBackground>
                )}
                {isPendingBranches && (
                    <div className="grid grid-cols-1 gap-2">
                        {Array.from({
                            length: 1,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="flex min-h-10 w-full rounded-2xl border-0 p-5"
                            >
                                <Skeleton className="size-16 rounded-full" />

                                <div className="ml-2 flex grow flex-col">
                                    <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-md" />

                                    <div className="mb-1 mt-2 flex items-center gap-y-1">
                                        <Skeleton className="mr-2 size-4 rounded-full" />
                                        <Skeleton className="h-4 w-2/3 rounded-md" />
                                    </div>

                                    <div className="flex items-center gap-y-1">
                                        <Skeleton className="mr-2 size-4 rounded-full" />
                                        <Skeleton className="h-4 w-1/2 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {isSuccessFetchingBranch && (
                    <>
                        {isNoBranches ? (
                            <div className="flex h-44 w-full items-center justify-center">
                                <p className="text-sm font-thin">
                                    No branches to show
                                </p>{' '}
                                🍃
                            </div>
                        ) : (
                            <div className="py-2">
                                <p className="flex items-center gap-x-1 py-2">
                                    <BranchIcon className="mr-2" />
                                    List of Branches
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {joinableBranches?.map(
                                        ({ branch, isUserCanJoin }) => {
                                            return (
                                                <div key={branch.id}>
                                                    <Branch
                                                        branch={branch}
                                                        isUserCanJoin={
                                                            isUserCanJoin
                                                        }
                                                        organizationId={
                                                            organization_id
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </>
            <div className="mt-5 w-full flex justify-center items-center">
                <div>
                    <p className="w-fit flex flex-row text-sm text-muted-foreground">
                        <span className="mr-1">
                            &copy; {new Date().getFullYear()}
                        </span>
                        <span className="font-semibold">
                            {organization?.name}
                        </span>
                        <span className="mr-1">. All rights reserved.</span>

                        <div className="flex w-fit">
                            {initialTermsState.map((term) => (
                                <PolicyViewer
                                    key={term.value}
                                    policyType={term.value as PolicyKey}
                                    policyName={term.name}
                                    policyContent={term.content}
                                />
                            ))}
                        </div>
                    </p>
                </div>
            </div>
        </div>
    )
}

type PolicyKey =
    | 'terms_and_conditions'
    | 'privacy_policy'
    | 'refund_policy'
    | 'user_agreement'

const PolicyViewer = ({
    policyType,
    policyName,
    policyContent,
}: {
    policyType: PolicyKey
    policyName: string
    policyContent: string
}) => {
    return (
        <Popover key={policyType}>
            <div className="flex items-center gap-x-2">
                <PopoverTrigger className=" mr-1 text-primary/70 hover:underline">
                    {policyName} {policyType !== 'user_agreement' ? ' | ' : ''}
                </PopoverTrigger>
            </div>
            <PopoverContent className="h-full w-full p-4">
                <span className="font-semibold text-primary mb-2 block">
                    {policyName}
                </span>
                <ScrollArea className=" text-sm overflow-y-auto pr-2">
                    <div className="p-1">
                        {policyContent ? (
                            <PlainTextEditor content={policyContent} />
                        ) : (
                            <p>No content available for {policyName}.</p>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
