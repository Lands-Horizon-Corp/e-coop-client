import { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type FiltersToolbarProps = {
    categories: string[]
    setSearchTerm: (term: string) => void
}

const FiltersToolbar = ({ categories, setSearchTerm }: FiltersToolbarProps) => {
    const [selectedCategory, setSelectedCategory] = useState('')

    return (
        <div className="flex w-full justify-end items-center gap-3">
            {
                <Select
                    onValueChange={(category) => {
                        setSelectedCategory(category)
                        setSearchTerm(category === 'all' ? '' : category)
                    }}
                    value={selectedCategory}
                >
                    <SelectTrigger className="w-">
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
            }
        </div>
    )
}

export default FiltersToolbar
