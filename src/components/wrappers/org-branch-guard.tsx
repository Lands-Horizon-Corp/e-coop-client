import { useParams, useRouter } from '@tanstack/react-router'

import { getOrgBranchSafeURLNames } from '@/helpers/function-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import {
    ArrowLeftIcon,
    ArrowUpIcon,
    OrganizationIcon,
    ShieldExclamationIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

import { IChildProps } from '@/types'

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
                        className="gap-x-2 rounded-full"
                        hoverVariant="primary"
                        onClick={() => router.history.back()}
                        variant="secondary"
                    >
                        <ArrowLeftIcon />
                        Go back
                    </Button>
                    <Button
                        className="gap-x-2 rounded-full"
                        hoverVariant="primary"
                        onClick={() =>
                            router.navigate({
                                to: supposedOrgBranchURL as string,
                            })
                        }
                        variant="secondary"
                    >
                        <OrganizationIcon />
                        Go to{' '}
                        <span className="text rounded-md bg-background px-1.5 py-0.5 text-foreground dark:text-inherit">
                            {user_organization.organization.name} /{' '}
                            {user_organization.branch.name}
                        </span>
                    </Button>
                    <Button
                        className="gap-x-2 rounded-full"
                        hoverVariant="primary"
                        onClick={() =>
                            router.navigate({ to: '/onboarding' as string })
                        }
                        variant="secondary"
                    >
                        <ArrowUpIcon className="rotate-45" />
                        Go to onboarding
                    </Button>
                </div>
                <FlickeringGrid
                    flickerChance={0.05}
                    gridGap={1}
                    maxOpacity={0.5}
                    squareSize={64}
                />
            </div>
        )

    return children
}

export default OrgBranchUrlGuard
