import { useMemo, useState } from 'react'

import { IBranch } from '@/modules/branch'
import { BranchCard } from '@/modules/branch/components/branch-card'
import BranchModalDisplay from '@/modules/branch/components/modal/branch-modal-display'
import LoadingSkeleton from '@/modules/explore/components/loading-skeleton'
import { IOrganization } from '@/modules/organization'
import { OrganizationMiniCard } from '@/modules/organization/components/organization-mini-card'
import OrganizationModal from '@/modules/organization/components/organization-modal'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import {
    CompassIcon,
    PinLocationIcon as LocationIcon,
} from '@/components/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AuthGuard from '@/components/wrappers/auth-guard'

import { useModalState } from '@/hooks/use-modal-state'

import EmptyState from '../components/empty-state'
import ExploreHeader from '../components/explore-header'
import FiltersToolbar from '../components/filters-toolbar'
import MapView from '../components/map-view'
import ScrollableSection from '../components/scrollable-section'
import { ExploreView } from '../explore.type'
import useExploreData from '../hooks/use-explore-data'
import useExploreFilters from '../hooks/use-explore-filters'
import {
    getCategories,
    getLocations,
    groupBranches,
    groupOrganizations,
} from '../utils/data-grouping'

const ExplorePage = () => {
    const orgModal = useModalState()
    const branchModal = useModalState()
    const [selectedOrganization, setSelectedOrganization] =
        useState<IOrganization | null>(null)
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)
    const { organizations, branches, isLoading, hasError } = useExploreData()

    const {
        activeView,
        searchTerm,
        selectedCategory,
        selectedLocation,
        sortBy,
        setActiveView,
        setSearchTerm,
        setSelectedCategory,
        setSelectedLocation,
        setSortBy,
        filteredOrganizations,
        filteredBranches,
    } = useExploreFilters(organizations, branches)

    const categories = useMemo(
        () => getCategories(organizations),
        [organizations]
    )
    const locations = useMemo(() => getLocations(branches), [branches])

    const groupedOrganizations = useMemo(
        () => groupOrganizations(filteredOrganizations),
        [filteredOrganizations]
    )
    const groupedBranches = useMemo(
        () => groupBranches(filteredBranches),
        [filteredBranches]
    )

    if (hasError) {
        return (
            <AuthGuard>
                <div className="container mx-auto px-4 py-8">
                    <p className="text-muted-foreground">
                        Failed to load explore data. Please try again.
                    </p>
                </div>
            </AuthGuard>
        )
    }
    console.log('rerendering explore page')
    return (
        <AuthGuard>
            <OrganizationModal
                {...orgModal}
                organization={selectedOrganization}
                showActions={false}
            />
            <BranchModalDisplay
                {...branchModal}
                branch={selectedBranch}
                isLoading={false}
                showActions={false}
            />
            <div className="min-h-screen px-12 max-auto max-w-full">
                <FlickeringGrid
                    className="fixed"
                    flickerChance={0.05}
                    gridGap={1}
                    maxOpacity={0.9}
                    squareSize={64}
                />
                <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100% dark:block hidden" />
                <ExploreHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <div className="sticky w-full top-0 border-b">
                    <Tabs
                        className="w-full"
                        onValueChange={(value) =>
                            setActiveView(value as ExploreView)
                        }
                        value={activeView}
                    >
                        <div className="flex items-center justify-between py-4">
                            <TabsList className="grid w-fit grid-cols-2">
                                <TabsTrigger
                                    className="flex items-center cursor-pointer gap-2"
                                    value="organizations"
                                >
                                    <CompassIcon className="h-4 w-4" />
                                    Organizations
                                </TabsTrigger>
                                <TabsTrigger
                                    className="flex items-center cursor-pointer gap-2"
                                    value="branches"
                                >
                                    <LocationIcon className="h-4 w-4" />
                                    Branches
                                </TabsTrigger>
                            </TabsList>
                            <FiltersToolbar
                                activeView={activeView}
                                categories={categories}
                                locations={locations}
                                selectedCategory={selectedCategory}
                                selectedLocation={selectedLocation}
                                setActiveView={setActiveView}
                                setSelectedCategory={setSelectedCategory}
                                setSelectedLocation={setSelectedLocation}
                                setSortBy={setSortBy}
                                sortBy={sortBy}
                            />
                        </div>
                        <div className="pb-8">
                            <TabsContent className="mt-0" value="organizations">
                                {isLoading ? (
                                    <LoadingSkeleton />
                                ) : filteredOrganizations.length === 0 ? (
                                    <EmptyState
                                        icon={
                                            <CompassIcon className="h-16 w-16 text-muted-foreground" />
                                        }
                                        type="Organizations"
                                    />
                                ) : (
                                    <div className="space-y-8">
                                        {groupedOrganizations.map(
                                            (group: any, sectionIndex) => (
                                                <ScrollableSection
                                                    group={group}
                                                    key={
                                                        group.title ||
                                                        sectionIndex
                                                    }
                                                    renderItem={(item: any) => (
                                                        <OrganizationMiniCard
                                                            className="max-h-96 min-h-96"
                                                            onCardClick={() => {
                                                                setSelectedOrganization(
                                                                    item
                                                                )
                                                                orgModal.onOpenChange(
                                                                    true
                                                                )
                                                            }}
                                                            organization={item}
                                                            showActions={false}
                                                            showContact={false}
                                                        />
                                                    )}
                                                    sectionIndex={sectionIndex}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent className="mt-0" value="branches">
                                {isLoading ? (
                                    <LoadingSkeleton />
                                ) : filteredBranches.length === 0 ? (
                                    <EmptyState
                                        icon={
                                            <LocationIcon className="h-16 w-16 text-muted-foreground" />
                                        }
                                        type="Branches"
                                    />
                                ) : (
                                    <div className="space-y-8">
                                        {groupedBranches.map(
                                            (group: any, sectionIndex) => (
                                                <ScrollableSection
                                                    group={group}
                                                    key={
                                                        group.title ||
                                                        sectionIndex
                                                    }
                                                    renderItem={(
                                                        item: IBranch
                                                    ) => (
                                                        <BranchCard
                                                            branch={item}
                                                            isSeeding={false}
                                                            onClick={(
                                                                branch
                                                            ) => {
                                                                setSelectedBranch(
                                                                    branch
                                                                )
                                                                branchModal.onOpenChange(
                                                                    true
                                                                )
                                                            }}
                                                            organizationId={
                                                                item.organization_id
                                                            }
                                                            showActions={false}
                                                            variant="compact"
                                                        />
                                                    )}
                                                    sectionIndex={sectionIndex}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent className="mt-0" value="map">
                                <MapView />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ExplorePage
