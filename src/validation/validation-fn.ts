// this files contains custom function that is used for custom validation like transform, etc..
import { sanitizeHtml } from '@/helpers/sanitizer'

export const descriptionTransformerSanitizer = <T>(val: T) => {
    if (typeof val === 'string') {
        return sanitizeHtml(val)
    }
    return val
}
