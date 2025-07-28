import { useCallback, useEffect, useRef, useState } from 'react'

import logger from '@/helpers/loggers/logger'
import { cn } from '@/lib'
import { Pin, TMainMapProps, TMapWithClickProps } from '@/types/components'
import L, { LatLngExpression, latLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    ZoomControl,
    useMapEvent,
} from 'react-leaflet'

import LayerControl from './layer-control'
import MapSearch from './map-search'

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

    const handleMapReady = useCallback((mapInstance: L.Map | null) => {
        setMap(mapInstance)
    }, [])

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
                    onCoordinateClick(latLng as L.LatLngLiteral)
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
        if (handleMapReady) {
            handleMapReady(map)
        }
        if (map && defaultMarkerPins.length > 0) {
            const container = map.getContainer()
            const layerControlElement = container.querySelector(
                '.leaflet-control-layers.leaflet-control'
            ) as HTMLElement | null

            if (layerControlElement) {
                if (hideLayersControl) {
                    layerControlElement.classList.add('hidden')
                } else {
                    layerControlElement.classList.remove('hidden')
                }
            }

            defaultMarkerPins.forEach(({ lat, lng }) => {
                const latLng: LatLngExpression = { lat, lng }
                const markerKey = `${lat},${lng}`

                if (!markerRefs.current[markerKey]) {
                    const marker = L.marker(latLng).addTo(map)
                    markerRefs.current[markerKey] = marker
                }
            })
        }
    }, [map, defaultMarkerPins, handleMapReady, hideLayersControl])

    return (
        <div
            className={cn(
                'relative flex w-full flex-col gap-4',
                viewOnly ? 'p-0' : 'p-5 shadow-sm',
                className
            )}
        >
            {!viewOnly && (
                <MapSearch
                    onLocationFound={handleLocationFound}
                    map={map}
                    className={searchClassName}
                    setSearchedAddress={setSearchedAddress}
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
                    `!z-0 size-full flex-grow rounded-lg`,
                    mapContainerClassName
                )}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LayerControl />
                <MapWithClick onLocationFound={handleLocationFound} />
                {!hideControls && <ZoomControl position="bottomright" />}
                {children}
            </MapContainer>
        </div>
    )
}

export default Map
