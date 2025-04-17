import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
    MapContainer,
    TileLayer,
    useMapEvent,
    useMap,
    ZoomControl,
} from 'react-leaflet'
import debounce from 'lodash-es/debounce'
import { useMutation } from '@tanstack/react-query'
import L, { LatLngExpression, latLng } from 'leaflet'

import {
    Pin,
    TMapProps,
    TMainMapProps,
    TCustomSearchProps,
    TMapWithClickProps,
    TLatLngExpressionWithDesc,
} from '@/types/components'
import { Input } from '../ui/input'
import LayerControl from './layer-control'
import { LoadingCircleIcon, LocationPinOutlineIcon } from '../icons'

import { cn } from '@/lib'
import logger from '@/helpers/loggers/logger'

const getLocationDescription = async (latlng: LatLngExpression) => {
    const { lat, lng } = latLng(latlng)
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    try {
        const response = await fetch(reverseGeocodeUrl)
        const data = await response.json()
        return data.display_name || 'Address not found'
    } catch (error) {
        logger.error('Error fetching reverse geocode data:', error)
    }
}

const MapWithClick = ({ onLocationFound }: TMapWithClickProps) => {
    useMapEvent('click', async (e) => {
        onLocationFound(e.latlng)
    })
    return null
}

const CustomSearch = ({
    onLocationFound,
    className,
    map,
}: TCustomSearchProps) => {
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

    const showSearchList = results.length > 0

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
                className={`absolute z-[1000] flex w-[90%] flex-col space-y-2 bg-white/90 dark:bg-secondary/90 dark:text-white ${!showSearchList ? 'hidden' : 'p-5'} rounded-lg`}
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

const Maps = ({ handleMapCreated }: TMapProps) => {
    const map = useMap()

    useEffect(() => {
        if (handleMapCreated) {
            handleMapCreated(map)
        }
    }, [handleMapCreated, map])

    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LayerControl />
        </>
    )
}

const Map = ({
    zoom,
    style,
    center,
    minZoom,
    maxZoom,
    children,
    className,
    hideControls,
    searchClassName,
    viewOnly = false,
    zoomControl = false,
    multiplePins = false,
    mapContainerClassName,
    scrollWheelZoom = true,
    defaultMarkerPins = [],
    hideLayersControl = false,
    whenReady,
    onCoordinateClick,
    onMultipleCoordinatesChange,
}: TMainMapProps) => {
    const [, setSearchedAddress] = useState('')
    const [, setSelectedPins] = useState<Pin[]>([])
    const [map, setMap] = useState<L.Map | null>(null)
    const markerRefs = useRef<{ [key: string]: L.Marker }>({})

    const handleMapReady = (mapInstance: L.Map) => {
        setMap(mapInstance)
    }

    const addMarker = useCallback(
        async (latLng: LatLngExpression) => {
            const { lat, lng } = latLng as L.LatLngLiteral
            const markerKey = `${lat},${lng}`

            if (!multiplePins) {
                Object.values(markerRefs.current).forEach((marker) =>
                    marker.remove()
                )
                markerRefs.current = {}
                setSelectedPins([])
            }

            if (markerRefs.current[markerKey]) {
                markerRefs.current[markerKey].remove()
            }

            const marker = L.marker(latLng).addTo(map as L.Map)
            markerRefs.current[markerKey] = marker

            const address = await getLocationDescription(latLng)
            marker.bindPopup(address).openPopup()
        },
        [map, multiplePins]
    )

    const handleLocationFound = useCallback(
        async (latLng: LatLngExpression) => {
            const newPin: Pin = { id: Date.now(), position: latLng }

            if (multiplePins) {
                setSelectedPins((prevPins) => {
                    const updatedPins = [...prevPins, newPin]

                    if (onMultipleCoordinatesChange) {
                        const newSelectedPositions = updatedPins.map(
                            (pin) => pin.position
                        )
                        onMultipleCoordinatesChange(newSelectedPositions)
                    }

                    return updatedPins
                })
            } else {
                if (onCoordinateClick) {
                    onCoordinateClick(latLng)
                }
                setSelectedPins([newPin])
            }
            addMarker(latLng)
        },
        [
            addMarker,
            multiplePins,
            onMultipleCoordinatesChange,
            onCoordinateClick,
        ]
    )

    useEffect(() => {
        if (map && defaultMarkerPins.length > 0) {
            defaultMarkerPins.forEach(({ lat, lng }) => {
                const latLng: LatLngExpression = { lat, lng }
                const markerKey = `${lat},${lng}`

                if (!markerRefs.current[markerKey]) {
                    const marker = L.marker(latLng).addTo(map)
                    markerRefs.current[markerKey] = marker
                }
            })
        }
    }, [map, defaultMarkerPins])

    useEffect(() => {
        if (map) {
            const container = map.getContainer()
            const layersControlElement = container.querySelector(
                '.leaflet-control-layers.leaflet-control'
            ) as HTMLElement | null

            if (layersControlElement) {
                if (hideLayersControl) {
                    layersControlElement.classList.add('hidden')
                } else {
                    layersControlElement.classList.remove('hidden')
                }
            }
        }
    }, [map, hideLayersControl])

    return (
        <div
            className={cn(
                'relative flex w-full flex-col gap-4',
                viewOnly ? 'p-0' : 'p-5 shadow-sm',
                className
            )}
        >
            {!viewOnly && (
                <CustomSearch
                    map={map}
                    className={searchClassName}
                    setSearchedAddress={setSearchedAddress}
                    onLocationFound={handleLocationFound}
                />
            )}
            <MapContainer
                zoom={zoom}
                ref={setMap}
                style={style}
                center={center}
                minZoom={minZoom}
                maxZoom={maxZoom}
                whenReady={whenReady}
                zoomControl={zoomControl}
                scrollWheelZoom={scrollWheelZoom}
                className={cn(
                    `size-full flex-grow rounded-lg`,
                    mapContainerClassName
                )}
            >
                <Maps handleMapCreated={handleMapReady} />
                <MapWithClick onLocationFound={handleLocationFound} />
                {!hideControls && <ZoomControl position="bottomright" />}
                {children}
            </MapContainer>
        </div>
    )
}

export default Map
