import NoOrganizationView from './-components/no-organization-view'
import WithOrganization from './-components/with-organization'
import { LandmarkIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useAuthUser } from '@/store/user-auth-store'
import { useGetUserOrganizationByUserId } from '@/hooks/api-hooks/use-user-organization'

import { createFileRoute } from '@tanstack/react-router'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/onboarding/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()

    const {
        data: userOrganizationsData,
        isLoading,
        isPending,
        isError,
        isFetching,
        refetch,
    } = useGetUserOrganizationByUserId(user.id)

    useSubscribe(`user_organization.create.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.update.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.delete.user.${user.id}`, () => refetch())

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
            {isPending && (
                <div className="flex h-14 w-full items-center justify-center">
                    <LoadingSpinner className="animate-spin" />
                </div>
            )}
            {userOrganizationsData ? (
                hasOrganization ? (
                    <WithOrganization
                        isLoading={isLoading}
                        organizationsWithBranches={userOrganizationsData}
                    />
                ) : (
                    <NoOrganizationView />
                )
            ) : isError ? (
                <FormErrorMessage
                    errorMessage={'Something went wrong! Failed to load data.'}
                />
            ) : isLoading ? (
                <LoadingSpinner className="animate-spin" />
            ) : (
                <>
                    hello
                    <NoOrganizationView />
                </>
            )}
            <div className="text-xs opacity-30">
                {isFetching ? 'Fetching data...' : null}
            </div>
        </div>
    )
}

export default RouteComponent
