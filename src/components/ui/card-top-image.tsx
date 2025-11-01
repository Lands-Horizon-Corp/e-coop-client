import { ReactNode } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import ImageDisplay from '../image-display'
import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'
import { Button } from './button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './card'
import TruncatedText from './truncated-text'

interface ActionProps {
    label?: string | ReactNode
    onClick: () => void
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
    disabled?: boolean
    loading?: boolean
    size?: 'xs' | 'sm' | 'icon' | 'lg' | 'default' | 'default' | 'nostyle'
}

export interface CardTopImageProps {
    mediaSrc?: IMedia
    imageSrc?: string
    imageAlt?: string
    imageClassName?: string
    title?: string
    description?: string
    className?: string
    cardContentClassName?: string
    cardHeaderClassName?: string
    cardFooterClassName?: string
    cardLabelClassName?: string
    primaryAction?: ActionProps
    secondaryAction?: ActionProps
    customFooter?: ReactNode
    customHeader?: ReactNode
    label?: ReactNode
    footerDirection?: 'row' | 'column'
    hideFooter?: boolean
    hideHeader?: boolean
    onCardClick?: () => void
    onImageClick?: () => void
}

const CardTopImage = ({
    mediaSrc,
    imageSrc,
    imageClassName,
    title,
    description,
    className,
    cardContentClassName,
    cardHeaderClassName,
    cardFooterClassName,
    cardLabelClassName,
    primaryAction,
    secondaryAction,
    customFooter,
    customHeader,
    footerDirection = 'row',
    hideFooter = false,
    hideHeader = false,
    onCardClick,
    onImageClick,
    label,
}: CardTopImageProps) => {
    const renderFooter = () => {
        if (hideFooter) return null
        if (customFooter) {
            return (
                <CardFooter
                    className={cn(
                        'gap-3 h-full px-2 py-1 rounded-b-2xl',
                        cardFooterClassName
                    )}
                >
                    {customFooter}
                </CardFooter>
            )
        }
        if (!primaryAction && !secondaryAction) return null
        return (
            <CardFooter
                className={cn(
                    'gap-3 ',
                    footerDirection === 'column'
                        ? 'flex-col items-stretch'
                        : 'max-sm:flex-col max-sm:items-stretch',
                    cardFooterClassName
                )}
            >
                {primaryAction && (
                    <Button
                        disabled={
                            primaryAction.disabled || primaryAction.loading
                        }
                        onClick={primaryAction.onClick}
                        size={primaryAction.size || 'default'}
                        variant={primaryAction.variant || 'default'}
                    >
                        {primaryAction.loading
                            ? 'Loading...'
                            : primaryAction.label}
                    </Button>
                )}
                {secondaryAction && (
                    <Button
                        disabled={
                            secondaryAction.disabled || secondaryAction.loading
                        }
                        onClick={secondaryAction.onClick}
                        size={secondaryAction.size || 'default'}
                        variant={secondaryAction.variant || 'outline'}
                    >
                        {secondaryAction.loading
                            ? 'Loading...'
                            : secondaryAction.label}
                    </Button>
                )}
            </CardFooter>
        )
    }

    return (
        <Card
            className={cn(
                'max-w-sm pt-0 border-0 !h-fit relative',
                onCardClick && 'cursor-pointer ',
                className
            )}
            onClick={onCardClick}
        >
            {label && (
                <div
                    className={cn(
                        'absolute top-3 right-3 z-10',
                        cardLabelClassName
                    )}
                >
                    {label}
                </div>
            )}
            <CardContent
                className={cn(
                    'p-0 border-0 rounded-t-xl',
                    cardContentClassName
                )}
            >
                <PreviewMediaWrapper media={mediaSrc}>
                    <ImageDisplay
                        className={cn(
                            'aspect-video size-full rounded-t-2xl rounded-b-xs object-cover',
                            onImageClick && 'cursor-pointer',
                            imageClassName
                        )}
                        onClick={onImageClick}
                        src={imageSrc}
                    />
                </PreviewMediaWrapper>
            </CardContent>
            {!hideHeader && (
                <CardHeader className={cardHeaderClassName}>
                    {customHeader ? (
                        customHeader
                    ) : (
                        <>
                            <CardTitle>{title}</CardTitle>
                            {description && (
                                <CardDescription className="max-h-20 overflow-auto ecoop-scroll">
                                    <TruncatedText
                                        maxLength={120}
                                        text={description}
                                    />
                                </CardDescription>
                            )}
                        </>
                    )}
                </CardHeader>
            )}
            {renderFooter()}
        </Card>
    )
}

export default CardTopImage
