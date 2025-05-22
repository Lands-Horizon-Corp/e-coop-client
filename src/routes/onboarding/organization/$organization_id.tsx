import { createFileRoute } from '@tanstack/react-router'
import { useGetOrganizationById } from '@/hooks/api-hooks/use-organization'
import { useCanJoinMember } from '@/hooks/api-hooks/use-user-organization'
import Branch from './-branch'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import { BranchIcon, PhoneIcon, PushPinIcon } from '@/components/icons'
import { orgBannerList } from '@/assets/pre-organization-banner-background'
import SafeImage from '@/components/safe-image'

export const Route = createFileRoute(
    '/onboarding/organization/$organization_id'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { organization_id } = Route.useParams()

    const { data: organizationData } = useGetOrganizationById(organization_id)

    const { data: joinableBranches } = useCanJoinMember(organization_id)

    const fallBackImage = orgBannerList[0]

    const mediaUrl = organizationData?.media?.url ?? fallBackImage

    const isNoBranches = joinableBranches?.length === 0

    return (
        <div className="py-5">
            <GradientBackground className="w-full" mediaUrl={mediaUrl}>
                <div className="flex min-h-44 cursor-pointer flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5 hover:bg-secondary/50 hover:no-underline">
                    <div className="flex w-full gap-x-4">
                        <SafeImage className="size-16" src={mediaUrl} />
                        <div className="grow">
                            <p className="touch-pan-up text-start text-2xl font-bold">
                                {organizationData?.name}
                            </p>
                            <p className="text-start text-sm text-white/80">
                                <PlainTextEditor
                                    className="overflow max-h-10 min-w-96 max-w-[30rem] overflow-y-hidden"
                                    content={organizationData?.description}
                                />
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <PushPinIcon className="text-red-400" />
                        <p className="text-xs">{organizationData?.address}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <PhoneIcon className="text-blue-400" />
                        <p className="text-xs">
                            {organizationData?.contact_number}
                        </p>
                    </div>
                </div>
            </GradientBackground>
            <div className="py-2">
                <p className="flex items-center gap-x-1 py-2">
                    <BranchIcon className="mr-2" />
                    List of Branches
                </p>
                <div className="grid grid-cols-1 gap-2">
                    {joinableBranches?.map(({ branch, isUserCanJoin }) => {
                        return (
                            <Branch
                                branch={branch}
                                isUserCanJoin={isUserCanJoin}
                                organizationId={organization_id}
                            />
                        )
                    })}
                    {isNoBranches && (
                        <div className="flex h-44 w-full items-center justify-center">
                            <p className="text-sm font-thin">
                                No branches to show
                            </p>{' '}
                            🍃
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
