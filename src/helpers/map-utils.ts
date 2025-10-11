export interface LocationCoordinates {
    lat: number
    lng: number
}

/**
 * Gets the user's current location using the Geolocation API
 * Falls back to a default location if permission is denied or unavailable
 */
export async function getCurrentLocation(): Promise<LocationCoordinates> {
    // Default location (you can change this to your preferred default)
    const defaultLocation: LocationCoordinates = {
        lat: 40.7128, // New York City
        lng: -74.006,
    }

    return new Promise((resolve) => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser')
            resolve(defaultLocation)
            return
        }

        // Get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            },
            (error) => {
                console.warn('Error getting location:', error.message)
                resolve(defaultLocation)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 300000, // 5 minutes
            }
        )
    })
}

/**
 * Gets the user's current location with custom default coordinates
 */
export async function getCurrentLocationWithDefault(
    defaultLat: number,
    defaultLng: number
): Promise<LocationCoordinates> {
    const customDefault: LocationCoordinates = {
        lat: defaultLat,
        lng: defaultLng,
    }

    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(customDefault)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            },
            () => resolve(customDefault),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        )
    })
}
