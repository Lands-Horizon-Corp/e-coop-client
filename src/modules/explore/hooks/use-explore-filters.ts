import { useMemo, useState } from 'react'

import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'

import useDebounce from '@/hooks/use-debounce'

import { filterBranches, filterOrganizations } from '../utils/data-filters'
import { sortBranches, sortOrganizations } from '../utils/sorting'

export type ExploreView = 'organizations' | 'branches' | 'map'
export type SortBy = 'recent' | 'popular' | 'name' | 'location'

const useExploreFilters = (
    organizations: IOrganization[] = [],
    branches: IBranch[] = []
) => {
    const [activeView, setActiveView] = useState<ExploreView>('organizations')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState('all')
    const [sortBy, setSortBy] = useState<SortBy>('recent')

    const debounceSearchTerm = useDebounce(searchTerm, 400)

    const filteredOrganizations = useMemo(() => {
        if (!organizations || organizations.length === 0) return []
        const filtered = filterOrganizations(
            organizations,
            debounceSearchTerm,
            selectedCategory
        )
        return sortOrganizations(filtered, sortBy)
    }, [organizations, debounceSearchTerm, selectedCategory, sortBy])

    const filteredBranches = useMemo(() => {
        if (!branches || branches.length === 0) return []
        const filtered = filterBranches(
            branches,
            debounceSearchTerm,
            selectedLocation
        )
        return sortBranches(filtered, sortBy)
    }, [branches, debounceSearchTerm, selectedLocation, sortBy])

    const setters = useMemo(
        () => ({
            setActiveView,
            setSearchTerm,
            setSelectedCategory,
            setSelectedLocation,
            setSortBy,
        }),
        []
    )

    return {
        activeView,
        debounceSearchTerm,
        selectedCategory,
        selectedLocation,
        sortBy,
        ...setters,
        filteredOrganizations,
        filteredBranches,
        searchTerm,
    }
}

export default useExploreFilters
