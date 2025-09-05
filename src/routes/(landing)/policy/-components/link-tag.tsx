import { cn } from '@/helpers/tw-utils'

type linkTagProps = {
    href?: string
    target?: string
    className?: string
    name?: string
}

const LinkTag = ({ className, href, target, name }: linkTagProps) => {
    return (
        <span
            className={cn(
                `text-primary underline cursor-pointer hover:no-underline`,
                className
            )}
        >
            <a href={href} target={target ?? '_blank'}>
                {name ? name : href}
            </a>
        </span>
    )
}

export default LinkTag
