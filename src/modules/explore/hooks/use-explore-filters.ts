import { useMemo, useState } from 'react'

import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'

import { filterBranches, filterOrganizations } from '../utils/data-filters'
import { sortBranches, sortOrganizations } from '../utils/sorting'

export type ExploreView = 'organizations' | 'branches' | 'map'
export type SortBy = 'recent' | 'popular' | 'name' | 'location'

// Modified to accept the debounced term as a required argument
const useExploreFilters = (
    organizations: IOrganization[] = [],
    branches: IBranch[] = [],
    // ACCEPT THE DEBOUNCED TERM
    debounceSearchTerm: string
) => {
    const [activeView, setActiveView] = useState<ExploreView>('organizations')
    // REMOVED: [searchTerm, setSearchTerm] and useDebounce(searchTerm, 1500)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState('all')
    const [sortBy, setSortBy] = useState<SortBy>('recent')

    // Filtering logic now depends only on the stable debounceSearchTerm prop
    const filteredOrganizations = useMemo(() => {
        if (!organizations || organizations.length === 0) return []
        const filtered = filterOrganizations(
            organizations,
            debounceSearchTerm, // Use the prop
            selectedCategory
        )
        return sortOrganizations(filtered, sortBy)
    }, [organizations, debounceSearchTerm, selectedCategory, sortBy])

    const filteredBranches = useMemo(() => {
        if (!branches || branches.length === 0) return []
        const filtered = filterBranches(
            branches,
            debounceSearchTerm, // Use the prop
            selectedLocation
        )
        return sortBranches(filtered, sortBy)
    }, [branches, debounceSearchTerm, selectedLocation, sortBy])

    const setters = useMemo(
        () => ({
            setActiveView,
            // REMOVED: setSearchTerm
            setSelectedCategory,
            setSelectedLocation,
            setSortBy,
        }),
        []
    )

    return {
        activeView,
        // REMOVED: debounceSearchTerm (it's passed in)
        selectedCategory,
        selectedLocation,
        sortBy,
        ...setters,
        filteredOrganizations,
        filteredBranches,
        // REMOVED: searchTerm
    }
}

export default useExploreFilters
