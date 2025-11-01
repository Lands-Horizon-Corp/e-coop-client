import { useParams } from '@tanstack/react-router'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { Branch } from '@/modules/branch'
import {
    IOrganizationWithPolicies,
    useGetOrganizationWithPoliciesById,
} from '@/modules/organization'
import { useCanJoinMember } from '@/modules/user-organization'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { BranchIcon, PhoneIcon, PushPinIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import OrganizationPolicies from '@/components/policies'
import { Skeleton } from '@/components/ui/skeleton'
import { PlainTextEditor } from '@/components/ui/text-editor'

const OrganizationDetails = () => {
    const { organization_id: organizationId } = useParams({
        from: '/onboarding/organization/$organization_id',
    })

    const { data: organization, isPending: isPendingOrganization } =
        useGetOrganizationWithPoliciesById({
            organizationId: organizationId,
            options: { enabled: !!organizationId },
        })

    return (
        <div className="py-5">
            <OrganizationHeader
                isPending={isPendingOrganization}
                organization={organization}
            />
            <BranchesSection organizationId={organizationId} />
            {organization && (
                <OrganizationPolicies organization={organization} />
            )}
        </div>
    )
}

type OrganizationHeaderProps = {
    organization?: IOrganizationWithPolicies
    isPending: boolean
}

const OrganizationHeader = ({
    organization,
    isPending,
}: OrganizationHeaderProps) => {
    if (isPending) {
        return (
            <div className="w-full">
                <div className="flex min-h-44 flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5 shadow-md dark:bg-secondary/20">
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
        )
    }

    const fallBackImage = orgBannerList[0]
    const mediaUrl = organization?.media?.download_url ?? fallBackImage

    return (
        <GradientBackground className="w-full" mediaUrl={mediaUrl}>
            <div className="flex min-h-44 cursor-pointer flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5 hover:bg-secondary/50 hover:no-underline">
                <div className="flex w-full gap-x-4">
                    <ImageDisplay
                        className="size-16 !rounded-2xl"
                        src={mediaUrl}
                    />
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
                    <PushPinIcon className="text-destructive" />
                    <p className="text-xs">{organization?.address}</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <PhoneIcon className="text-blue-400" />
                    <p className="text-xs">{organization?.contact_number}</p>
                </div>
            </div>
        </GradientBackground>
    )
}

type BranchesSectionProps = {
    organizationId: string
}

function BranchesSection({ organizationId }: BranchesSectionProps) {
    const {
        data: joinableBranches,
        isPending: isPendingBranches,
        isSuccess: isSuccessFetchingBranch,
    } = useCanJoinMember({
        organizationId,
        options: { enabled: !!organizationId },
    })

    if (isPendingBranches) {
        return (
            <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 1 }).map((_, index) => (
                    <div
                        className="flex min-h-10 w-full rounded-2xl border-0 p-5"
                        key={index}
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
        )
    }

    const isNoBranches = joinableBranches?.length === 0

    if (isSuccessFetchingBranch && isNoBranches) {
        return (
            <div className="flex h-44 w-full items-center justify-center">
                <p className="text-sm font-thin">No branches to show</p> 🍃
            </div>
        )
    }

    if (isSuccessFetchingBranch && joinableBranches) {
        return (
            <div className="py-2">
                <p className="flex items-center gap-x-1 py-2">
                    <BranchIcon className="mr-2" />
                    List of Branches
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {joinableBranches.map(({ branch, isUserCanJoin }) => (
                        <div key={branch.id}>
                            <Branch
                                branch={branch}
                                isUserCanJoin={isUserCanJoin}
                                organization={
                                    branch.organization as IOrganizationWithPolicies
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return null
}
export default OrganizationDetails
