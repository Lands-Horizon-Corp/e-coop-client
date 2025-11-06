import { createFileRoute } from '@tanstack/react-router'

import LOADING_ARTWORK_GIF from '@/assets/gifs/e-coop-artwork-loading.gif'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { useGetUserOrganizationByUserId } from '@/modules/user-organization/user-organization.service'

import { LandmarkIcon } from '@/components/icons'
import ImageMatch from '@/components/image-match'
import { GradientText } from '@/components/ui/gradient-text'

import { useSubscribe } from '@/hooks/use-pubsub'

import ErrorPage from '../-common-pages/error-page'
import NoOrganizationView from '../../modules/organization/components/no-organization-view'
import WithOrganization from '../../modules/organization/components/with-organization'

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
        error,
    } = useGetUserOrganizationByUserId({ userId: user.id })

    useSubscribe(`user_organization.create.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.update.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.delete.user.${user.id}`, () => refetch())

    const hasOrganization: boolean = userOrganizationsData
        ? userOrganizationsData.length > 0
        : false

    if (isError) {
        return (
            <ErrorPage
                className="w-full"
                error={
                    error instanceof Error
                        ? error
                        : new Error(error ? String(error) : 'Unknown error')
                }
                reset={refetch}
            />
        )
    }

    if (isPending || isLoading || isFetching) {
        return (
            <div className="flex min-h-full  h-[80vh] w-full flex-col items-center justify-center gap-y-2">
                <ImageMatch
                    alt={'loading-gif'}
                    className="block size-52 rounded-none !bg-transparent"
                    src={LOADING_ARTWORK_GIF}
                />

                <p className="animate-pulse text-xs "> Getting ready...</p>
            </div>
        )
    }
    return (
        <div className=" flex min-h-full w-full min-w-5xl flex-col items-center gap-y-2">
            <h1 className="relative mr-2 flex w-full items-center justify-center space-x-2 font-inter text-3xl font-semibold">
                <span className="relative mr-5 before:absolute before:left-1/2 before:top-[50%] before:-z-10 before:size-[30px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:opacity-50 before:blur-lg before:content-['']">
                    <LandmarkIcon className="z-50" size={24} />
                </span>
                Welcome to
                <GradientText
                    animate="shimmer"
                    className="leading-relaxed mx-2 "
                    size="4xl"
                    style={{
                        fontFamily: "'Knewave', cursive",
                    }}
                    variant="primary"
                >
                    <h1>E-coop</h1>
                </GradientText>
                Onboarding
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

export const Route = createFileRoute('/onboarding/')({
    component: RouteComponent,
})
