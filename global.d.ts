// geo.ts - Utility to set window.currentGeo using the Geolocation API

declare global {
    interface Window {
        currentGeo?: {
            longitude?: number | string
            latitude?: number | string
            location?: string
            country?: string
        }
    }
}

export function setCurrentGeoFromBrowser(): void;