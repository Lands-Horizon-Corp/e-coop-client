// this component sanitizes and display any content including html, text
import { sanitizeHtml } from '@/helpers/sanitizer'
import { cn } from '@/helpers/tw-utils'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    expandedClassName?: string
    content: string
}

const TextRenderer = ({ className, content }: Props) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(content),
            }}
            className={cn('', className)}
        />
    )
}

export default TextRenderer
