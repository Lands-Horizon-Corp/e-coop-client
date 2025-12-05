import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import Handlebars from 'handlebars'

let helpersRegistered = false

const registerHandlebarsHelpers = () => {
    if (helpersRegistered) return

    Handlebars.registerHelper('inc', (num) =>
        typeof num === 'number' ? num + 1 : 1
    )

    Handlebars.registerHelper('eq', (a, b) => a === b)

    Handlebars.registerHelper('equals', (a, b) => a === b)

    Handlebars.registerHelper('add', (a, b) => {
        const na = Number(a) || 0
        const nb = Number(b) || 0
        return na + nb
    })

    Handlebars.registerHelper('object-keys', (obj) => {
        return Object.keys(obj || {})
    })

    Handlebars.registerHelper('lookup', (obj, field) => {
        return obj?.[field]
    })

    Handlebars.registerHelper('first', (arr) => {
        return arr?.[0]
    })

    helpersRegistered = true
}

registerHandlebarsHelpers()

export default function HbsCompiler<TData>({
    templatePath,
    data,
    onHtmlReady,
}: {
    templatePath?: string
    data?: TData
    onHtmlReady?: (html: string) => void
}) {
    const [html, setHtml] = useState('')
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
                const compiled = Handlebars.compile(raw)
                const result = compiled(data ?? {})
                setHtml(result)
                setError(null)
                onHtmlReady?.(result)
            })
            .catch((err) => {
                toast.error('❌ HbsCompiler error:', err)
                setError(String(err?.message ?? err))
            })
    }, [templatePath, data, onHtmlReady])

    if (error) {
        return (
            <div className="p-4 bg-destructive/10 text-destructive rounded border border-destructive">
                <strong>Template Error:</strong> {error}
            </div>
        )
    }

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: html,
            }}
            style={{ isolation: 'isolate' }}
        />
    )
}
