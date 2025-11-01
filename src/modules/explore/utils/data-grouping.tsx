import React, { memo, useMemo } from 'react'

import Fuse, { IFuseOptions } from 'fuse.js'

import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'

import {
    CompassIcon,
    PinLocationIcon as LocationIcon,
    StarIcon,
    TrendingUpIcon,
} from '@/components/icons'

// Memoized icon components to prevent re-creation
const StarIconComponent = memo(() => <StarIcon className="h-4 w-4" />)
const TrendingIconComponent = memo(() => <TrendingUpIcon className="h-4 w-4" />)
const CompassIconComponent = memo(() => <CompassIcon className="h-4 w-4" />)
const LocationIconComponent = memo(() => <LocationIcon className="h-4 w-4" />)

StarIconComponent.displayName = 'StarIcon'
TrendingIconComponent.displayName = 'TrendingIcon'
CompassIconComponent.displayName = 'CompassIcon'
LocationIconComponent.displayName = 'LocationIcon'

// Cache for organization groups to avoid recalculation
const organizationGroupsCache = new Map<string, any[]>()
const branchGroupsCache = new Map<string, any[]>()

//   Fuse.js configurations
export const organizationFuseOptions: IFuseOptions<IOrganization> = {
    keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'code', weight: 0.15 },
        { name: 'email', weight: 0.1 },
        { name: 'phone', weight: 0.1 },
        { name: 'address', weight: 0.05 },
        { name: 'organization_categories.category.name', weight: 0.1 },
        { name: 'subscription_plan.name', weight: 0.05 },
        { name: 'created_by.full_name', weight: 0.05 },
        { name: 'created_by.user_name', weight: 0.05 },
    ],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    findAllMatches: true,
    minMatchCharLength: 2,
}

const branchFuseOptions: IFuseOptions<IBranch> = {
    keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'code', weight: 0.15 },
        { name: 'address', weight: 0.1 },
        { name: 'city', weight: 0.1 },
        { name: 'province', weight: 0.1 },
        { name: 'phone', weight: 0.05 },
        { name: 'email', weight: 0.05 },
        { name: 'organization.name', weight: 0.1 },
        { name: 'created_by.full_name', weight: 0.05 },
        { name: 'created_by.user_name', weight: 0.05 },
    ],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    findAllMatches: true,
    minMatchCharLength: 2,
}

// Generate cache key based on data characteristics and search term
const generateOrgCacheKey = (
    organizations: IOrganization[],
    searchTerm?: string
): string => {
    const dataKey = `${organizations.length}-${organizations.map((org) => `${org.id}-${org.updated_at || org.created_at}`).join(',')}`
    return searchTerm ? `${dataKey}-search:${searchTerm}` : dataKey
}

const generateBranchCacheKey = (
    branches: IBranch[],
    searchTerm?: string
): string => {
    const dataKey = `${branches.length}-${branches.map((branch) => `${branch.id}-${branch.updated_at || branch.created_at}`).join(',')}`
    return searchTerm ? `${dataKey}-search:${searchTerm}` : dataKey
}

