import DOMPurify from 'dompurify'

function decodeEntities(str: string): string {
    let prev: string;
    do {
        prev = str;
        str = str
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    } while (str !== prev);
    return str;
}

export const sanitizeHtml = (html: string): string => {
    return decodeEntities(
        DOMPurify.sanitize(html)
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
    );
}
