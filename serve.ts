/// <reference types="bun-types" />

const server = Bun.serve({
    port: process.env.PORT || 3000,
    async fetch(req) {
        const url = new URL(req.url)
        const path = url.pathname
        const filePath = path === '/' ? './dist/index.html' : `./dist${path}`
        const file = Bun.file(filePath)
        if (await file.exists()) {
            return new Response(file, {
                headers: {
                    'Content-Type': file.type,
                    'Cache-Control': path.includes('/assets/')
                        ? 'public, max-age=31536000, immutable'
                        : 'no-cache',
                },
            })
        }
        if (!path.includes('.')) {
            return new Response(Bun.file('./dist/index.html'), {
                headers: { 'Content-Type': 'text/html' },
            })
        }

        return new Response('Not Found', { status: 404 })
    },
})

console.log(`🚀 E-Coop Server live at ${server.url}`)
