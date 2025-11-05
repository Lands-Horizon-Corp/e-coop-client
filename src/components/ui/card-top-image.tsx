import { ReactNode } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import ImageDisplay from '../image-display'
import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'
import { Card, CardContent, CardFooter, CardHeader } from './card'

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
    className?: string

    cardLabelClassName?: string
    cardHeaderClassName?: string
    cardContentClassName?: string
    cardFooterClassName?: string

    cardLabel?: ReactNode
    cardHeader?: ReactNode
    cardContent?: ReactNode
    cardFooter?: ReactNode

    customLabel?: ReactNode
    customHeader?: ReactNode
    customContent?: ReactNode
    customFooter?: ReactNode

    primaryAction?: ActionProps
    secondaryAction?: ActionProps
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
    cardContentClassName,
    cardHeaderClassName,
    cardFooterClassName,
    cardLabelClassName,
    customHeader,
    hideHeader = false,
    onCardClick,
    onImageClick,
    cardLabel,
    className,
    customLabel,
    cardHeader,
    cardContent,
    customContent,
    cardFooter,
    customFooter,
}: CardTopImageProps) => {
    return (
        <Card
            className={cn(
                'max-w-sm pt-0 bg-sidebar border-0 !h-fit relative',
                onCardClick && 'cursor-pointer ',
                className
            )}
            onClick={onCardClick}
        >
            <div
                className={cn(
                    'absolute top-3 right-3 z-10',
                    cardLabelClassName
                )}
            >
                {cardLabel ? cardLabel : customLabel}
            </div>

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
            {!hideHeader && (
                <CardHeader className={cn('p-2', cardHeaderClassName)}>
                    {cardHeader ? cardHeader : customHeader}
                </CardHeader>
            )}
            <CardContent className={cn('p-0 border-0', cardContentClassName)}>
                {cardContent ? cardContent : customContent}
            </CardContent>
            <CardFooter className={cn('p-0', cardFooterClassName)}>
                {cardFooter ? cardFooter : customFooter}
            </CardFooter>
        </Card>
    )
}

export default CardTopImage
