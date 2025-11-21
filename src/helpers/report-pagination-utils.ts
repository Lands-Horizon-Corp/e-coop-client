/**
 * Report Pagination Utilities
 * Handles chunking data into pages for multi-page reports
 */

export type TPaperSize = 'A4' | 'Letter' | 'Legal'

/**
 * Items per page based on paper size
 * Accounts for header, footer, and margins
 */
export const ITEMS_PER_PAGE: Record<TPaperSize, number> = {
    A4: 15, // A4: 297mm height = ~15 rows at 12px font
    Letter: 14, // Letter: 11in height = ~14 rows
    Legal: 20, // Legal: 14in height = ~20 rows
}

/**
 * Chunk an array into multiple pages
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items per page
 * @returns Array of pages, each containing items for that page
 */
export const chunkItems = <T>(items: T[], itemsPerPage: number): T[][] => {
    const pages: T[][] = []

    for (let i = 0; i < items.length; i += itemsPerPage) {
        pages.push(items.slice(i, i + itemsPerPage))
    }

    return pages
}

/**
 * Transform data for multi-page template rendering
 * @param data - Raw data object with items array
 * @param paperSize - Paper size (determines items per page)
 * @returns Transformed data with pages array and metadata
 */
export const transformDataForMultiPage = <T extends { items?: any[] }>(
    data: T,
    paperSize: TPaperSize = 'A4'
): T & {
    pages: any[][]
    totalPages: number
    itemsPerPage: number
} => {
    const items = data.items || []
    const itemsPerPage = ITEMS_PER_PAGE[paperSize]
    const pages = chunkItems(items, itemsPerPage)

    return {
        ...data,
        pages,
        totalPages: pages.length,
        itemsPerPage,
    }
}

/**
 * Calculate how many pages will be needed
 * @param itemCount - Total number of items
 * @param paperSize - Paper size
 * @returns Number of pages needed
 */
export const calculatePageCount = (
    itemCount: number,
    paperSize: TPaperSize = 'A4'
): number => {
    const itemsPerPage = ITEMS_PER_PAGE[paperSize]
    return Math.ceil(itemCount / itemsPerPage)
}

/**
 * Format page information for display
 * @param currentPage - Current page number (1-indexed)
 * @param totalPages - Total number of pages
 * @returns Formatted string like "Page 1 of 5"
 */
export const formatPageInfo = (
    currentPage: number,
    totalPages: number
): string => {
    return `Page ${currentPage} of ${totalPages}`
}

/**
 * Get pagination metadata
 * @param items - Array of items
 * @param paperSize - Paper size
 * @returns Pagination metadata
 */
export const getPaginationMetadata = <T>(
    items: T[],
    paperSize: TPaperSize = 'A4'
): {
    itemCount: number
    pageCount: number
    itemsPerPage: number
    hasMultiplePages: boolean
} => {
    const itemsPerPage = ITEMS_PER_PAGE[paperSize]
    const pageCount = Math.ceil(items.length / itemsPerPage)

    return {
        itemCount: items.length,
        pageCount,
        itemsPerPage,
        hasMultiplePages: pageCount > 1,
    }
}

/**
 * Estimate memory usage for multi-page report
 * Helps determine if backend pagination is needed
 * @param itemCount - Total items
 * @param estimatedItemSize - Average size per item in bytes (default: 500 bytes)
 * @returns Object with memory estimate and recommendation
 */
export const estimateMemoryUsage = (
    itemCount: number,
    estimatedItemSize: number = 500
): {
    bytes: number
    kilobytes: number
    megabytes: number
    recommendBackendPagination: boolean
} => {
    const bytes = itemCount * estimatedItemSize
    const kilobytes = bytes / 1024
    const megabytes = kilobytes / 1024

    // Recommend backend pagination if > 50MB
    const recommendBackendPagination = megabytes > 50

    return {
        bytes,
        kilobytes,
        megabytes,
        recommendBackendPagination,
    }
}

/**
 * Validate paper size
 * @param paperSize - Paper size to validate
 * @returns True if valid, false otherwise
 */
export const isValidPaperSize = (
    paperSize: string
): paperSize is TPaperSize => {
    return paperSize in ITEMS_PER_PAGE
}

/**
 * Get all valid paper sizes
 * @returns Array of valid paper size options
 */
export const getPaperSizeOptions = (): TPaperSize[] => {
    return Object.keys(ITEMS_PER_PAGE) as TPaperSize[]
}
