/// <reference types="bun-types" />

const server = Bun.serve({
    port: process.env.PORT || 8080,
    fetch(req) {
        const url = new URL(req.url)
        const path = url.pathname
        let file = Bun.file(`./dist${path}`)
        if (path === '/' || !file.size) {
            file = Bun.file('./dist/index.html')
        }
        return new Response(file)
    },
})
console.log(`🚀 E-Coop Server started on port: ${server.port}`)
