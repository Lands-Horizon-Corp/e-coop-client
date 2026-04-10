import { ReactNode } from 'react'

import { cn } from '@/helpers'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

type CardProps = {
    cardProps?: React.HTMLAttributes<HTMLDivElement>
}

interface HorizontalCardProps extends CardProps {
    title: string
    description?: string
    image?: string
    imageAlt?: string
    actions?: ReactNode
    className?: string
    contentClassName?: string
    reverse?: boolean
}

export const HorizontalCard = ({
    title,
    description,
    image,
    imageAlt = 'Card image',
    actions,
    className,
    contentClassName,
    reverse = false,
    cardProps,
}: HorizontalCardProps) => {
    return (
        <Card
            {...cardProps}
            className={cn(
                'max-w-lg py-0 sm:flex sm:gap-0 overflow-hidden',
                reverse && 'sm:flex-row-reverse',
                className
            )}
        >
            {image && (
                <CardContent className="p-0 sm:w-1/2">
                    <img
                        alt={imageAlt}
                        className="h-full w-full object-cover"
                        src={image}
                    />
                </CardContent>
            )}

            <div
                className={cn(
                    'flex flex-col justify-between sm:w-1/2',
                    contentClassName
                )}
            >
                <div>
                    <CardHeader className="pt-6">
                        <CardTitle>{title}</CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </CardHeader>
                </div>

                {actions && (
                    <CardFooter className="gap-3 py-6">{actions}</CardFooter>
                )}
            </div>
        </Card>
    )
}
