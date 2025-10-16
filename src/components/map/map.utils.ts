export const redirectToGoogleMapsDirection = (
    lat: number,
    lng: number,
    openExternal = true
) => {
    const url = constructGoogleMapsDirectionUrl(lat, lng)

    window.open(url, openExternal ? '_blank' : '_self')
}

export const redirectToGoogleMapsView = (
    lat: number,
    lng: number,
    openExternal = true
) => {
    const url = constructGoogleMapsViewUrl(lat, lng)

    window.open(url, openExternal ? '_blank' : '_self')
}

export const constructGoogleMapsDirectionUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

export const constructGoogleMapsViewUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps?q=${lat},${lng}`
