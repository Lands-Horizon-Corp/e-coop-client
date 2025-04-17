import DOMPurify from 'isomorphic-dompurify'

import { cn } from '@/lib'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    description?: string
}

const CompanyDescription = ({ className, description }: Props) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                    description && description.length > 0
                        ? description
                        : '<i>No Description</i>'
                ),
            }}
            className={cn(
                'prose-h1: prose !max-w-full rounded-xl bg-secondary p-4 text-sm text-foreground/70 dark:prose-invert prose-p:text-foreground/80 prose-strong:text-foreground dark:bg-popover sm:text-sm',
                className
            )}
        />
    )
}

export default CompanyDescription
