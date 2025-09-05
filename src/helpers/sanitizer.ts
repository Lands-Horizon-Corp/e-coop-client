import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
}
