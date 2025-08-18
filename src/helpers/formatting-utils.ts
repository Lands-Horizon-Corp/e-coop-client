export const abbreviateUUID = (uuid: string, abbrevLength = 7) => {
    if (uuid.length <= abbrevLength - 1) return uuid

    const cleanedUUID = uuid.replace(/-/g, '')
    return cleanedUUID.substring(0, abbrevLength)
}
