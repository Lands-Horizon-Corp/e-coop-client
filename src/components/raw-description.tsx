import { cn } from '@/lib'
import DOMPurify from 'dompurify'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    expandedClassName?: string
    content: string
}

const RawDescription = ({ className, content }: Props) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
            }}
            className={cn('', className)}
        />
    )
}

export default RawDescription
