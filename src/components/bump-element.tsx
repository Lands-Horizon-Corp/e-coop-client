import React, { forwardRef, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib'

interface BumpOnClickProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    duration?: number
    animationClass?: string
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onAnimationEnd?: () => void
}

const BumpOnClick = forwardRef<HTMLDivElement, BumpOnClickProps>(
    (
        {
            children,
            className = '',
            duration = 100,
            animationClass = 'animate-bump',
            onClick,
            onAnimationEnd,
            ...props
        },
        ref
    ) => {
        const [isBumping, setIsBumping] = useState(false)
        const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            if (isBumping) return

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            setIsBumping(true)

            timeoutRef.current = setTimeout(() => {
                setIsBumping(false)
                if (onAnimationEnd) {
                    onAnimationEnd()
                }
            }, duration)

            if (onClick) {
                onClick(event)
            }
        }

        useEffect(() => {
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }
            }
        }, [])

        const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleClick(event as unknown as React.MouseEvent<HTMLElement>)
            }
        }

        return (
            <div
                {...props}
                onClick={handleClick}
                ref={ref}
                onKeyDown={handleKeyDown}
                role={props.role || 'button'}
                aria-pressed={isBumping}
                tabIndex={0}
                className={cn(
                    'inline-block cursor-pointer',
                    isBumping ? animationClass : '',
                    className
                )}
            >
                {children}
            </div>
        )
    }
)

export default BumpOnClick
