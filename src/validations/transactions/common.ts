import { sanitizeNumberInput } from '@/helpers'
import { z } from 'zod'

export const amountPreprocess = z.preprocess(
    (val) => {
        console.log(val)
        if (typeof val === 'string') {
            const sanitized = sanitizeNumberInput(val)

            if ((sanitized.match(/\./g)?.length ?? 0) > 1) {
                console.warn('Too many decimals!')
                return undefined
            }

            const parsed = parseFloat(sanitized)
            if (sanitized === '' || isNaN(parsed) || parsed === 0) {
                console.warn('Invalid or zero amount:', sanitized)
                return undefined
            }
            return parsed
        }

        if (typeof val === 'number' && !isNaN(val) && val !== 0) {
            return val
        }
        console.warn('Invalid number input:', val)
    },
    z
        .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .optional()
)
