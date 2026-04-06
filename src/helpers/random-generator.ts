export const randomGenerator = async (prefix: string = ''): Promise<string> => {
    const now = new Date()

    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')

    const date = `${yyyy}${mm}${dd}`
    const raw = `${prefix}${date}_${crypto.randomUUID()}`

    const encoder = new TextEncoder()
    const data = encoder.encode(raw)

    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return hashHex
}

export const randomSyncGenerator = (prefix: string = ''): string => {
    const raw = `${prefix}${Date.now()}_${crypto.randomUUID()}`

    // 64-bit mix (two states)
    let h1 = 0xdeadbeef ^ raw.length
    let h2 = 0x41c6ce57 ^ raw.length

    for (let i = 0; i < raw.length; i++) {
        const ch = raw.charCodeAt(i)

        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }

    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909)

    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0')

    // Expand to 64 chars by mixing variations
    const part1 = toHex(h1)
    const part2 = toHex(h2)
    const part3 = toHex(h1 ^ h2)
    const part4 = toHex(h1 + h2)
    const part5 = toHex(Math.imul(h1, h2))
    const part6 = toHex(h1 ^ (h2 >>> 1))
    const part7 = toHex(h2 ^ (h1 >>> 1))
    const part8 = toHex(h1 - h2)

    return (
        part1 +
        part2 +
        part3 +
        part4 +
        part5 +
        part6 +
        part7 +
        part8
    ).slice(0, 64)
}
