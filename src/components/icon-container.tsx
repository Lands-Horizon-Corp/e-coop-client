import { HelpCircle } from 'lucide-react'

import { IconMap } from './icons'

export const IconContainer = ({
    name,
    className,
}: {
    name?: string
    className?: string
}) => {
    if (!name || !(name in IconMap)) {
        return <HelpCircle className={className} />
    }

    const Icon = IconMap[name as keyof typeof IconMap]
    return <Icon className={className} />
}
