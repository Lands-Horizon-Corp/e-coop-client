import { useState } from 'react'

import { useSearch } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { IOrganization, useGetAllOrganizations } from '@/modules/organization'
import {
    OrganizationItem,
    OrganizationItemSkeleton,
} from '@/modules/organization'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    GridIcon,
    ListOrderedIcon as ListIcon,
    QrCodeIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { useSubscribe } from '@/hooks/use-pubsub'

import JoinBranchWithCodeFormModal from '../../organization-forms/join-organization-form'

type ViewMode = 'netflix' | 'grid' | 'list'

const Organization = () => {
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
    } = useGetAllOrganizations()

    useSubscribe(`user_organization.create.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.update.user.${user.id}`, () => refetch())
    useSubscribe(`user_organization.delete.user.${user.id}`, () => refetch())

    const [onOpenJoinWithCodeModal, setOpenJoinWithCodeModal] =
        useState(!!invitation_code)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('netflix')

    const isNoOrganization = Organizations?.length === 0

    const filteredOrganizations =
        Organizations?.filter(
            (org) =>
                org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                org.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                org.organization_categories?.some((cat) =>
                    cat.category?.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
        ) || []

    // Group organizations by categories for Netflix layout
    const groupedOrganizations = () => {
        if (!filteredOrganizations.length) return []

        const groups: { title: string; organizations: IOrganization[] }[] = []

        // Featured/Recent organizations
        groups.push({
            title: 'Featured Organizations',
            organizations: filteredOrganizations.slice(0, 8),
        })

        // Group by categories
        const categoryMap = new Map<string, IOrganization[]>()

        filteredOrganizations.forEach((org) => {
            if (org.organization_categories?.length) {
                org.organization_categories.forEach((cat) => {
                    const categoryName = cat.category?.name || 'Other'
                    if (!categoryMap.has(categoryName)) {
                        categoryMap.set(categoryName, [])
                    }
                    categoryMap.get(categoryName)?.push(org)
                })
            } else {
                if (!categoryMap.has('General')) {
                    categoryMap.set('General', [])
                }
                categoryMap.get('General')?.push(org)
            }
        })

        categoryMap.forEach((orgs, category) => {
            if (orgs.length > 0) {
                groups.push({
                    title: `${category} Organizations`,
                    organizations: orgs.slice(0, 10),
                })
            }
        })

        return groups
    }

    const scroll = (direction: 'left' | 'right', containerId: string) => {
        const container = document.getElementById(containerId)
        if (container) {
            const scrollAmount = 300
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    const handleJoinOrganization = (_: IOrganization) => {
        // Implement join logic here
    }

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
        <div className="w-full ">
            <JoinBranchWithCodeFormModal
                defaultCode={invitation_code}
                onOpenChange={setOpenJoinWithCodeModal}
                open={onOpenJoinWithCodeModal}
                title="Enter Code to Join a Branch"
                titleClassName="text-lg font-semibold"
            />

            {/* Header */}
            <div className="top-0 z-40  backdrop-blur-sm border-b">
                <div className="container mx-auto pb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Organizations
                            </h1>
                            <p className="text-muted-foreground">
                                Discover and join organizations that match your
                                interests
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <ToggleGroup
                                className="border"
                                onValueChange={(value) =>
                                    value && setViewMode(value as ViewMode)
                                }
                                type="single"
                                value={viewMode}
                            >
                                <ToggleGroupItem size="sm" value="netflix">
                                    <GridIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem size="sm" value="grid">
                                    <GridIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem size="sm" value="list">
                                    <ListIcon className="h-4 w-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>

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

                    {/* Search */}
                    <div className="relative max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search organizations..."
                            value={searchTerm}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                {isPending ? (
                    <div className="space-y-8">
                        {Array.from({ length: 3 }).map((_, sectionIndex) => (
                            <div className="space-y-4" key={sectionIndex}>
                                <div className="h-6 bg-muted animate-pulse rounded w-48" />
                                <div className="flex gap-4 overflow-hidden">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <OrganizationItemSkeleton
                                                key={index}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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
                            <>
                                {viewMode === 'netflix' && (
                                    <div className="space-y-8">
                                        {groupedOrganizations().map(
                                            (group, sectionIndex) => (
                                                <div
                                                    className="space-y-4"
                                                    key={sectionIndex}
                                                >
                                                    <h2 className="text-xl font-semibold text-foreground">
                                                        {group.title}
                                                    </h2>

                                                    <div className="relative group">
                                                        {/* Left Arrow */}
                                                        <Button
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                                                            onClick={() =>
                                                                scroll(
                                                                    'left',
                                                                    `scroll-${sectionIndex}`
                                                                )
                                                            }
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            <ChevronLeftIcon className="h-6 w-6" />
                                                        </Button>

                                                        {/* Organizations Scroll Container */}
                                                        <div
                                                            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                                                            id={`scroll-${sectionIndex}`}
                                                            style={{
                                                                scrollbarWidth:
                                                                    'none',
                                                                msOverflowStyle:
                                                                    'none',
                                                            }}
                                                        >
                                                            {group.organizations.map(
                                                                (
                                                                    organization
                                                                ) => (
                                                                    <OrganizationItem
                                                                        key={
                                                                            organization.id
                                                                        }
                                                                        onJoin={
                                                                            handleJoinOrganization
                                                                        }
                                                                        organization={
                                                                            organization
                                                                        }
                                                                        variant="netflix"
                                                                    />
                                                                )
                                                            )}
                                                        </div>

                                                        {/* Right Arrow */}
                                                        <Button
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                                                            onClick={() =>
                                                                scroll(
                                                                    'right',
                                                                    `scroll-${sectionIndex}`
                                                                )
                                                            }
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            <ChevronRightIcon className="h-6 w-6" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {viewMode === 'grid' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredOrganizations.map(
                                            (organization) => (
                                                <OrganizationItem
                                                    key={organization.id}
                                                    onJoin={
                                                        handleJoinOrganization
                                                    }
                                                    organization={organization}
                                                    variant="grid"
                                                />
                                            )
                                        )}
                                    </div>
                                )}

                                {viewMode === 'list' && (
                                    <div className="space-y-4">
                                        {filteredOrganizations.map(
                                            (organization) => (
                                                <OrganizationItem
                                                    key={organization.id}
                                                    onJoin={
                                                        handleJoinOrganization
                                                    }
                                                    organization={organization}
                                                    variant="list"
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Loading Indicator */}
                <div className="flex w-full animate-pulse justify-center text-xs opacity-30 mt-8">
                    {isFetching ? 'Fetching data...' : null}
                </div>
            </div>
        </div>
    )
}

export default Organization
