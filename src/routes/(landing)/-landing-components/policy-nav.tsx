import { cn } from '@/lib'
import { Link } from '@tanstack/react-router'

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
        { name: 'Terms of Use', to: '/terms-of-use' },
        {name: 'Know Your Customer Policy', to: '/know-your-customer-policy' },
        { name: 'AML and CTF Policy', to: '/aml-ctf-policy' },
        { name: 'Security Policy', to: '/security-policy' },
        { name: 'Fee and Charges Policy', to: '/fee-charges-policy' },
        {name: 'Code of Conduct', to: '/code-of-conduct-policy' },
        {name: 'Developer Policy', to: '/developer-policy' },

    ]

    return (
        <div
            className={cn(
                'bg-sidebar ',
                className
            )}
        >
            <nav className="flex flex-col gap-2 p-4  rounded-lg">
                {PolicyNavLinks.map((link) => {
                    return (
                        <Link
                            key={link.name}
                            to={`/site-policy${link.to}` as string}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 min-w-52 rounded-md text-sm font-medium text-gray-900 dark:text-white"
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
