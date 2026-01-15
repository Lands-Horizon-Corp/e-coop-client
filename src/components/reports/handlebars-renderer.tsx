import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import Handlebars from 'handlebars'

let helpersRegistered = false

const registerHandlebarsHelpers = () => {
    if (helpersRegistered) return

    // Increment helper for page numbering (converts 0-based to 1-based)
    Handlebars.registerHelper('inc', (num) =>
        typeof num === 'number' ? num + 1 : 1
    )

    // Equality helper for conditionals
    Handlebars.registerHelper('eq', (a, b) => a === b)

    // Add helper to perform numeric addition (useful for page offsets)
    Handlebars.registerHelper('add', (a, b) => {
        const na = Number(a) || 0
        const nb = Number(b) || 0
        return na + nb
    })

    // Object keys helper for iterating object keys
    Handlebars.registerHelper('object-keys', (obj) => {
        return Object.keys(obj || {})
    })

    // Lookup helper for dynamic property access
    Handlebars.registerHelper('lookup', (obj, field) => {
        return obj?.[field]
    })

    // First helper to get first item of array
    Handlebars.registerHelper('first', (arr) => {
        return arr?.[0]
    })

    helpersRegistered = true
}

registerHandlebarsHelpers()

export default function HbsRenderer({
    templatePath,
    onHtmlReady,
}: {
    templatePath?: string
    onHtmlReady?: (template: string) => void
}) {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!templatePath) {
            setError('No templatePath provided')
            return
        }

        fetch(templatePath)
            .then((res) => {
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
                return res.text()
            })
            .then((raw) => {
                setError(null)
                onHtmlReady?.(raw)
            })
            .catch((err) => {
                toast.error('❌ HbsRenderer error:', err)
                setError(String(err?.message ?? err))
            })
    }, [templatePath, onHtmlReady])

    if (error) {
        toast.error('❌ HbsRenderer error:')
        return null
    }
}
