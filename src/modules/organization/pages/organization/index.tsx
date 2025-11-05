import { useEffect, useMemo, useState } from 'react'

import { useSearch } from '@tanstack/react-router'
import Fuse from 'fuse.js'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { organizationFuseOptions } from '@/modules/explore/utils/data-grouping'
import { IOrganization, useGetAllOrganizations } from '@/modules/organization'
import { OrganizationItemSkeleton } from '@/modules/organization'

import RefreshButton from '@/components/buttons/refresh-button'
import {
    QrCodeIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'

import useDebounce from '@/hooks/use-debounce'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { OrganizationMiniCard } from '../../components/cards/organization-mini-card'
import OrganizationPreviewModal from '../../components/organization-modal'
import JoinBranchWithCodeFormModal from '../../organization-forms/join-organization-form'

type TJoinOrgSearchProps = {
    setSearchTerm: (term: string) => void
    setOpenJoinWithCodeModal: (value: boolean) => void
    refetch: () => void
}

const JoinOrgSearch = ({
    setSearchTerm,
    setOpenJoinWithCodeModal,
    refetch,
}: TJoinOrgSearchProps) => {
    const [inputSearch, setInputSearch] = useState('')

    const debouseSearchTerm = useDebounce(inputSearch, 400)

    useEffect(() => {
        setSearchTerm(debouseSearchTerm)
    }, [debouseSearchTerm, setSearchTerm])

    return (
        <div className="flex mt-10 w-full justify-between items-center mx-auto pb-2">
            <div className="inline-flex space-x-2">
                <div className="relative max-w-md min-w-[16rem]">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10 border-primary"
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder="Search organizations..."
                        value={inputSearch}
                    />
                </div>
                <div className="w-full flex justify-start">
                    <RefreshButton onClick={refetch} />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    onClick={() => setOpenJoinWithCodeModal(true)}
                    size="sm"
                    variant="outline"
                >
                    <QrCodeIcon className="mr-2 h-4 w-4" />
                    Join with Code
                </Button>
            </div>
        </div>
    )
}

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

    if (isError) {
        return (
            <div className="w-full py-2">
                <FormErrorMessage
                    errorMessage={'Something went wrong! Failed to load data.'}
                />
            </div>
        )
    }
    const handleOpenModalPreview = (org: IOrganization) => {
        setSelectedOrganization(org)
        orgModalState.onOpenChange(true)
    }

    return (
        <div className="w-full min-w-xl">
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
            <div className="container mx-auto py-3">
                {isLoading && (
                    <OrganizationItemSkeleton
                        count={8}
                        itemClassName="min-w-[17rem]"
                        mainClassName="grid !grid-cols-4 "
                    />
                )}
                {isNoOrganization || !Organizations ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-2">
                                No Organizations Found
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Be the first to create an organization or join
                                with a code
                            </p>
                            <Button
                                onClick={() => setOpenJoinWithCodeModal(true)}
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
                                <OrganizationMiniCard
                                    handleOpenOrgPreview={
                                        handleOpenModalPreview
                                    }
                                    key={org.id}
                                    onCardClick={handleOpenModalPreview}
                                    organization={org}
                                    searchTerm={searchTerm}
                                    showActions={false}
                                />
                            )
                        })}
                    </div>
                )}
                <div className="flex w-full animate-pulse justify-center text-xs opacity-30 mt-8">
                    {isFetching ? 'Loading data...' : null}
                </div>
            </div>
        </div>
    )
}

export default Organization
