import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { useHotkeys } from 'react-hotkeys-hook'

import useDebounce from '@/hooks/use-debounce'

import { MagnifyingGlassIcon } from '../icons'
import { Input } from '../ui/input'

type GenericSearchInputProps = {
    setSearchTerm: (term: string) => void
    placeholder?: string
    inputClassName?: string
    className?: string
}

const GenericSearchInput = ({
    setSearchTerm,
    placeholder,
    className,
    inputClassName,
}: GenericSearchInputProps) => {
    const [inputValue, setInputValue] = useState('')

    const debounceSearchTerm = useDebounce(inputValue, 200)

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
        <div className={cn(`relative flex-1 max-w-2xl mx-auto`, className)}>
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                className={cn(
                    'pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50',
                    inputClassName
                )}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                value={inputValue}
            />
        </div>
    )
}

export default GenericSearchInput
