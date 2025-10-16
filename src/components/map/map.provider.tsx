import React, { createContext, useContext, useState } from 'react'

import { toast } from 'sonner'

import { GOOGLE_MAPS_API_KEY } from '@/constants'
import { LoadScript } from '@react-google-maps/api'

type MapProviderState = {
    map: google.maps.Map | null
    isLoaded: boolean
    loadError: boolean
    errorMessage?: string | undefined
}

const initialState: MapProviderState = {
    map: null,
    isLoaded: false,
    loadError: false,
}

export const MapProviderContext = createContext<MapProviderState>(initialState)

export const useMap = () => {
    const context = useContext(MapProviderContext)

    if (!context) throw new Error('This hook must be used within map provider')

    return context
}

export const MapProvider = ({
    children,
    ...props
}: {
    children: React.ReactNode
}) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [map] = useState<google.maps.Map | null>(null)

    let errorMessage: string | undefined

    if (!GOOGLE_MAPS_API_KEY) {
        errorMessage = 'Google Maps API key is missing'
    }

    if (loadError) {
        errorMessage = 'Failed to load Google Maps'
    }

    return (
        <MapProviderContext.Provider
            {...props}
            value={{ map, isLoaded, loadError, errorMessage }}
        >
            <LoadScript
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                loadingElement={<></>}
                onError={() => {
                    toast.error('Failed to load map, maps may display error.')
                    setLoadError(true)
                }}
                onLoad={() => setIsLoaded(true)}
            >
                {children}
            </LoadScript>
        </MapProviderContext.Provider>
    )
}

export default MapProvider
