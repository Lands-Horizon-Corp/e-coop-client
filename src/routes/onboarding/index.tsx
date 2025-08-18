import LOADING_ARTWORK_GIF from '@/assets/gifs/e-coop-artwork-loading.gif'
import ErrorPage from '@/routes/-common-pages/error-page'
import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import { LandmarkIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'

import { useGetUserOrganizationByUserId } from '@/hooks/api-hooks/use-user-organization'
import { useSubscribe } from '@/hooks/use-pubsub'

import NoOrganizationView from './-components/no-organization-view'
import WithOrganization from './-components/with-organization'

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

    const hasOrganization: boolean = userOrganizationsData.length > 0

    if (isError) {
        return <ErrorPage />
    }

    if (isPending || isLoading || isFetching) {
        return (
            <div className="flex min-h-full w-full flex-col items-center justify-center gap-y-2">
                <ImageDisplay
                    src={LOADING_ARTWORK_GIF}
                    className="block size-52 animate-pulse rounded-none !bg-transparent"
                    fallbackClassName="!bg-transparent rounded-none"
                />
                <p className="animate-pulse text-xs text-accent-foreground">
                    {' '}
                    Getting ready...
                </p>
            </div>
        )
    }
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
