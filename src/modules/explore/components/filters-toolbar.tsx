import { Dispatch } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { ExploreView, SortBy } from '../explore.type'

type FiltersToolbarProps = {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    selectedLocation: string
    setSelectedLocation: (location: string) => void
    categories: string[]
    locations: string[]
    activeView: ExploreView
    setActiveView: Dispatch<React.SetStateAction<ExploreView>>
    sortBy: SortBy
    setSortBy: Dispatch<React.SetStateAction<SortBy>>
}

const FiltersToolbar = ({
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    categories,
    locations,
    activeView,
    sortBy,
    setSortBy,
}: FiltersToolbarProps) => {
    return (
        <div className="flex items-center gap-3">
            <Select
                onValueChange={(value) => setSortBy(value as SortBy)}
                value={sortBy}
            >
                <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                </SelectContent>
            </Select>

            {activeView === 'organizations' && (
                <Select
                    onValueChange={setSelectedCategory}
                    value={selectedCategory}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {activeView === 'branches' && (
                <Select
                    onValueChange={setSelectedLocation}
                    value={selectedLocation}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                                {location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}

export default FiltersToolbar
