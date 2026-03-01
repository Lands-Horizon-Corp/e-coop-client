import { getCsrfTokenFromCookies, getGeoHeaders, httpClient } from './client'

type StreamHandlers<TProcess, TEnd> = {
    // onStarted is now just a notification that the stream is open
    onStarted?: () => void
    onProcess?: (data: TProcess) => void
    onEnd?: (data: TEnd) => void
}

export const streamer = async <
    D = unknown, // Request Data
    TProcess = unknown, // Progress Event Data
    TEnd = unknown, // Final Return Data
>(
    url: string,
    data: D,
    handlers: StreamHandlers<TProcess, TEnd>,
    config?: {
        params?: Record<string, any>
        headers?: Record<string, string>
        signal?: AbortSignal
    }
) => {
    const baseUrl = httpClient.defaults.baseURL || ''
    const fullUrl = url.startsWith('http')
        ? url
        : `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
    const queryString = config?.params
        ? `?${new URLSearchParams(config.params).toString()}`
        : ''
    const csrfToken = getCsrfTokenFromCookies()
    const geoHeaders = getGeoHeaders()
    const response = await fetch(`${fullUrl}${queryString}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...geoHeaders,
            ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
            ...(typeof navigator !== 'undefined' && {
                'X-User-Agent': navigator.userAgent,
            }),
            ...config?.headers,
        },
        body: JSON.stringify(data),
        credentials: 'include',
        signal: config?.signal,
    })
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Stream failed: ${response.status}`)
    }
    if (!response.body) return
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    try {
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed) continue
                const parsed = JSON.parse(trimmed)
                switch (parsed.state) {
                    case 'started':
                        handlers.onStarted?.()
                        break
                    case 'process':
                        handlers.onProcess?.(parsed.data)
                        break
                    case 'end':
                        handlers.onEnd?.(parsed.data)
                        break
                    case 'error':
                        throw new Error(
                            parsed.message || 'An unknown stream error occurred'
                        )
                }
            }
        }
    } finally {
        reader.releaseLock()
    }
}
