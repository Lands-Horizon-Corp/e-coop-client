import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { cn } from '@/helpers/tw-utils'
import { TCustomSearchProps, TLatLngExpressionWithDesc } from '@/types/map/map'
import L from 'leaflet'
import { debounce } from 'lodash-es'

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
                className={cn(
                    'rounded-lg border px-4 py-2 focus:border-none focus:outline-none',
                    className ?? ''
                )}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                    }
                }}
                placeholder="Search Google Maps"
                type="text"
                value={query}
            />
            <div
                className={`absolute z-[50] flex w-[90%] flex-col space-y-2 bg-background/90 ${!showSearchList ? 'hidden' : 'p-5'} rounded-lg`}
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
                                        className="cursor-pointer hover:rounded-lg hover:bg-accent focus:rounded-lg focus:bg-accent focus:outline-none focus:ring-0"
                                        key={index}
                                        onClick={() => {
                                            handleOnLocationFound(
                                                parseFloat(location.lat),
                                                parseFloat(location.lng)
                                            )
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleOnLocationFound(
                                                    parseFloat(location.lat),
                                                    parseFloat(location.lng)
                                                )
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        <div className="flex p-2">
                                            <div className="w-9">
                                                <LocationPinOutlineIcon className="size-6 text-muted-foreground" />
                                            </div>
                                            <p className="truncate text-sm text-foreground">
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
