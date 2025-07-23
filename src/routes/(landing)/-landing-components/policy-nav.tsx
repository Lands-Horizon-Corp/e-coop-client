import { cn } from '@/lib'
import { Link, useLocation } from '@tanstack/react-router'

type PolicyNavLinkProps = {
    className?: string
}

const PolicyNav = ({ className }: PolicyNavLinkProps) => {
    const PolicyNavLinks = [
        { name: 'Privacy Policy', to: '/privacy-policy' },
        { name: 'Terms and Conditions', to: '/terms-and-conditions' },
        { name: 'Cookie Policy', to: '/cookie-policy' },
        { name: 'Data Protection Policy', to: '/data-protection-policy' },
        { name: 'Risk Management Policy', to: '/risk-management-policy' },
        {
            name: 'Complaint and Dispute Policy',
            to: '/complaint-dispute-policy',
        },
        { name: 'Terms of Use', to: '/terms-of-use' },
        { name: 'Know Your Customer Policy', to: '/know-your-customer-policy' },
        { name: 'AML and CTF Policy', to: '/aml-ctf-policy' },
        { name: 'Security Policy', to: '/security-policy' },
        { name: 'Fee and Charges Policy', to: '/fee-charges-policy' },
        { name: 'Code of Conduct', to: '/code-of-conduct-policy' },
    ]

    const pathName = useLocation({
        select: (location) =>
            location.pathname.startsWith('/site-policy/')
                ? location.pathname.replace('/site-policy/', '')
                : location.pathname,
    })

    return (
        <div
            className={cn('bg-background/80 hidden lg:block w-64  ', className)}
        >
            <nav className="flex flex-col gap-2 p-4 rounded-lg">
                {PolicyNavLinks.map((link) => {
                    const linkName = link.to.slice(1)
                    const isCurrentTab =
                        pathName.toLowerCase() === linkName.toLowerCase()
                    return (
                        <Link
                            key={link.name}
                            to={`/site-policy${link.to}` as string}
                            className={`hover:bg-primary/20 px-3 py-2 min-w-52 rounded-md text-sm font-medium text-gray-900 dark:text-white ${
                                isCurrentTab
                                    ? 'bg-primary/20 after:content-[""] after:block after:w-1 after:h-7 relative after:-left-2.5 after:top-1/2 after:-translate-y-1/2 after:absolute after:rounded-xl after:bg-primary'
                                    : ''
                            }`}
                        >
                            {link.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

export default PolicyNav
