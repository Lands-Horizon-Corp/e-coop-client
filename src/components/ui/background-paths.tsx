'use client'

import { ReactNode } from 'react'

import { motion } from 'framer-motion'

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }))
    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-foreground"
                fill="none"
                viewBox="0 0 696 316"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        d={path.d}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        key={path.id}
                        stroke="currentColor"
                        strokeOpacity={0.1 + path.id * 0.03}
                        strokeWidth={path.width}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

export interface BackgroundPathsProps {
    children: ReactNode
    className?: string
    fullHeight?: boolean
    animateContent?: boolean
}

export function BackgroundPaths({
    children,
    className = '',
    fullHeight = true,
    animateContent = false,
}: BackgroundPathsProps) {
    const containerClasses = `
        relative w-full flex items-center justify-center overflow-hidden 
        ${fullHeight ? 'min-h-full' : ''}
        ${className}
    `.trim()

    const content = animateContent ? (
        <motion.div
            animate={{ opacity: 1 }}
            className="w-full"
            initial={{ opacity: 0 }}
            transition={{ duration: 2 }}
        >
            {children}
        </motion.div>
    ) : (
        children
    )

    return (
        <div className={containerClasses}>
            {/* Background animated paths */}
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 w-full">{content}</div>
        </div>
    )
}
