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

export const getEnv = <T>(key: string, fallback: T): T => {
    const normalizedKey = key.trim().toUpperCase()
    if (
        typeof import.meta !== 'undefined' &&
        import.meta.env?.[normalizedKey] !== undefined
    ) {
        return import.meta.env[normalizedKey] as unknown as T
    }
    if (
        typeof process !== 'undefined' &&
        process.env?.[normalizedKey] !== undefined
    ) {
        return process.env[normalizedKey] as unknown as T
    }
    if (
        typeof window !== 'undefined' &&
        (window as any)._ENV_?.[normalizedKey] !== undefined
    ) {
        return (window as any)._ENV_[normalizedKey] as T
    }
    return fallback
}
