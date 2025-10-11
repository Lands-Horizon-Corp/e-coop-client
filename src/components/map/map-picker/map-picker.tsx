'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GOOGLE_MAPS_API_KEY } from '@/constants'
import { cn } from '@/helpers'
import { getCurrentLocationWithDefault } from '@/helpers/map-utils'
import { useTheme } from '@/modules/settings/provider/theme-provider'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import CopyTextButton from '@/components/copy-text-button'
import {
    BuildingIcon,
    CloseIcon,
    GlobeIcon,
    MagnifyingGlassIcon,
    NavigationIcon,
    PinLocationIcon,
    TargetArrowIcon,
} from '@/components/icons'
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
        main_text_matched_substrings?: google.maps.places.PredictionSubstring[]
        secondary_text_matched_substrings?: google.maps.places.PredictionSubstring[]
    }
    types: string[]
    terms: google.maps.places.PredictionTerm[]
    matched_substrings: google.maps.places.PredictionSubstring[]
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
    id: string
    location: {
        lat(): number
        lng(): number
    }
    displayName?: string
    formattedAddress?: string
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
    viewOnly?: boolean
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

export const MapPicker: React.FC<MapPickerProps> = ({
    value,
    onChange,
    mapId,
    defaultCenter: propDefaultCenter = defaultCenter,
    defaultZoom = 10,
    searchPlaceholder = 'Search for a location...',
    title = 'Select Location',
    showAddress = true,
    placeholder = 'Select location',
    variant = 'outline',
    size = 'default',
    disabled = false,
    className,
    viewOnly = false,
    hideButtonCoordinates = true,
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? '',
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
    const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false)

    const mapRef = useRef<google.maps.Map | null>(null)
    const geocoderRef = useRef<google.maps.Geocoder | null>(null)
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
        null
    )
    const theme = useRef<google.maps.ColorScheme | null>(null)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const justOpenedRef = useRef(false)

    const formatLocation = (location: LatLng): string => {
        return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    }

    const { resolvedTheme } = useTheme()

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
        async (location: LatLng) => {
            if (!mapRef.current || !window.google?.maps) return

            // Remove existing marker
            if (markerRef.current) {
                markerRef.current.map = null
                markerRef.current = null
            }

            try {
                // Import the marker library dynamically like your example
                const { AdvancedMarkerElement } =
                    (await window.google.maps.importLibrary(
                        'marker'
                    )) as google.maps.MarkerLibrary

                // Create new advanced marker
                markerRef.current = new AdvancedMarkerElement({
                    map: mapRef.current,
                    position: location,
                    gmpDraggable: true,
                    gmpClickable: true,
                    title: 'Selected Location', // Add title like your example
                })
                const { ColorScheme } = (await google.maps.importLibrary(
                    'core'
                )) as google.maps.CoreLibrary
                theme.current =
                    resolvedTheme === 'dark'
                        ? ColorScheme.DARK
                        : ColorScheme.LIGHT

                markerRef.current.addListener(
                    'dragend',
                    (e: google.maps.MapMouseEvent) => {
                        const newLoc: LatLng = {
                            lat: e.latLng?.lat() || 0,
                            lng: e.latLng?.lng() || 0,
                        }
                        setSelectedLocation(newLoc)
                        reverseGeocode(newLoc)
                    }
                )
            } catch (error) {
                console.error('Error creating advanced marker:', error)
            }
        },
        [reverseGeocode, resolvedTheme]
    )

    const searchPlaces = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        setIsLoadingSuggestions(true)

        try {
            // Load the new Places library
            const { AutocompleteSuggestion } =
                (await window.google.maps.importLibrary(
                    'places'
                )) as google.maps.PlacesLibrary

            const request = {
                input: query,
            }

            const { suggestions: predictions } =
                await AutocompleteSuggestion.fetchAutocompleteSuggestions(
                    request
                )

            if (predictions && predictions.length > 0) {
                // Convert the new format to our existing interface
                const convertedSuggestions = predictions
                    .slice(0, 5)
                    .map(
                        (
                            prediction: google.maps.places.AutocompleteSuggestion
                        ) => ({
                            place_id: prediction.placePrediction?.placeId || '',
                            description:
                                prediction.placePrediction?.text?.text || '',
                            structured_formatting: {
                                main_text:
                                    prediction.placePrediction?.text?.text ||
                                    '',
                                secondary_text:
                                    prediction.placePrediction?.secondaryText
                                        ?.text || '',
                            },
                            types: prediction.placePrediction?.types || [],
                            terms: [],
                            matched_substrings: [],
                        })
                    )

                setSuggestions(convertedSuggestions)
                setShowSuggestions(true)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error)
            setSuggestions([])
            setShowSuggestions(false)
        } finally {
            setIsLoadingSuggestions(false)
        }
    }, [])

    const selectPlace = useCallback(
        (placeId: string, description: string) => {
            if (!window.google?.maps?.places?.Place) {
                return
            }

            setIsLoadingSuggestions(true)

            // Use the new Place API
            const place = new window.google.maps.places.Place({
                id: placeId,
            })

            const request = {
                fields: [
                    'id',
                    'location',
                    'displayName',
                    'formattedAddress',
                    'types',
                ],
            }

            place
                .fetchFields(request)
                .then((response: { place: google.maps.places.Place }) => {
                    setIsLoadingSuggestions(false)

                    const placeResult = response.place
                    if (placeResult?.location) {
                        const newLoc: LatLng = {
                            lat: placeResult.location.lat(),
                            lng: placeResult.location.lng(),
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
                                placeResult.formattedAddress ||
                                    placeResult.displayName ||
                                    description
                            )
                        }
                    } else {
                        setSearchValue(description)
                        setShowSuggestions(false)
                        setSuggestions([])
                    }
                })
                .catch((error: Error) => {
                    setIsLoadingSuggestions(false)
                    console.error('Error fetching place details:', error)
                    setSearchValue(description)
                    setShowSuggestions(false)
                    setSuggestions([])
                })
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
            return <BuildingIcon className="h-4 w-4 text-blue-500" />
        }
        if (
            types.includes('locality') ||
            types.includes('administrative_area_level_1')
        ) {
            return <GlobeIcon className="h-4 w-4 text-primary" />
        }
        return <NavigationIcon className="text-muted-foreground h-4 w-4" />
    }

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map

        if (window.google?.maps) {
            geocoderRef.current = new window.google.maps.Geocoder()
        }
    }, [])

    const onMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (e.latLng && viewOnly === false) {
                const loc: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
                setSelectedLocation(loc)
                createOrMoveMarker(loc)
                reverseGeocode(loc)
                setShowSuggestions(false)
            }
        },
        [createOrMoveMarker, reverseGeocode, viewOnly]
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
                markerRef.current.map = null
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

    // Update map theme when resolvedTheme changes
    useEffect(() => {
        if (mapRef.current && isLoaded) {
            mapRef.current.setOptions({
                colorScheme: resolvedTheme === 'dark' ? 'DARK' : 'LIGHT',
            })
        }
    }, [resolvedTheme, isLoaded])

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
            markerRef.current.map = null
            markerRef.current = null
        }
    }

    // New function to get user's current location
    const handleGetCurrentLocation = useCallback(async () => {
        setIsGettingLocation(true)
        try {
            const currentLocation = await getCurrentLocationWithDefault(
                propDefaultCenter.lat,
                propDefaultCenter.lng
            )

            setSelectedLocation(currentLocation)
            setMapCenter(currentLocation)
            setMapZoom(15)

            if (mapRef.current) {
                mapRef.current.panTo(currentLocation)
                mapRef.current.setZoom(15)
            }

            setTimeout(() => {
                createOrMoveMarker(currentLocation)
            }, 100)

            reverseGeocode(currentLocation)
        } catch (error) {
            console.error('Error getting current location:', error)
        } finally {
            setIsGettingLocation(false)
        }
    }, [propDefaultCenter, createOrMoveMarker, reverseGeocode])

    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="rounded border border-red-200 p-2 text-sm text-destructive">
                GOOGLE_MAPS_API_KEY is missing
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="rounded border border-red-200 p-2 text-sm text-destructive">
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
                onClick={() => setIsOpen(true)}
                size={size}
                type="button"
                variant={variant}
            >
                <PinLocationIcon className="mr-2 h-4 w-4" />
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
            <Dialog onOpenChange={setIsOpen} open={isOpen}>
                <DialogContent className="max-h-[100vh] min-w-7xl overflow-hidden p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="flex items-center gap-2">
                            <PinLocationIcon className="h-5 w-5" /> {title}
                        </DialogTitle>
                        <DialogDescription>
                            Search or click on the map to pick a location. Drag
                            the marker to fine-tune.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Two Column Layout */}
                    <div className="flex flex-col lg:h-[700px] lg:flex-row">
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
                                        onClick={onMapClick}
                                        onLoad={onMapLoad}
                                        options={{
                                            mapId:
                                                mapId ||
                                                '7315fed6ff6d5145e4c926ff',
                                            disableDefaultUI: false,
                                            zoomControl: true,
                                            streetViewControl: false,
                                            mapTypeControl: false,
                                            fullscreenControl: false,
                                            gestureHandling:
                                                'cooperative' as const,
                                            clickableIcons: true,
                                            colorScheme:
                                                resolvedTheme === 'dark'
                                                    ? 'DARK'
                                                    : 'LIGHT',
                                        }}
                                        zoom={mapZoom}
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
                                    <div
                                        className={cn(
                                            'space-y-2',
                                            viewOnly && 'hidden'
                                        )}
                                    >
                                        <Label htmlFor="location-search">
                                            Search Location
                                        </Label>

                                        {/* Current Location Button */}
                                        <Button
                                            className="w-full"
                                            disabled={
                                                !isLoaded || isGettingLocation
                                            }
                                            onClick={handleGetCurrentLocation}
                                            size="sm"
                                            type="button"
                                            variant="outline"
                                        >
                                            <TargetArrowIcon className="mr-1 h-4 w-4" />
                                            {isGettingLocation
                                                ? 'Getting location...'
                                                : 'Use My Location'}
                                        </Button>

                                        <div className="relative">
                                            <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />

                                            <Input
                                                autoComplete="off"
                                                className="pr-10 pl-10"
                                                disabled={!isLoaded}
                                                id="location-search"
                                                onChange={handleSearchChange}
                                                onFocus={() => {
                                                    if (
                                                        suggestions.length > 0
                                                    ) {
                                                        setShowSuggestions(true)
                                                    }
                                                }}
                                                placeholder={
                                                    isLoaded
                                                        ? searchPlaceholder
                                                        : 'Loading...'
                                                }
                                                ref={searchInputRef}
                                                value={searchValue}
                                            />

                                            {searchValue && (
                                                <Button
                                                    className="absolute top-1/2 right-1 z-10 h-8 w-8 -translate-y-1/2 p-0"
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
                                                    size="sm"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <CloseIcon className="h-4 w-4" />
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
                                            | New Places API{' '}
                                            {isLoaded ? '✓' : '⏳'}
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
                                                    onClick={handleClear}
                                                    size="sm"
                                                    type="button"
                                                    variant="ghost"
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
                                            <p className="text-xs">
                                                <CopyTextButton
                                                    className="inline mr-2"
                                                    textContent={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                                                />
                                                share direction
                                            </p>
                                            <Button
                                                className="w-full bg-transparent"
                                                onClick={() => {
                                                    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`
                                                    window.open(
                                                        googleMapsUrl,
                                                        '_blank'
                                                    )
                                                }}
                                                size="sm"
                                                type="button"
                                                variant="outline"
                                            >
                                                <NavigationIcon className="mr-2 h-4 w-4" />
                                                Get Directions
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
                                                • Use &quot;Get Directions&quot;
                                                for quick selection
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div
                                    className={cn(
                                        'flex gap-2 border-t p-4',
                                        viewOnly && 'hidden'
                                    )}
                                >
                                    <Button
                                        className="flex-1 bg-transparent"
                                        onClick={handleCancel}
                                        type="button"
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        disabled={!selectedLocation}
                                        onClick={handleConfirm}
                                        type="button"
                                    >
                                        Confirm Location
                                    </Button>
                                </div>
                                <div
                                    className={cn(
                                        'flex gap-2 border-t p-4',
                                        !viewOnly && 'hidden'
                                    )}
                                >
                                    <Button
                                        className="flex-1 bg-transparent"
                                        onClick={handleCancel}
                                        type="button"
                                        variant="outline"
                                    >
                                        Close
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
