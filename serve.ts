/// <reference types="bun-types" />

const server = Bun.serve({
    port: process.env.PORT || 3000,
    async fetch(req) {
        const url = new URL(req.url)
        const path = url.pathname
        if (path === '/') {
            return new Response(Bun.file('./dist/index.html'))
        }
        const filePath = `./dist${path}`
        const file = Bun.file(filePath)

        if (await file.exists()) {
            return new Response(file)
        }
        if (!path.includes('.')) {
            return new Response(Bun.file('./dist/index.html'))
        }
        return new Response('Not Found', { status: 404 })
    },
})

console.log(`🚀 E-Coop Server live at ${server.url}`)
