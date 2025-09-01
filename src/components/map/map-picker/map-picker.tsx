import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { Building, Globe, MapPin, Navigation, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface LatLng {
    lat: number
    lng: number
}

export interface PlaceSuggestion {
    place_id: string
    description: string
    structured_formatting: {
        main_text: string
        secondary_text: string
    }
    types: string[]
}

export interface GoogleMapsEvent {
    latLng: {
        lat(): number
        lng(): number
    }
}

export interface GoogleGeocodeResult {
    formatted_address: string
}

export interface GooglePlaceDetails {
    place_id: string
    geometry: {
        location: {
            lat(): number
            lng(): number
        }
    }
    name?: string
    formatted_address?: string
    types: string[]
}

export interface MapPickerProps {
    /** Current selected location */
    value?: LatLng | null
    /** Callback when location changes */
    onChange: (location: LatLng | null) => void
    /** Google Maps Map ID for custom styling */
    mapId?: string
    /** Default map center */
    defaultCenter?: LatLng
    /** Default zoom level */
    defaultZoom?: number
    /** Search input placeholder */
    searchPlaceholder?: string
    /** Modal title */
    title?: string
    /** Show address in selected location info */
    showAddress?: boolean
    /** Map container styling */
    _mapContainerStyle?: React.CSSProperties
    /** Button text when no location is selected */
    placeholder?: string
    /** Button variant */
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
    /** Button size */
    size?: 'default' | 'sm' | 'lg' | 'icon'
    /** Whether the button is disabled */
    disabled?: boolean
    /** Custom button class name */
    className?: string
    hideButtonCoordinates?: boolean
}

const defaultCenter: LatLng = { lat: 37.7749, lng: -122.4194 }
// const defaultMapContainerStyle: React.CSSProperties = {
//     width: '100%',
//     height: '400px',
//     borderRadius: '8px',
// }
const libraries: ('places' | 'geometry')[] = ['places', 'geometry']

export const MapPicker: React.FC<MapPickerProps> = ({
    value,
    onChange,
    mapId,
    defaultCenter: propDefaultCenter = defaultCenter,
    defaultZoom = 10,
    searchPlaceholder = 'Search for a location...',
    title = 'Select Location',
    showAddress = true,
    // _mapContainerStyle = defaultMapContainerStyle,
    placeholder = 'Select location',
    variant = 'outline',
    size = 'default',
    disabled = false,
    className,
    hideButtonCoordinates = true,
}) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: apiKey ?? '',
        libraries,
    })

    // Internal modal state
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
        value || null
    )
    const [mapCenter, setMapCenter] = useState<LatLng>(
        value || propDefaultCenter
    )
    const [mapZoom, setMapZoom] = useState<number>(value ? 15 : defaultZoom)
    const [address, setAddress] = useState<string>('')
    const [searchValue, setSearchValue] = useState<string>('')
    const [isLoadingAddr, setIsLoadingAddr] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [isLoadingSuggestions, setIsLoadingSuggestions] =
        useState<boolean>(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geocoderRef = useRef<any | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markerRef = useRef<any | null>(null)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const placesServiceRef = useRef<any | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autocompleteServiceRef = useRef<any | null>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const justOpenedRef = useRef(false)

    const formatLocation = (location: LatLng): string => {
        return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    }

    const reverseGeocode = useCallback(
        (loc: LatLng) => {
            if (!geocoderRef.current || !showAddress) return

            setIsLoadingAddr(true)

            geocoderRef.current.geocode(
                { location: loc },
                (
                    results: GoogleGeocodeResult[] | null,
                    status: google.maps.GeocoderStatus
                ) => {
                    setIsLoadingAddr(false)
                    if (status === 'OK' && results && results[0]) {
                        setAddress(results[0].formatted_address)
                    } else {
                        setAddress('Address not found')
                    }
                }
            )
        },
        [showAddress]
    )
    const createOrMoveMarker = useCallback(
        (location: LatLng) => {
            if (!mapRef.current || !window.google?.maps) return

            if (markerRef.current) {
                markerRef.current.setMap(null)
                markerRef.current = null
            }

            if (window.google.maps.Marker) {
                markerRef.current = new window.google.maps.Marker({
                    map: mapRef.current,
                    position: location,
                    draggable: true,
                })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                markerRef.current.addListener('dragend', (e: any) => {
                    const newLoc: LatLng = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    }
                    setSelectedLocation(newLoc)
                    reverseGeocode(newLoc)
                })
            }
        },
        [reverseGeocode]
    )

    const searchPlaces = useCallback((query: string) => {
        if (!autocompleteServiceRef.current || !query.trim()) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        setIsLoadingSuggestions(true)

        const request = {
            input: query,
        }

        autocompleteServiceRef.current.getPlacePredictions(
            request,
            (
                predictions: PlaceSuggestion[],
                status: google.maps.places.PlacesServiceStatus
            ) => {
                setIsLoadingSuggestions(false)

                if (
                    status ===
                        window.google.maps.places.PlacesServiceStatus.OK &&
                    predictions
                ) {
                    setSuggestions(predictions.slice(0, 5))
                    setShowSuggestions(true)
                } else {
                    setSuggestions([])
                    setShowSuggestions(false)
                }
            }
        )
    }, [])

    const selectPlace = useCallback(
        (placeId: string, description: string) => {
            if (!placesServiceRef.current) {
                return
            }

            setIsLoadingSuggestions(true)

            const request = {
                placeId: placeId,
                fields: [
                    'place_id',
                    'geometry',
                    'name',
                    'formatted_address',
                    'types',
                ],
            }

            placesServiceRef.current.getDetails(
                request,
                (
                    place: GooglePlaceDetails,
                    status: google.maps.places.PlacesServiceStatus
                ) => {
                    setIsLoadingSuggestions(false)

                    if (
                        status ===
                            window.google.maps.places.PlacesServiceStatus.OK &&
                        place.geometry
                    ) {
                        const newLoc: LatLng = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        }

                        setSelectedLocation(newLoc)
                        setMapCenter(newLoc)
                        setMapZoom(15)
                        setSearchValue(description)
                        setShowSuggestions(false)
                        setSuggestions([])

                        if (mapRef.current) {
                            mapRef.current.panTo(newLoc)
                            mapRef.current.setZoom(15)
                        }

                        setTimeout(() => {
                            createOrMoveMarker(newLoc)
                        }, 100)

                        if (showAddress) {
                            setAddress(
                                place.formatted_address ||
                                    place.name ||
                                    description
                            )
                        }
                    } else {
                        setSearchValue(description)
                        setShowSuggestions(false)
                        setSuggestions([])
                    }
                }
            )
        },
        [createOrMoveMarker, showAddress]
    )

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setSearchValue(value)

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }

            searchTimeoutRef.current = setTimeout(() => {
                if (value.trim()) {
                    searchPlaces(value)
                } else {
                    setSuggestions([])
                    setShowSuggestions(false)
                }
            }, 300)
        },
        [searchPlaces]
    )

    const getPlaceIcon = (types: string[]) => {
        if (
            types.includes('establishment') ||
            types.includes('point_of_interest')
        ) {
            return <Building className="h-4 w-4 text-blue-500" />
        }
        if (
            types.includes('locality') ||
            types.includes('administrative_area_level_1')
        ) {
            return <Globe className="h-4 w-4 text-green-500" />
        }
        return <Navigation className="text-muted-foreground h-4 w-4" />
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMapLoad = useCallback((map: any) => {
        mapRef.current = map

        if (window.google?.maps) {
            geocoderRef.current = new window.google.maps.Geocoder()
            placesServiceRef.current =
                new window.google.maps.places.PlacesService(map)
            autocompleteServiceRef.current =
                new window.google.maps.places.AutocompleteService()
        }
    }, [])

    const onMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                const loc: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
                setSelectedLocation(loc)
                createOrMoveMarker(loc)
                reverseGeocode(loc)
                setShowSuggestions(false)
            }
        },
        [createOrMoveMarker, reverseGeocode]
    )

    // Sync internal state with external value
    useEffect(() => {
        if (isOpen) {
            justOpenedRef.current = true
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && justOpenedRef.current) {
            // Ignore the first value change after opening
            justOpenedRef.current = false
            return
        }
        setSelectedLocation(value || null)
    }, [value, isOpen])

    useEffect(() => {
        if (isOpen) {
            setSelectedLocation(value || null)
            setMapCenter(value || propDefaultCenter)
            setMapZoom(value ? 15 : defaultZoom)
            setAddress('')
            setSearchValue('')
            setSuggestions([])
            setShowSuggestions(false)

            if (value && isLoaded) {
                setTimeout(() => createOrMoveMarker(value), 300)
            }
        } else {
            if (markerRef.current) {
                markerRef.current.setMap(null)
                markerRef.current = null
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [
        isOpen,
        value,
        propDefaultCenter,
        defaultZoom,
        isLoaded,
        createOrMoveMarker,
    ])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const searchContainer = searchInputRef.current?.parentElement

            if (searchContainer && !searchContainer.contains(target)) {
                setShowSuggestions(false)
            }
        }

        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showSuggestions])

    // Auto-close modal and call onChange when location is selected
    const handleConfirm = () => {
        onChange(selectedLocation)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setSelectedLocation(value || null) // Reset to original value
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedLocation(null)
        setAddress('')
        setSearchValue('')
        setSuggestions([])
        setShowSuggestions(false)
        if (markerRef.current) {
            markerRef.current.setMap(null)
            markerRef.current = null
        }
    }

    // Quick select - automatically confirm when location is selected via search or click
    const handleQuickSelect = (location: LatLng) => {
        onChange(location)
        setIsOpen(false)
    }

    const mapOptions = {
        mapId,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: 'cooperative' as const,
        clickableIcons: true,
    }

    if (!apiKey) {
        return (
            <div className="rounded border border-red-200 p-2 text-sm text-red-600">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="rounded border border-red-200 p-2 text-sm text-red-600">
                Failed to load Google Maps
            </div>
        )
    }

    return (
        <>
            {/* Trigger Button */}
            <Button
                className={className}
                disabled={disabled}
                size={size}
                type="button"
                variant={variant}
                onClick={() => setIsOpen(true)}
            >
                <MapPin className="mr-2 h-4 w-4" />
                {value ? (
                    <>
                        {!hideButtonCoordinates
                            ? formatLocation(value)
                            : placeholder}
                    </>
                ) : (
                    placeholder
                )}
            </Button>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[96vh] min-w-7xl overflow-hidden p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> {title}
                        </DialogTitle>
                        <DialogDescription>
                            Search or click on the map to pick a location. Drag
                            the marker to fine-tune.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Two Column Layout */}
                    <div className="flex flex-col lg:h-[600px] lg:flex-row">
                        {/* Left Column - Map */}
                        <div className="w-full lg:w-2/3 lg:border-r">
                            <div className="h-[300px] lg:h-full">
                                {isLoaded ? (
                                    <GoogleMap
                                        center={mapCenter}
                                        mapContainerStyle={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        options={mapOptions}
                                        zoom={mapZoom}
                                        onClick={onMapClick}
                                        onLoad={onMapLoad}
                                    />
                                ) : (
                                    <div className="bg-muted text-muted-foreground flex h-full items-center justify-center">
                                        Loading map…
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Search and Info */}
                        <div className="w-full lg:w-1/3">
                            <div className="flex h-full flex-col">
                                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                                    {/* Search Section */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location-search">
                                            Search Location
                                        </Label>
                                        <div className="relative">
                                            <Search className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />

                                            <Input
                                                autoComplete="off"
                                                className="pr-10 pl-10"
                                                disabled={!isLoaded}
                                                id="location-search"
                                                placeholder={
                                                    isLoaded
                                                        ? searchPlaceholder
                                                        : 'Loading...'
                                                }
                                                ref={searchInputRef}
                                                value={searchValue}
                                                onChange={handleSearchChange}
                                                onFocus={() => {
                                                    if (
                                                        suggestions.length > 0
                                                    ) {
                                                        setShowSuggestions(true)
                                                    }
                                                }}
                                            />

                                            {searchValue && (
                                                <Button
                                                    className="absolute top-1/2 right-1 z-10 h-8 w-8 -translate-y-1/2 p-0"
                                                    size="sm"
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSearchValue('')
                                                        setSuggestions([])
                                                        setShowSuggestions(
                                                            false
                                                        )
                                                        if (
                                                            searchInputRef.current
                                                        ) {
                                                            searchInputRef.current.focus()
                                                        }
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {showSuggestions &&
                                                (suggestions.length > 0 ||
                                                    isLoadingSuggestions) && (
                                                    <div className="absolute top-full right-0 left-0 z-[9999] mt-1">
                                                        <Command className="rounded-md border shadow-md">
                                                            <CommandList>
                                                                {isLoadingSuggestions ? (
                                                                    <CommandEmpty className="py-6 text-center text-sm">
                                                                        Searching
                                                                        for
                                                                        places...
                                                                    </CommandEmpty>
                                                                ) : suggestions.length ===
                                                                  0 ? (
                                                                    <CommandEmpty className="py-6 text-center text-sm">
                                                                        No
                                                                        places
                                                                        found.
                                                                    </CommandEmpty>
                                                                ) : (
                                                                    <CommandGroup>
                                                                        {suggestions.map(
                                                                            (
                                                                                suggestion
                                                                            ) => (
                                                                                <CommandItem
                                                                                    className="flex cursor-pointer items-start gap-3 p-3"
                                                                                    key={
                                                                                        suggestion.place_id
                                                                                    }
                                                                                    onSelect={() => {
                                                                                        selectPlace(
                                                                                            suggestion.place_id,
                                                                                            suggestion.description
                                                                                        )
                                                                                    }}
                                                                                >
                                                                                    <div className="mt-0.5 flex-shrink-0">
                                                                                        {getPlaceIcon(
                                                                                            suggestion.types
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="min-w-0 flex-1 space-y-1">
                                                                                        <div className="truncate text-sm font-medium">
                                                                                            {
                                                                                                suggestion
                                                                                                    .structured_formatting
                                                                                                    .main_text
                                                                                            }
                                                                                        </div>
                                                                                        <div className="text-muted-foreground truncate text-xs">
                                                                                            {
                                                                                                suggestion
                                                                                                    .structured_formatting
                                                                                                    .secondary_text
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </CommandItem>
                                                                            )
                                                                        )}
                                                                    </CommandGroup>
                                                                )}
                                                            </CommandList>
                                                        </Command>
                                                    </div>
                                                )}
                                        </div>

                                        <div className="text-muted-foreground text-xs">
                                            Status: Maps {isLoaded ? '✓' : '⏳'}{' '}
                                            | Places Service{' '}
                                            {placesServiceRef.current
                                                ? '✓'
                                                : '⏳'}
                                        </div>
                                    </div>

                                    {/* Selected Location Section */}
                                    {selectedLocation && (
                                        <div className="bg-muted space-y-3 rounded-lg border p-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold">
                                                    Selected Location
                                                </Label>
                                                <Button
                                                    className="h-7 px-2"
                                                    size="sm"
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleClear}
                                                >
                                                    Clear
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-sm">
                                                    <div className="text-muted-foreground mb-1 text-xs font-medium">
                                                        Coordinates:
                                                    </div>
                                                    <div className="font-mono text-xs">
                                                        <div>
                                                            Lat:{' '}
                                                            {selectedLocation.lat.toFixed(
                                                                6
                                                            )}
                                                        </div>
                                                        <div>
                                                            Lng:{' '}
                                                            {selectedLocation.lng.toFixed(
                                                                6
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {showAddress && (
                                                    <div className="text-sm">
                                                        <div className="text-muted-foreground mb-1 text-xs font-medium">
                                                            Address:
                                                        </div>
                                                        <div className="text-xs leading-relaxed">
                                                            {isLoadingAddr ? (
                                                                <span className="text-muted-foreground">
                                                                    Loading
                                                                    address...
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    {address ||
                                                                        'Address not available'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                className="w-full"
                                                size="sm"
                                                type="button"
                                                onClick={() =>
                                                    handleQuickSelect(
                                                        selectedLocation
                                                    )
                                                }
                                            >
                                                Use This Location
                                            </Button>
                                        </div>
                                    )}

                                    {/* How to use section */}
                                    <div className="text-muted-foreground rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/20">
                                        <p className="mb-2 font-medium">
                                            How to use:
                                        </p>
                                        <ul className="space-y-1 text-xs">
                                            <li>
                                                • Search for locations above
                                            </li>
                                            <li>• Click anywhere on the map</li>
                                            <li>• Drag the marker to adjust</li>
                                            <li>
                                                • Use &quot;Use This
                                                Location&quot; for quick
                                                selection
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex gap-2 border-t p-4">
                                    <Button
                                        className="flex-1"
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        disabled={!selectedLocation}
                                        type="button"
                                        onClick={handleConfirm}
                                    >
                                        Confirm Location
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MapPicker
