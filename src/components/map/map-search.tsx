import { cn } from '@/lib'
import { TCustomSearchProps, TLatLngExpressionWithDesc } from '@/types'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import L from 'leaflet'
import { debounce } from 'lodash-es'
import { useState, useEffect } from 'react'
import { LoadingCircleIcon, LocationPinOutlineIcon } from '../icons'
import { Input } from '../ui/input'

const MapSearch = ({ onLocationFound, className, map }: TCustomSearchProps) => {
    const [results, setResults] = useState<TLatLngExpressionWithDesc[]>([])
    const [query, setQuery] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const { mutate: handleSearchMutation, isPending } = useMutation<
        TLatLngExpressionWithDesc[],
        string,
        string
    >({
        mutationKey: ['handleSearch'],
        mutationFn: async (query: string) => {
            if (!query.trim()) return []

            try {
                const { data } = await axios.get(
                    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
                )

                return data.map(
                    (result: {
                        lat: string
                        lon: string
                        display_name: string
                    }) => ({
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        desc: result.display_name,
                    })
                )
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: (locations) => {
            setResults(locations)
        },
        onError: (error) => {
            console.error('Search failed:', error)
        },
    })

    useEffect(() => {
        const debouncedSearch = debounce((query: string) => {
            handleSearchMutation(query)
        }, 500)

        if (searchQuery) debouncedSearch(searchQuery)

        return () => {
            debouncedSearch.cancel()
        }
    }, [searchQuery, handleSearchMutation])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ?? ''
        if (value === '') {
            setResults([])
        }
        setQuery(value)
        setSearchQuery(value)
    }

    const handleOnLocationFound = (lat: number, lng: number) => {
        const latLng = new L.LatLng(lat, lng)
        onLocationFound(latLng)
        if (map) {
            map.setView(latLng, 15)
        }
        setResults([])
    }

    const showSearchList = results?.length > 0

    return (
        <div className="h-fit w-full">
            <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                    }
                }}
                placeholder="Search Google Maps"
                className={cn(
                    'rounded-lg border border-gray-300 px-4 py-2 focus:border-none focus:outline-none',
                    className ?? ''
                )}
            />
            <div
                className={`absolute z-[50] flex w-[90%] flex-col space-y-2 bg-white/90 dark:bg-secondary/90 dark:text-white ${!showSearchList ? 'hidden' : 'p-5'} rounded-lg`}
            >
                {isPending ? (
                    <div className="flex w-full justify-center">
                        <LoadingCircleIcon className="animate-spin" />
                    </div>
                ) : (
                    <div>
                        {showSearchList && (
                            <>
                                {results.map((location, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer hover:rounded-lg hover:bg-slate-200/40 focus:rounded-lg focus:bg-slate-200/40 focus:outline-none focus:ring-0"
                                        onClick={() => {
                                            handleOnLocationFound(
                                                parseFloat(location.lat),
                                                parseFloat(location.lng)
                                            )
                                        }}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleOnLocationFound(
                                                    parseFloat(location.lat),
                                                    parseFloat(location.lng)
                                                )
                                            }
                                        }}
                                    >
                                        <div className="flex p-2">
                                            <div className="w-9">
                                                <LocationPinOutlineIcon className="size-6 text-slate-600 dark:text-destructive-foreground" />
                                            </div>
                                            <p className="truncate text-sm">
                                                {location.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default MapSearch
