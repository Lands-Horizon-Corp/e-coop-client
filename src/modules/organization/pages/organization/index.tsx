import { useMemo, useState } from 'react'

import { useSearch } from '@tanstack/react-router'
import Fuse from 'fuse.js'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { organizationFuseOptions } from '@/modules/explore/utils/data-grouping'
import { IOrganization, useGetAllOrganizations } from '@/modules/organization'
import { OrganizationItemSkeleton } from '@/modules/organization'
import ErrorPage from '@/routes/-common-pages/error-page'
import { useHotkeys } from 'react-hotkeys-hook'

import { QrCodeIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import OrganizationPreviewModal from '../../components/modal/organization-preview-modal'
import JoinBranchWithCodeFormModal from '../../organization-forms/join-organization-form'
import { JoinOrgSearch } from './components/join-org-search'
import OrganizationCardWithToolTip from './components/organization-card-with-tool-tip'

type filterSearchOrganizationProp = {
    organizations?: IOrganization[]
    searchTerm: string
}

const useFilterSearchOrganization = ({
    organizations,
    searchTerm,
}: filterSearchOrganizationProp) => {
    const workingOrganizations = useMemo(
        () => organizations ?? [],
        [organizations]
    )

    const fuse = useMemo(() => {
        return new Fuse<IOrganization>(
            workingOrganizations,
            organizationFuseOptions
        )
    }, [workingOrganizations])

    const filteredOrganizations = useMemo(() => {
        if (!searchTerm?.trim()) {
            return workingOrganizations
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, workingOrganizations])

    return {
        organizations: filteredOrganizations,
    }
}

const Organization = () => {
    const {
        currentAuth: { user },
    } = useAuthUser()
    const { invitation_code } = useSearch({ from: '/onboarding/organization/' })

    const {
        data: Organizations,
        isError,
        isFetching,
        isLoading,
        refetch,
        error,
    } = useGetAllOrganizations()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrganization, setSelectedOrganization] =
        useState<IOrganization>()
    const orgModalState = useModalState()

    useSubscribe(`user_organization.create.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.update.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.delete.user.${user.id}`, () => refetch())

    const [onOpenJoinWithCodeModal, setOpenJoinWithCodeModal] =
        useState(!!invitation_code)

    const isNoOrganization = Organizations?.length === 0

    const { organizations } = useFilterSearchOrganization({
        organizations: Organizations,
        searchTerm,
    })
    const handleOpenModalPreview = (org: IOrganization) => {
        setSelectedOrganization(org)
        orgModalState.onOpenChange(true)
    }

    useHotkeys(
        'enter',
        (e) => {
            e.preventDefault()
            const searchInput = document.querySelector(
                'input[placeholder*="Search"]'
            ) as HTMLInputElement
            if (searchInput) {
                searchInput.focus()
            }
        },
        {
            keydown: true,
            keyup: true,
        }
    )

    if (isError) {
        return (
            <div className="w-full py-2">
                <ErrorPage error={error as Error} reset={() => {}} />
            </div>
        )
    }

    return (
        <div className="w-full min-w-6xl py-5 ">
            <OrganizationPreviewModal
                organization={selectedOrganization}
                showActions={false}
                showJoinBranch
                {...orgModalState}
            />
            <JoinBranchWithCodeFormModal
                defaultCode={invitation_code}
                onOpenChange={setOpenJoinWithCodeModal}
                open={onOpenJoinWithCodeModal}
                title="Enter Code to Join a Branch"
                titleClassName="text-lg font-semibold"
            />
            {/* Header */}
            <JoinOrgSearch
                refetch={refetch}
                setOpenJoinWithCodeModal={setOpenJoinWithCodeModal}
                setSearchTerm={setSearchTerm}
            />
            {/* Content */}
            <div className="container mx-auto py-3 min-w-fit">
                {isLoading || isFetching ? (
                    <>
                        <OrganizationItemSkeleton
                            count={16}
                            customSkeleton={
                                <div className="flex flex-col gap-y-2 h-[200px] w-[250px]">
                                    <Skeleton className="flex-5" />
                                    <Skeleton className="flex-1" />
                                </div>
                            }
                            itemClassName="min-w-[17rem]"
                            mainClassName="grid !grid-cols-4"
                        />
                    </>
                ) : (
                    <>
                        {isNoOrganization || !Organizations ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold mb-2">
                                        No Organizations Found
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        Be the first to create an organization
                                        or join with a code
                                    </p>
                                    <Button
                                        onClick={() =>
                                            setOpenJoinWithCodeModal(true)
                                        }
                                    >
                                        <QrCodeIcon className="mr-2 h-4 w-4" />
                                        Join with Code
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {organizations?.map((org) => {
                                    return (
                                        <OrganizationCardWithToolTip
                                            handleOpenModalPreview={
                                                handleOpenModalPreview
                                            }
                                            key={org.id}
                                            organization={org}
                                            searchTerm={searchTerm}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
                <div className="flex w-full animate-pulse justify-center text-xs opacity-30 mt-8">
                    {isFetching ? 'Loading data...' : null}
                </div>
            </div>
        </div>
    )
}

export default Organization
