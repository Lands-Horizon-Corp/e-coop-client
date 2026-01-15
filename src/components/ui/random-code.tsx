import { useEffect, useState } from 'react'

import { cn } from '@/helpers'

interface RandomCodeProps {
    className?: string
    length?: number
    speed?: number
    codeType?: 'binary' | 'hex' | 'alphanumeric' | 'symbols'
}

export const RandomCode = ({
    className,
    length = 20,
    speed = 50,
    codeType = 'alphanumeric',
}: RandomCodeProps) => {
    const [code, setCode] = useState('')

    const charSets = {
        binary: '01',
        hex: '0123456789ABCDEF',
        alphanumeric:
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        symbols:
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?',
    }

    const chars = charSets[codeType]

    useEffect(() => {
        const interval = setInterval(() => {
            const randomCode = Array.from({ length }, () =>
                chars.charAt(Math.floor(Math.random() * chars.length))
            ).join('')
            setCode(randomCode)
        }, speed)

        return () => clearInterval(interval)
    }, [length, speed, chars])

    return (
        <span className={cn('font-mono text-sm opacity-60', className)}>
            {code}
        </span>
    )
}