//   Hook for organization search with Fuse.js
export const useOrganizationSearch = (
    organizations: IOrganization[],
    searchTerm?: string
) => {
    const fuse = useMemo(
        () =>
            new Fuse<IOrganization>(
                organizations || [],
                organizationFuseOptions
            ),
        [organizations]
    )

    const filteredOrganizations = useMemo(() => {
        if (!searchTerm?.trim() || !organizations?.length) {
            return organizations || []
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, organizations])

    return filteredOrganizations
}

//   Hook for branch search with Fuse.js
export const useBranchSearch = (branches: IBranch[], searchTerm?: string) => {
    const fuse = useMemo(
        () => new Fuse<IBranch>(branches || [], branchFuseOptions),
        [branches]
    )

    const filteredBranches = useMemo(() => {
        if (!searchTerm?.trim() || !branches?.length) {
            return branches || []
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, branches])

    return filteredBranches
}

//   Enhanced groupOrganizations with search support
export const groupOrganizations = (
    organizations: IOrganization[],
    organizationRecently?: IOrganization[],
    organizationFeatured?: IOrganization[],
    searchTerm?: string
) => {
    // Early return for empty data
    if (!organizations || organizations.length === 0) {
        return []
    }

    // Check cache first
    const cacheKey = generateOrgCacheKey(organizations, searchTerm)
    if (organizationGroupsCache.has(cacheKey)) {
        return organizationGroupsCache.get(cacheKey)!
    }

    //   Apply search filter if search term exists
    let workingData = organizations
    if (searchTerm?.trim()) {
        const fuse = new Fuse<IOrganization>(
            organizations,
            organizationFuseOptions
        )
        workingData = fuse.search(searchTerm).map((result) => result.item)
    }

    const groups = []

    // Featured organizations (with subscription plans)
    // const featured = workingData.filter((org) => org.subscription_plan)
    if (organizationFeatured && organizationFeatured.length > 0) {
        groups.push({
            title: searchTerm
                ? `Featured Organizations (${organizationFeatured.length})`
                : 'Featured Organizations',
            items: organizationFeatured,
            icon: React.createElement(StarIconComponent),
            searchTerm, //   Include search context
        })
    }

    // Recent organizations
    if (organizationRecently && organizationRecently.length > 0) {
        groups.push({
            title: searchTerm
                ? `Recently Added (${organizationRecently.length})`
                : 'Recently Added',
            items: organizationRecently,
            icon: React.createElement(TrendingIconComponent),
            searchTerm,
        })
    }

    // Group by categories - optimized approach
    const categoryMap = new Map<string, IOrganization[]>()

    for (const org of workingData) {
        if (org.organization_categories?.length) {
            for (const cat of org.organization_categories) {
                const categoryName = cat.category?.name || 'Other'

                const existingOrgs = categoryMap.get(categoryName)
                if (existingOrgs) {
                    existingOrgs.push(org)
                } else {
                    categoryMap.set(categoryName, [org])
                }
            }
        } else {
            const existingGeneral = categoryMap.get('General')
            if (existingGeneral) {
                existingGeneral.push(org)
            } else {
                categoryMap.set('General', [org])
            }
        }
    }

    // Convert Map to groups - only if there are items
    for (const [category, orgs] of categoryMap) {
        if (orgs.length > 0) {
            groups.push({
                title: searchTerm
                    ? `${category} Organizations (${orgs.length})`
                    : `${category} Organizations`,
                items: orgs.slice(0, 6),
                icon: React.createElement(CompassIconComponent),
                searchTerm,
            })
        }
    }

    // Cache the result
    organizationGroupsCache.set(cacheKey, groups)

    // Clean cache if it gets too large
    if (organizationGroupsCache.size > 100) {
        const firstKey = organizationGroupsCache.keys().next().value
        if (firstKey) {
            organizationGroupsCache.delete(firstKey)
        }
    }

    return groups
}

// Enhanced groupBranches with search support
export const groupBranches = (branches: IBranch[], searchTerm?: string) => {
    // Early return for empty data
    if (!branches || branches.length === 0) {
        return []
    }

    // Check cache first
    const cacheKey = generateBranchCacheKey(branches, searchTerm)
    if (branchGroupsCache.has(cacheKey)) {
        return branchGroupsCache.get(cacheKey)!
    }

    //   Apply search filter if search term exists
    let workingData = branches
    if (searchTerm?.trim()) {
        const fuse = new Fuse<IBranch>(branches, branchFuseOptions)
        workingData = fuse.search(searchTerm).map((result) => result.item)
    }

    const groups = []

    // Main branches
    const mainBranches = workingData.filter((branch) => branch.is_main_branch)
    if (mainBranches.length > 0) {
        groups.push({
            title: searchTerm
                ? `Main Branches (${mainBranches.length})`
                : 'Main Branches',
            items: mainBranches.slice(0, 8),
            icon: React.createElement(StarIconComponent),
            searchTerm,
        })
    }

    // Recent branches
    if (workingData.length > 0) {
        groups.push({
            title: searchTerm
                ? `Recently Added Branches (${workingData.length})`
                : 'Recently Added Branches',
            items: workingData.slice(0, 8),
            icon: React.createElement(TrendingIconComponent),
            searchTerm,
        })
    }

    // Group by province
    const locationMap = new Map<string, IBranch[]>()

    for (const branch of workingData) {
        const province = branch.province || 'Other'

        const existingBranches = locationMap.get(province)
        if (existingBranches) {
            existingBranches.push(branch)
        } else {
            locationMap.set(province, [branch])
        }
    }

    // Convert Map to groups
    for (const [province, branchList] of locationMap) {
        if (branchList.length > 0) {
            groups.push({
                title: searchTerm
                    ? `${province} Branches (${branchList.length})`
                    : `${province} Branches`,
                items: branchList.slice(0, 6),
                icon: React.createElement(LocationIconComponent),
                searchTerm,
            })
        }
    }

    // Cache the result
    branchGroupsCache.set(cacheKey, groups)

    // Clean cache if it gets too large
    if (branchGroupsCache.size > 100) {
        const firstKey = branchGroupsCache.keys().next().value
        if (firstKey) {
            branchGroupsCache.delete(firstKey)
        }
    }

    return groups
}

//   Enhanced getCategories with search support
export const getCategories = (
    organizations: IOrganization[],
    searchTerm?: string
): string[] => {
    if (!organizations || organizations.length === 0) {
        return []
    }

    // Apply search filter if needed
    let workingData = organizations
    if (searchTerm?.trim()) {
        const fuse = new Fuse<IOrganization>(
            organizations,
            organizationFuseOptions
        )
        workingData = fuse.search(searchTerm).map((result) => result.item)
    }

    const categories = new Set<string>()

    for (const org of workingData) {
        if (org.organization_categories?.length) {
            for (const cat of org.organization_categories) {
                if (cat.category?.name) {
                    categories.add(cat.category.name)
                }
            }
        }
    }

    return Array.from(categories).sort()
}

//   Enhanced getLocations with search support
export const getLocations = (
    branches: IBranch[],
    searchTerm?: string
): string[] => {
    if (!branches || branches.length === 0) {
        return []
    }

    // Apply search filter if needed
    let workingData = branches
    if (searchTerm?.trim()) {
        const fuse = new Fuse<IBranch>(branches, branchFuseOptions)
        workingData = fuse.search(searchTerm).map((result) => result.item)
    }

    const locations = new Set<string>()

    for (const branch of workingData) {
        if (branch.city) {
            locations.add(branch.city)
        }
        if (branch.province) {
            locations.add(branch.province)
        }
    }

    return Array.from(locations).sort()
}

//   Advanced search function for organizations with detailed results
export const searchOrganizationsWithDetails = (
    organizations: IOrganization[],
    searchTerm: string
) => {
    if (!searchTerm?.trim() || !organizations?.length) {
        return { results: organizations || [], searchInfo: null }
    }

    const fuse = new Fuse<IOrganization>(organizations, organizationFuseOptions)
    const searchResults = fuse.search(searchTerm)

    return {
        results: searchResults.map((result) => result.item),
        searchInfo: {
            totalResults: searchResults.length,
            searchTerm,
            averageScore:
                searchResults.length > 0
                    ? searchResults.reduce(
                          (sum, r) => sum + (r.score || 0),
                          0
                      ) / searchResults.length
                    : 0,
            bestMatch: searchResults[0] || null,
        },
    }
}

//   Advanced search function for branches with detailed results
export const searchBranchesWithDetails = (
    branches: IBranch[],
    searchTerm: string
) => {
    if (!searchTerm?.trim() || !branches?.length) {
        return { results: branches || [], searchInfo: null }
    }

    const fuse = new Fuse<IBranch>(branches, branchFuseOptions)
    const searchResults = fuse.search(searchTerm)

    return {
        results: searchResults.map((result) => result.item),
        searchInfo: {
            totalResults: searchResults.length,
            searchTerm,
            averageScore:
                searchResults.length > 0
                    ? searchResults.reduce(
                          (sum, r) => sum + (r.score || 0),
                          0
                      ) / searchResults.length
                    : 0,
            bestMatch: searchResults[0] || null,
        },
    }
}
