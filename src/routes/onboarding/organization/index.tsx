import { useState } from 'react'
import z from 'zod'

import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute, useSearch } from '@tanstack/react-router'

import OrganizationItemSkeleton from '@/components/Skeleton/organization-item-skeleton'
import JoinBranchWithCodeFormModal from '@/components/forms/onboarding-forms/join-organization-form'
import { QrCodeIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useOrganizations } from '@/hooks/api-hooks/use-organization'
import { useSubscribe } from '@/hooks/use-pubsub'

import OrganizationItem from '../-components/-organization-list/organization-item'

const paramSchema = z.object({
    invitation_code: z.string().optional(),
})

export const Route = createFileRoute('/onboarding/organization/')({
    component: RouteComponent,
    validateSearch: (search) => paramSchema.parse(search),
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()
    const { invitation_code } = useSearch({ from: '/onboarding/organization/' })

    const {
        data: Organizations,
        isPending,
        isError,
        isFetching,
        refetch,
    } = useOrganizations()

    useSubscribe(`user_organization.create.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.update.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.delete.user.${user.id}`, () => refetch())

    const [onOpenJoinWithCodeModal, setOpenJoinWithCodeModal] =
        useState(!!invitation_code)

    const isNoOrganization = Organizations?.length === 0

    if (isError) {
        return (
            <div className="w-full py-2">
                <FormErrorMessage
                    errorMessage={'Something went wrong! Failed to load data.'}
                />
            </div>
        )
    }

    return (
        <div className="w-full py-2">
            <JoinBranchWithCodeFormModal
                defaultCode={invitation_code}
                open={onOpenJoinWithCodeModal}
                onOpenChange={setOpenJoinWithCodeModal}
                title="Enter Code to Join a Branch"
                titleClassName="text-lg font-semibold"
            />
            <div className="flex">
                <div className="my-2 grow">
                    <h1 className="text-2xl font-bold text-muted-foreground"></h1>
                    List of organizations you can join, along with their
                    branches.
                </div>
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => setOpenJoinWithCodeModal(true)}
                >
                    Join with Code
                    <QrCodeIcon className="ml-2" />
                </Button>
            </div>
            <div className="w-full py-2">
                {isPending ? (
                    <div className="w-full py-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <OrganizationItemSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <>
                        {isNoOrganization || !Organizations ? (
                            <div className="col-span-1 h-full">
                                <h2 className="text-center text-lg font-semibold">
                                    No Organizations Found
                                </h2>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2 py-2">
                                {Organizations.map((organization) => (
                                    <OrganizationItem
                                        key={organization.id}
                                        organization={organization}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
                <div className="flex w-full animate-pulse justify-center text-xs opacity-30">
                    {isFetching ? 'Fetching data...' : null}
                </div>
            </div>
        </div>
    )
}
