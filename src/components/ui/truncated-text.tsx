import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'

import { Button } from './button'

interface TruncatedTextProps {
    text: string
    maxLength?: number
    className?: string
    buttonClassName?: string
    showMoreText?: string
    showLessText?: string
    onExpandedChange?: (isExpanded: boolean) => void
    renderText?: (text: string) => React.ReactNode
}

const TruncatedText = ({
    text,
    maxLength = 150,
    className,
    buttonClassName,
    showMoreText = 'See more',
    showLessText = 'See less',
    onExpandedChange,
    renderText,
}: TruncatedTextProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const shouldTruncate = text.length > maxLength

    const truncatedText = shouldTruncate
        ? text.slice(0, maxLength).trim() + '...'
        : text

    const displayText = shouldTruncate && !isExpanded ? truncatedText : text

    const handleToggle = () => {
        const newExpandedState = !isExpanded
        setIsExpanded(newExpandedState)
        onExpandedChange?.(newExpandedState)
    }

    const renderedText = renderText ? renderText(displayText) : displayText

    if (!shouldTruncate) {
        return <div className={className}>{renderedText}</div>
    }

    return (
        <div className={className}>
            {renderedText}{' '}
            <Button
                className={cn(
                    'h-auto p-0 cursor-pointer hover:no-underline text-xs text-primary hover:text-primary/80',
                    buttonClassName
                )}
                onClick={handleToggle}
                size="sm"
                variant="link"
            >
                {isExpanded ? showLessText : showMoreText}
            </Button>
        </div>
    )
}

export default TruncatedText
