import { useEffect, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { MagnifyingGlassIcon as SearchIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'

import useDebounce from '@/hooks/use-debounce'

import FiltersToolbar from './filters-toolbar'

type ExploreHeaderProps = {
    setSearchTerm: (term: string) => void
    categories: string[]
}

const ExploreHeader = ({ setSearchTerm, categories }: ExploreHeaderProps) => {
    const [inputValue, setInputValue] = useState('')

    const debounceSearchTerm = useDebounce(inputValue, 400)

    useEffect(() => {
        setSearchTerm(debounceSearchTerm)
    }, [debounceSearchTerm, setSearchTerm])

    useHotkeys(
        'enter',
        (e) => {
            e.preventDefault()
            const searchInput = document.querySelector(
                'input[placeholder*="Search"]'
            ) as HTMLInputElement
            if (searchInput) {
                searchInput.focus()
            }
        },
        {
            keydown: true,
            keyup: true,
        }
    )

    return (
        <div className="top-16 z-10 -translate-y-[1.5px] ease-in-out duration-900 pb-2  pl-10 px-2">
            <div className="text-start pt-1 flex items-center mx-auto !mt-20">
                <div className="flex flex-col flex-2 justify-start mb-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                        Explore
                    </h1>
                    <p className="text-md">
                        Discover organizations and branches that match your
                        interests
                    </p>
                </div>
                <div className="relative flex-1 max-w-2xl mx-auto">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50"
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search organizations, branches, or locations..."
                        value={inputValue}
                    />
                </div>
            </div>
            <FiltersToolbar
                categories={categories}
                setSearchTerm={setSearchTerm}
            />
        </div>
    )
}

export default ExploreHeader
