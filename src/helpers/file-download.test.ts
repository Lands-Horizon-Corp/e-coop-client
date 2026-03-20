import { describe, expect, it } from 'vitest'

import { getFileNameFromUrl } from './file-download'

describe('getFileNameFromUrl', () => {
    it('extracts filename from a simple URL', () => {
        const url = 'https://example.com/assets/report.pdf'
        expect(getFileNameFromUrl(url)).toBe('report.pdf')
    })

    it('strips query parameters before extracting filename', () => {
        const url =
            'https://s3.amazonaws.com/bucket/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&expires=3600'
        expect(getFileNameFromUrl(url)).toBe('image.png')
    })

    it('handles URLs with multiple path segments', () => {
        const url = 'http://localhost:3000/api/v1/downloads/data.csv'
        expect(getFileNameFromUrl(url)).toBe('data.csv')
    })

    it('returns "file" if the URL ends with a trailing slash', () => {
        const url = 'https://example.com/folder/'
        expect(getFileNameFromUrl(url)).toBe('file')
    })

    it('returns "file" for invalid or empty strings', () => {
        expect(getFileNameFromUrl('')).toBe('file')
        expect(getFileNameFromUrl(null as unknown as string)).toBe('file')
    })
})
