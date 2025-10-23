import React, { memo } from 'react'

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

// Generate cache key based on data characteristics
const generateOrgCacheKey = (organizations: IOrganization[]): string => {
    return `${organizations.length}-${organizations.map((org) => `${org.id}-${org.updated_at || org.created_at}`).join(',')}`
}

const generateBranchCacheKey = (branches: IBranch[]): string => {
    return `${branches.length}-${branches.map((branch) => `${branch.id}-${branch.updated_at || branch.created_at}`).join(',')}`
}

export const groupOrganizations = (organizations: IOrganization[]) => {
    // Early return for empty data
    if (!organizations || organizations.length === 0) {
        return []
    }

    // Check cache first
    const cacheKey = generateOrgCacheKey(organizations)
    if (organizationGroupsCache.has(cacheKey)) {
        return organizationGroupsCache.get(cacheKey)!
    }

    const groups = []

    // Featured organizations (with subscription plans)
    const featured = organizations.filter((org) => org.subscription_plan)
    if (featured.length > 0) {
        groups.push({
            title: 'Featured Organizations',
            items: featured.slice(0, 8),
            icon: React.createElement(StarIconComponent),
        })
    }

    // Recent organizations (all organizations, limited to 8)
    if (organizations.length > 0) {
        groups.push({
            title: 'Recently Added',
            items: organizations.slice(0, 8),
            icon: React.createElement(TrendingIconComponent),
        })
    }

    // Group by categories - optimized approach
    const categoryMap = new Map<string, IOrganization[]>()

    for (const org of organizations) {
        if (org.organization_categories?.length) {
            // Use for...of instead of forEach for better performance
            for (const cat of org.organization_categories) {
                const categoryName = cat.category?.name || 'Other'

                // Use Map.get() and Map.set() efficiently
                const existingOrgs = categoryMap.get(categoryName)
                if (existingOrgs) {
                    existingOrgs.push(org)
                } else {
                    categoryMap.set(categoryName, [org])
                }
            }
        } else {
            // Organizations without categories
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
                title: `${category} Organizations`,
                items: orgs.slice(0, 6),
                icon: React.createElement(CompassIconComponent),
            })
        }
    }

    // Cache the result
    organizationGroupsCache.set(cacheKey, groups)

    // Clean cache if it gets too large (prevent memory leaks)
    if (organizationGroupsCache.size > 50) {
        const firstKey = organizationGroupsCache.keys().next().value
        if (firstKey) {
            organizationGroupsCache.delete(firstKey)
        }
    }

    return groups
}

export const groupBranches = (branches: IBranch[]) => {
    // Early return for empty data
    if (!branches || branches.length === 0) {
        return []
    }

    // Check cache first
    const cacheKey = generateBranchCacheKey(branches)
    if (branchGroupsCache.has(cacheKey)) {
        return branchGroupsCache.get(cacheKey)!
    }

    const groups = []

    // Main branches
    const mainBranches = branches.filter((branch) => branch.is_main_branch)
    if (mainBranches.length > 0) {
        groups.push({
            title: 'Main Branches',
            items: mainBranches.slice(0, 8),
            icon: React.createElement(StarIconComponent),
        })
    }

    // Recent branches
    if (branches.length > 0) {
        groups.push({
            title: 'Recently Added Branches',
            items: branches.slice(0, 8),
            icon: React.createElement(TrendingIconComponent),
        })
    }

    // Group by province - optimized approach
    const locationMap = new Map<string, IBranch[]>()

    for (const branch of branches) {
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
                title: `${province} Branches`,
                items: branchList.slice(0, 6),
                icon: React.createElement(LocationIconComponent),
            })
        }
    }

    // Cache the result
    branchGroupsCache.set(cacheKey, groups)

    // Clean cache if it gets too large (prevent memory leaks)
    if (branchGroupsCache.size > 50) {
        const firstKey = branchGroupsCache.keys().next().value
        if (firstKey) {
            branchGroupsCache.delete(firstKey)
        }
    }

    return groups
}

/**
 * Extract unique categories from organizations - optimized
 */
export const getCategories = (organizations: IOrganization[]): string[] => {
    if (!organizations || organizations.length === 0) {
        return []
    }

    const categories = new Set<string>()

    // Use for...of for better performance
    for (const org of organizations) {
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

/**
 * Extract unique locations from branches - optimized
 */
export const getLocations = (branches: IBranch[]): string[] => {
    if (!branches || branches.length === 0) {
        return []
    }

    const locations = new Set<string>()

    // Use for...of for better performance
    for (const branch of branches) {
        if (branch.city) {
            locations.add(branch.city)
        }
        if (branch.province) {
            locations.add(branch.province)
        }
    }

    return Array.from(locations).sort()
}

// Utility function to clear caches (useful for testing or memory management)
export const clearGroupingCaches = () => {
    organizationGroupsCache.clear()
    branchGroupsCache.clear()
}

// Export cache size for monitoring
export const getCacheInfo = () => ({
    organizationCacheSize: organizationGroupsCache.size,
    branchCacheSize: branchGroupsCache.size,
})
