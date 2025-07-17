import { cn } from '@/lib'
import { sanitizeHtml } from '@/utils/sanitizer'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    expandedClassName?: string
    content: string
}

const RawDescription = ({ className, content }: Props) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(content),
            }}
            className={cn('', className)}
        />
    )
}

export default RawDescription
