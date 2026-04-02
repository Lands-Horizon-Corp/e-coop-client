import axios from 'axios'

export const getFileNameFromUrl = (url: string): string => {
    try {
        const cleanUrl = url.split('?')[0]
        const parts = cleanUrl.split('/')
        const lastSegment = parts[parts.length - 1]
        return lastSegment || 'file'
    } catch {
        return 'file'
    }
}

export interface FetchedFile {
    blob: Blob
    fileName: string
}

export const fetchFileBlob = async (
    url: string,
    fallbackName?: string
): Promise<FetchedFile> => {
    const response = await fetch(url, { credentials: 'include' })

    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

    let fileName = fallbackName

    if (!fileName) {
        const contentDisposition = response.headers.get('content-disposition')
        if (contentDisposition) {
            const match = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            )
            if (match?.[1]) fileName = match[1].replace(/['"]/g, '')
        }
    }

    if (!fileName) fileName = getFileNameFromUrl(url)

    if (!fileName || fileName === 'file') {
        const timestamp = new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[:T]/g, '-')
        fileName = `file-${timestamp}`
    }

    const blob = await response.blob()
    return { blob, fileName }
}

export const triggerBrowserDownload = (
    url: string,
    fileName?: string
): void => {
    const a = document.createElement('a')
    a.href = url

    a.download = fileName || ''

    a.target = '_blank'
    a.rel = 'noopener noreferrer'

    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
        a.remove()
    }, 100)
}

type DownloadMode = 'fetch' | 'native'
// native dahil hayan natin browser mag manage ng download sige
// fetch kapag gusto natin ifetch sa local then download directly

interface DownloadOptions {
    url: string
    fallbackName?: string
    mode?: DownloadMode
}

export const downloadFileService = async ({
    url,
    fallbackName,
    mode = 'fetch',
}: DownloadOptions): Promise<void> => {
    const fileName = fallbackName || getFileNameFromUrl(url)

    if (mode === 'native') {
        triggerBrowserDownload(url, fileName)
        return
    }

    try {
        // const response = await fetch(url, { credentials: 'include' })
        const response = await axios.get(url, {
            responseType: 'blob',
        })

        // if (!response.status )
        //     throw new Error(`Fetch failed: ${response.statusText}`)

        const blob = new Blob([response.data])
        const blobUrl = window.URL.createObjectURL(blob)

        triggerBrowserDownload(blobUrl, fileName)

        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
    } catch (error) {
        console.error('Download via fetch failed:', error)
        throw error
    }
}
