import { downloadFile } from '@/helpers'

import { IMedia } from '.'

export const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const sizeUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2)
    return `${formattedSize} ${sizeUnits[i]}`
}

export interface FileInfo {
    fileName: string // filename without extension
    fullFileName: string // filename with extension
    fileType: string // mime type
    fileExtension: string // extension with dot (e.g., '.pdf')
}

/**
 * Extracts file information from either IMedia or File object
 * @param media - IMedia or File object
 * @returns FileInfo object containing fileName, fullFileName, and fileType
 */
export const getFileInfo = (media: {
    file_name?: string
    file_type?: string
    name?: string
    type?: string
}): FileInfo => {
    const fullFileName =
        media.file_name || (media as { name?: string }).name || ''
    const fileType = media.file_type || (media as { type?: string }).type || ''

    // Extract filename without extension
    const lastDotIndex = fullFileName.lastIndexOf('.')
    const fileName =
        lastDotIndex > 0
            ? fullFileName.substring(0, lastDotIndex)
            : fullFileName
    const fileExtension =
        lastDotIndex > 0 ? fullFileName.substring(lastDotIndex) : ''

    return {
        fileName,
        fullFileName,
        fileType,
        fileExtension,
    }
}

export const dataUrlToFile = (
    dataUrl: string,
    filename: string
): File | undefined => {
    const arr = dataUrl.split(',')
    if (arr.length < 2) {
        return undefined
    }

    const mimeArr = arr[0].match(/:(.*?);/)
    if (!mimeArr || mimeArr.length < 2) {
        return undefined
    }

    const mime = mimeArr[1]
    const byteString = atob(arr[1]) // Decode base64 string
    const byteNumbers = new Uint8Array(byteString.length)

    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i)
    }

    return new File([byteNumbers], filename, { type: mime })
}

type FileCategory =
    | 'audio'
    | 'video'
    | 'doc'
    | 'pdf'
    | 'sheet'
    | 'text'
    | 'image'
    | 'compressed'
    | 'code'
    | 'font'
    | 'ebook'
    | 'presentation'
    | 'unknown'

export const getFileCategory = (
    fileName: string,
    mimeType: string
): FileCategory => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    const fileTypes: Partial<Record<FileCategory, string[]>> = {
        // Audio files
        audio: [
            'mp3',
            'wav',
            'ogg',
            'aac',
            'flac',
            'm4a',
            'weba',
            'opus',
            'mid',
            'midi',
            'oga',
            '3gp',
            '3g2',
            'cda',
        ],
        // Video files
        video: [
            'mp4',
            'mkv',
            'avi',
            'mov',
            'wmv',
            'flv',
            'webm',
            'ogv',
            'mpeg',
            'mpg',
            '3gp',
            '3g2',
            'ts',
        ],
        // Document files
        doc: ['doc', 'docx', 'odt', 'rtf', 'wps', 'abw', 'pages'],
        // PDF files
        pdf: ['pdf'],
        // Spreadsheet files
        sheet: ['xls', 'xlsx', 'csv', 'ods', 'numbers'],
        // Text/code files
        text: ['txt', 'log', 'md', 'markdown', 'text'],
        // Code files
        code: [
            'html',
            'htm',
            'css',
            'js',
            'mjs',
            'ts',
            'tsx',
            'jsx',
            'json',
            'jsonld',
            'xml',
            'xhtml',
            'php',
            'sh',
            'csh',
            'java',
            'py',
            'c',
            'cpp',
            'h',
            'cs',
            'go',
            'rb',
            'rs',
            'swift',
            'kt',
            'scala',
            'sql',
            'yaml',
            'yml',
            'xul',
        ],
        // Image files
        image: [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'bmp',
            'svg',
            'webp',
            'apng',
            'avif',
            'ico',
            'tif',
            'tiff',
        ],
        // Compressed/Archive files
        compressed: [
            'zip',
            'rar',
            '7z',
            'tar',
            'gz',
            'bz',
            'bz2',
            'xz',
            'tgz',
            'tar.gz',
            'tar.bz2',
            'arc',
            'jar',
        ],
        // Font files
        font: ['ttf', 'otf', 'woff', 'woff2', 'eot'],
        // eBook files
        ebook: ['epub', 'azw', 'mobi'],
        // Presentation files
        presentation: ['ppt', 'pptx', 'odp', 'key'],
    }

    for (const [category, extensions] of Object.entries(fileTypes)) {
        if (fileExtension && extensions?.includes(fileExtension)) {
            return category as FileCategory
        }
    }

    // MIME type fallbacks
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('font/')) return 'font'
    if (mimeType.startsWith('text/')) {
        // Check if it's code
        if (
            mimeType.includes('javascript') ||
            mimeType.includes('html') ||
            mimeType.includes('css') ||
            mimeType.includes('xml') ||
            mimeType === 'application/json' ||
            mimeType === 'application/ld+json'
        )
            return 'code'
        return 'text'
    }

    // Document types
    if (mimeType === 'application/pdf') return 'pdf'

    if (
        mimeType.includes('word') ||
        mimeType.includes('document') ||
        mimeType === 'application/rtf' ||
        mimeType === 'application/x-abiword'
    )
        return 'doc'

    if (
        mimeType.includes('sheet') ||
        mimeType.includes('excel') ||
        mimeType === 'text/csv' ||
        mimeType.includes('spreadsheet')
    )
        return 'sheet'

    if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
        return 'presentation'

    // Archive/Compressed types
    if (
        mimeType.includes('zip') ||
        mimeType.includes('compressed') ||
        mimeType.includes('archive') ||
        mimeType === 'application/x-freearc' ||
        mimeType === 'application/vnd.rar' ||
        mimeType === 'application/x-7z-compressed' ||
        mimeType === 'application/x-tar' ||
        mimeType === 'application/gzip' ||
        mimeType === 'application/x-gzip' ||
        mimeType === 'application/x-bzip' ||
        mimeType === 'application/x-bzip2' ||
        mimeType === 'application/java-archive'
    )
        return 'compressed'

    // eBook formats
    if (
        mimeType === 'application/epub+zip' ||
        mimeType === 'application/vnd.amazon.ebook'
    )
        return 'ebook'

    return 'unknown'
}

export const getFileType = (file: File): FileCategory => {
    return getFileCategory(file.name, file.type)
}

export type TDownloadMediaProp = File | string | IMedia

export const downloadMedia = (media: TDownloadMediaProp) => {
    if (!(media instanceof File) && typeof media !== 'string') {
        downloadFile(media.download_url, media.file_name || 'download')
    } else if (media) {
        // Download blob for local files
        const link = document.createElement('a')
        link.href = media instanceof File ? URL.createObjectURL(media) : media
        link.download = media instanceof File ? media.name : 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
