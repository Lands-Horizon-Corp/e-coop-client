import { useCallback, useMemo } from 'react'

import Fuse from 'fuse.js'

import {
    IOrganization,
    TGetAllByCategory,
    useGetAllOrganizationsByCategories,
} from '@/modules/organization'
import { OrganizationCardWithToolTip } from '@/modules/organization/pages/organization'

import RefreshButton from '@/components/buttons/refresh-button'
import { CompassIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'

import EmptyState from '../components/empty-state'
import LoadingSkeleton from '../components/loading-skeleton'
import { organizationFuseOptions } from '../utils/data-grouping'
import { ExplorePageCardPreviewController } from './explore-featured'

export const useSearchOrganizationsByCategories = (
    data: TGetAllByCategory[] | undefined,
    searchTerm?: string
) => {
    return useMemo(() => {
        if (!data || !searchTerm?.trim()) {
            return data || []
        }

        return data.map((categoryGroup) => {
            if (!categoryGroup.organizations?.length) {
                return categoryGroup
            }

            const fuse = new Fuse(
                categoryGroup.organizations,
                organizationFuseOptions
            )

            const searchResults = fuse.search(searchTerm)

            return {
                ...categoryGroup,
                organizations: searchResults.map((result) => result.item),
                _searchStats: {
                    originalCount: categoryGroup.organizations.length,
                    filteredCount: searchResults.length,
                    hasResults: searchResults.length > 0,
                },
            }
        })
    }, [data, searchTerm])
}

type ExploreByCategoriesProps = {
    searchTerm?: string
    handleSelectedOrganization?: (org: IOrganization) => void
    item: TGetAllByCategory & {
        _searchStats?: {
            originalCount: number
            filteredCount: number
            hasResults: boolean
        }
    }
    isLoading?: boolean
    refetch?: () => void
}

export const ExploreCategoriesMain = ({
    searchTerm,
    handleSelectedOrganization,
}: {
    searchTerm: string
    handleSelectedOrganization?: (org: IOrganization) => void
}) => {
    const {
        data: rawData,
        isLoading,
        refetch,
    } = useGetAllOrganizationsByCategories({
        options: {
            refetchOnWindowFocus: false,
            retry: 2,
        },
    })

    const filteredData = useSearchOrganizationsByCategories(rawData, searchTerm)

    const handleRefetch = useCallback(() => {
        refetch()
    }, [refetch])

    return filteredData?.map((item, index) => (
        <ExploreByCategories
            handleSelectedOrganization={handleSelectedOrganization}
            isLoading={isLoading}
            item={item}
            key={index}
            refetch={handleRefetch}
            searchTerm={searchTerm}
        />
    ))
}

const ExploreByCategories = ({
    searchTerm,
    handleSelectedOrganization,
    isLoading,
    refetch,
    item: { category, organizations },
}: ExploreByCategoriesProps) => {
    const workingOrganizations = useMemo(
        () => organizations ?? [],
        [organizations]
    )

    return (
        <div>
            <div className={`flex items-center gap-2 my-2 justify-between`}>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <Badge className="ml-2" variant="secondary">
                        {workingOrganizations.length}
                    </Badge>
                </div>
                <RefreshButton
                    className="bg-transparent"
                    isLoading={isLoading}
                    onClick={() => refetch?.()}
                />
            </div>
            <Carousel
                className="w-full"
                opts={{
                    align: 'start',
                }}
            >
                <CarouselContent>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : workingOrganizations.length === 0 ? (
                        <div className="w-full">
                            <EmptyState
                                icon={
                                    <CompassIcon className="h-16 w-16 text-muted-foreground" />
                                }
                                type={'Organizations'}
                            />
                        </div>
                    ) : (
                        workingOrganizations.map((item, index) => (
                            <CarouselItem
                                className="md:basis-1/2 lg:basis-1/5"
                                key={index}
                                onClick={() =>
                                    handleSelectedOrganization?.(item)
                                }
                            >
                                <OrganizationCardWithToolTip
                                    handleOpenModalPreview={(org) => {
                                        handleSelectedOrganization?.(org)
                                    }}
                                    organization={item}
                                    searchTerm={searchTerm}
                                />
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                <ExplorePageCardPreviewController />
            </Carousel>
        </div>
    )
}

export default ExploreByCategories
