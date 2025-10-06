import imageCompression from 'browser-image-compression'

export const abbreviateUUID = (uuid: string, abbrevLength = 7) => {
    if (uuid.length <= abbrevLength - 1) return uuid

    const cleanedUUID = uuid.replace(/-/g, '')
    return cleanedUUID.substring(0, abbrevLength)
}

export const imageCompressed = async (file: File): Promise<File> => {
    let processedFile = file
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const isImage =
        imageTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith('.jpg') ||
        file.name.toLowerCase().endsWith('.jpeg') ||
        file.name.toLowerCase().endsWith('.png')

    if (isImage) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type,
            initialQuality: 0.8,
        }

        try {
            processedFile = await imageCompression(file, options)
        } catch {
            processedFile = file
        }
    }
    return processedFile
}
