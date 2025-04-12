// Helper to generate random salt
function generateSalt(length: number = 16): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let salt = ''
    for (let i = 0; i < length; i++) {
        salt += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return salt
}

// Hashing function (using a simple HMAC with SHA-256)
async function hmac(message: string, key: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(key)
    const messageData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

// Encoder function with dynamic salt
export async function encode(message: string): Promise<string> {
    const secretKey = import.meta.env.VITE_CLIENT_SECRET_KEY
    const salt = generateSalt()
    const combinedMessage = message + salt

    // Generate HMAC signature
    const signature = await hmac(combinedMessage, secretKey)

    // Return Base64 encoded message with salt and signature
    const encodedMessage = btoa(combinedMessage + ':' + signature)
    return encodedMessage
}

// Decoder function with validation
export async function decode(encodedMessage: string): Promise<string> {
    const secretKey = import.meta.env.VITE_CLIENT_SECRET_KEY
    const decodedMessage = atob(encodedMessage)

    // Split message into original message + salt and the signature
    const [combinedMessage, signature] = decodedMessage.split(':')
    const originalMessage = combinedMessage.slice(0, -16) // The last 16 characters are the salt

    // Verify the signature
    const validSignature = await hmac(combinedMessage, secretKey)

    if (signature === validSignature) {
        return originalMessage
    } else {
        throw new Error('Invalid signature or message format')
    }
}
