'use client'

import React, { forwardRef, useCallback, useEffect, useRef } from 'react'

import { cn } from '@/helpers/tw-utils'
import { useTheme } from '@/modules/settings/provider/theme-provider'
import { GoogleMap, type GoogleMapProps } from '@react-google-maps/api'

import { IBaseProps } from '@/types'

import { SadFaceIcon } from '../icons'
import { useMap } from './map.provider'
import { constructGoogleMapsViewUrl } from './map.utils'

export interface MapLocation {
    lat: number
    lng: number
    title?: string
}

export interface MapViewProps extends GoogleMapProps {
    viewOnly?: boolean
    locations: MapLocation[]
    height?: string
    width?: string
    zoom?: number
    selectedLocation?: `${number}-${number}`
    onLocationSelect?: (location: MapLocation) => void
    showActions?: boolean
    className?: string
    mapContainerClassName?: string
    style?: React.CSSProperties
    mapOptions?: google.maps.MapOptions
    children?: React.ReactNode
}

const defaultMapContainerStyle: React.CSSProperties = {
    width: '100%',
}

export const MapView: React.FC<MapViewProps> = ({
    locations,
    zoom = 10,
    selectedLocation,
    onLocationSelect,
    viewOnly = false,
    className,
    style,
    mapContainerClassName,
    mapOptions = {
        fullscreenControl: false,
        zoomControl: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        streetViewControl: false,
    },
    ...props
}) => {
    const { isLoaded, loadError, errorMessage } = useMap()

    const { resolvedTheme } = useTheme()
    const mapRef = useRef<google.maps.Map | null>(null)
    const markersRef = useRef<
        Map<`${number}-${number}`, google.maps.marker.AdvancedMarkerElement>
    >(new Map())

    // Calculate center from locations
    const center = React.useMemo(() => {
        if (locations.length === 0) {
            return { lat: 0, lng: 0 }
        }

        if (locations.length === 1) {
            return { lat: locations[0].lat, lng: locations[0].lng }
        }

        // Calculate center manually for multiple locations
        const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0)
        const lngSum = locations.reduce((sum, loc) => sum + loc.lng, 0)

        return {
            lat: latSum / locations.length,
            lng: lngSum / locations.length,
        }
    }, [locations])

    // Create bounds after Google Maps is loaded
    const createBounds = useCallback(() => {
        if (!window.google?.maps || locations.length <= 1) {
            return null
        }

        const bounds = new window.google.maps.LatLngBounds()
        locations.forEach((location) => {
            bounds.extend({ lat: location.lat, lng: location.lng })
        })

        return bounds
    }, [locations])

    const createMarkers = useCallback(async () => {
        if (
            !mapRef.current ||
            !window.google?.maps ||
            !isLoaded ||
            locations.length === 0
        )
            return

        // Clear existing markers
        markersRef.current.forEach((marker) => {
            marker.map = null
        })
        markersRef.current.clear()

        try {
            // Import the marker library dynamically
            const { AdvancedMarkerElement, PinElement } =
                (await window.google.maps.importLibrary(
                    'marker'
                )) as google.maps.MarkerLibrary

            // Create markers for each location
            locations.forEach((location) => {
                // Create pin element with custom styling
                const pinElement = new PinElement({
                    background: '#ef4444',
                    borderColor: '#dc2626',
                    glyphColor: 'white',
                    scale: 1,
                })

                const marker = new AdvancedMarkerElement({
                    map: mapRef.current,
                    position: { lat: location.lat, lng: location.lng },
                    title: location.title,
                    content: pinElement.element,
                })

                // Add click listener to marker
                marker.addListener('click', () => {
                    onLocationSelect?.(location)
                })

                markersRef.current.set(
                    `${location.lat}-${location.lng}`,
                    marker
                )
            })

            // Focus on selected location if provided
            if (selectedLocation) {
                const selectedLoc = locations.find(
                    (loc) => `${loc.lat}-${loc.lng}` === selectedLocation
                )
                if (selectedLoc && mapRef.current) {
                    mapRef.current.panTo({
                        lat: selectedLoc.lat,
                        lng: selectedLoc.lng,
                    })
                    mapRef.current.setZoom(15)
                }
            }
        } catch {
            // Silently handle marker creation failure
            // The map will still be functional without the markers
        }
    }, [locations, selectedLocation, onLocationSelect, isLoaded])

    const onMapLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map

            // Fit bounds if multiple locations
            if (locations.length > 1) {
                const bounds = createBounds()
                if (bounds) {
                    map.fitBounds(bounds, 50)
                }
            }

            // Create markers after a short delay
            setTimeout(() => createMarkers(), 100)
        },
        [locations.length, createBounds, createMarkers]
    )

    // Update markers when locations or selection changes
    useEffect(() => {
        if (isLoaded && mapRef.current) {
            createMarkers()
        }
    }, [locations, selectedLocation, createMarkers, isLoaded])

    // Cleanup on unmount
    useEffect(() => {
        const t = markersRef.current

        return () => {
            t.forEach((marker) => {
                marker.map = null
            })
            t.clear()
        }
    }, [])

    const mapContainerStyle: React.CSSProperties = {
        ...defaultMapContainerStyle,
        ...style,
    }

    return (
        <div
            className={cn(
                'size-full rounded-md overflow-clip',
                className,
                viewOnly && 'pointer-events-none'
            )}
        >
            {errorMessage && (
                <div className="text-center size-full flex items-center justify-center">
                    <div>
                        <SadFaceIcon />
                        <p className="text-sm text-center px-4 py-1 rounded-md text-muted-foreground">
                            {errorMessage}
                        </p>
                    </div>
                </div>
            )}
            {!isLoaded && !loadError && (
                <div className="text-center size-full flex items-center justify-center">
                    <div>
                        <div className="border-primary mx-auto mb-2 size-4 animate-spin rounded-full border-b-2" />
                        <p className="text-sm">Loading map...</p>
                    </div>
                </div>
            )}
            {isLoaded && !loadError && (
                <>
                    <GoogleMap
                        center={center}
                        key={resolvedTheme}
                        mapContainerClassName={cn(
                            'size-full',
                            mapContainerClassName
                        )}
                        mapContainerStyle={mapContainerStyle}
                        onLoad={onMapLoad}
                        options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                            gestureHandling: 'cooperative' as const,
                            clickableIcons: false,
                            colorScheme: resolvedTheme.toUpperCase(),
                            mapId: '7315fed6ff6d5145e4c926ff',
                            ...mapOptions,
                        }}
                        zoom={zoom}
                        {...props}
                    />

                    {viewOnly && (
                        <div className="absolute size-full inset-0 z-50 bg-black-400" />
                    )}
                </>
            )}
        </div>
    )
}

export const OpenExternalMap = forwardRef<
    HTMLAnchorElement,
    IBaseProps & {
        lon: number
        lat: number
    }
>(({ lon, lat, className, ...props }, ref) => {
    return (
        <a
            className={cn('', className)}
            href={constructGoogleMapsViewUrl(lat, lon)}
            ref={ref}
            target="_blank"
            {...props}
        />
    )
})

export default MapView
