import { ReactNode } from 'react'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface CardTopImageToolTipProps {
    content: ReactNode
    name?: string
    description?: string
    src?: string
    customToolTipContent?: ReactNode
}

export const OrganizationMiniCardToolTip = ({
    content,
    ...props
}: CardTopImageToolTipProps) => {
    const { name, description, src, customToolTipContent } = props
    return (
        <Tooltip delayDuration={450}>
            <TooltipTrigger asChild>
                <span>{content}</span>
            </TooltipTrigger>
            <TooltipContent
                className="min-w-[270px] h-full transform transition-transform duration-300 ease-in-out
            scale-100 hover:scale-110 shadow-2xl shadow-black rounded-xl bg-background max-w-[15rem] p-0 "
                sideOffset={-250}
            >
                {customToolTipContent ? (
                    customToolTipContent
                ) : (
                    <>
                        <div
                            className="h-24 max-h-32 w-full rounded-t-xl"
                            style={{
                                background: `url(${src}) center center / cover no-repeat`,
                            }}
                        />
                        <div className="p-2">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                                {name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-3">
                                {description}
                            </p>
                        </div>
                    </>
                )}
            </TooltipContent>
        </Tooltip>
    )
}
