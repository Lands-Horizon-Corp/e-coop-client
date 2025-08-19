import { useParams, useRouter } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { getOrgBranchSafeURLNames } from '@/utils'

import { IChildProps } from '@/types'

import { FlickeringGrid } from '../elements/backgrounds/flickering-grid'
import {
    ArrowLeftIcon,
    ArrowUpIcon,
    OrganizationIcon,
    ShieldExclamationIcon,
} from '../icons'
import { Button } from '../ui/button'

const OrgBranchUrlGuard = ({ children }: IChildProps) => {
    const router = useRouter()
    const { orgname, branchname } = useParams({
        strict: false,
    }) as { orgname: string; branchname: string }

    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const { orgName, branchName } = getOrgBranchSafeURLNames(
        user_organization.organization.name,
        user_organization.branch.name
    )

    const currentOrgBranchURL = `/org/${orgname}/branch/${branchname}`
    const supposedOrgBranchURL = `/org/${orgName}/branch/${branchName}`

    if (currentOrgBranchURL !== supposedOrgBranchURL)
        return (
            <div className="relative flex h-screen w-full flex-col items-center justify-center gap-y-4 text-muted-foreground">
                <ShieldExclamationIcon className="z-10 size-16" />
                <p className="z-10">
                    Sorry we detected your URL is not your Organization/Branch.
                    Please go back or switch your organization via Onboarding.
                </p>
                <div className="z-10 flex items-center gap-x-2">
                    <Button
                        variant="secondary"
                        hoverVariant="primary"
                        className="gap-x-2 rounded-full"
                        onClick={() => router.history.back()}
                    >
                        <ArrowLeftIcon />
                        Go back
                    </Button>
                    <Button
                        variant="secondary"
                        hoverVariant="primary"
                        className="gap-x-2 rounded-full"
                        onClick={() =>
                            router.navigate({
                                to: supposedOrgBranchURL as string,
                            })
                        }
                    >
                        <OrganizationIcon />
                        Go to{' '}
                        <span className="text rounded-md bg-background px-1.5 py-0.5 text-foreground dark:text-inherit">
                            {user_organization.organization.name} /{' '}
                            {user_organization.branch.name}
                        </span>
                    </Button>
                    <Button
                        variant="secondary"
                        hoverVariant="primary"
                        className="gap-x-2 rounded-full"
                        onClick={() =>
                            router.navigate({ to: '/onboarding' as string })
                        }
                    >
                        <ArrowUpIcon className="rotate-45" />
                        Go to onboarding
                    </Button>
                </div>
                <FlickeringGrid
                    gridGap={1}
                    squareSize={64}
                    color="#02BEAA"
                    maxOpacity={0.5}
                    flickerChance={0.05}
                    className="absolute inset-0 z-0 opacity-80 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
                />
            </div>
        )

    return children
}

export default OrgBranchUrlGuard
