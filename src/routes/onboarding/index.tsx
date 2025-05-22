import NoOrganizationView from './-components/no-organization-view'
import WithOrganization from './-components/with-organization'

import { LandmarkIcon } from '@/components/icons'

import { IBranch, IOrganization, TEntityId } from '@/types'
import { useGetUserOrganizationByUserId } from '@/hooks/api-hooks/use-user-organization'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
    component: RouteComponent,
})

export type UserOrganizationGroup = {
    orgnizationId: TEntityId
    userOrganizationId: TEntityId
    organizationDetails: IOrganization
    branches: IBranch[]
    isPending: 'pending' | 'reported' | 'accepted' | 'ban'
}

function RouteComponent() {
    const {
        data: userOrganizationsData = [],
        isLoading,
        error,
    } = useGetUserOrganizationByUserId()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data.</div>

    const hasOrganization: boolean =
        Object.keys(userOrganizationsData).length > 0

    return (
        <div className="mt-10 flex min-h-full w-full flex-col items-center gap-y-5">
            <h1 className="relative mr-2 flex w-full items-center justify-center space-x-2 font-inter text-3xl font-semibold">
                <span className="relative mr-5 before:absolute before:left-1/2 before:top-[50%] before:-z-10 before:size-[30px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:opacity-50 before:blur-lg before:content-['']">
                    <LandmarkIcon className="z-50" size={24} />
                </span>
                Welcome to E-Coop Onboarding
            </h1>

            {hasOrganization ? (
                <WithOrganization
                    organizationsWithBranches={userOrganizationsData}
                />
            ) : (
                <NoOrganizationView />
            )}
        </div>
    )
}

export default RouteComponent
