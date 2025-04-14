import L, { LatLngExpression } from 'leaflet'
import { SetStateAction, Dispatch } from 'react'
import { MapContainerProps } from 'react-leaflet'

interface TSearchableProps {
    searchedAddress?: string
    setSearchedAddress?: Dispatch<SetStateAction<string>>
}

export interface Pin {
    id: number
    position: LatLngExpression
}

export interface TCustomSearchProps extends TSearchableProps {
    onLocationFound: (latLng: LatLngExpression) => void
    map: L.Map | null
    className?: string
}

export interface TLatLngExpressionWithDesc {
    lat: string
    lng: string
    desc: string
}

export interface TMainMapProps extends Partial<MapContainerProps> {
    viewOnly?: boolean
    multiplePins?: boolean
    hideControls?: boolean
    markerPosition?: { x: number; y: number }
    onCoordinateClick?: (coords: LatLngExpression) => void
    onMultipleCoordinatesChange?: (coords: LatLngExpression[]) => void
    defaultMarkerPins?: { lat: number; lng: number }[]
    searchClassName?: string
    hideLayersControl?: boolean
    mapContainerClassName?: string
}

export interface TMapProps {
    handleMapCreated?: (map: L.Map) => void
}

export interface TMapWithClickProps {
    onLocationFound: (latLng: LatLngExpression) => void
}
