import { Link } from '@tanstack/react-router'

import { ArrowUpRightIcon, ShieldIcon } from '@/components/icons'

interface ExternalLink {
    title: string
    path: string
}

interface ExternalLinksProps {
    links: ExternalLink[]
    title?: string
}

export const ExternalLinks = ({ links, title }: ExternalLinksProps) => {
    return (
        <div className="space-y-1">
            {title && (
                <p className="font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    <ShieldIcon className="size-5 inline mr-2" />
                    {title}
                </p>
            )}

            <div className="space-y-0.5  overflow-y-auto">
                {links.map((link) => (
                    <Link
                        className="flex items-start gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group rounded-md hover:bg-accent"
                        key={link.path}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={link.path as string}
                    >
                        <ArrowUpRightIcon className="size-3 mt-0.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        <span className="text-wrap leading-tight">
                            {link.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
