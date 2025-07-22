import { cn } from '@/lib'

type linkTagProps = {
    href: string
    target?: string
    className?: string
    name?: string
}

const LinkTag = ({ className, href, target, name }: linkTagProps) => {
    return (
        <span
            className={cn(
                `text-blue-500 dark:text-blue-400 underline cursor-pointer hover:no-underline`,
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
