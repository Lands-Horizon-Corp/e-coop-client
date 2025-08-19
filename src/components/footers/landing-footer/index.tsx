import { useAuthStore } from '@/store/user-auth-store'
import { Link, useRouter } from '@tanstack/react-router'

import EcoopLogo from '@/components/ecoop-logo'
import {
    EmailIcon,
    FacebookIcon,
    PhoneIcon,
    PinLocationIcon,
    TwitterIcon,
    YoutubeIcon,
} from '@/components/icons'

import {
    EMAIL,
    FACEBOOK_LINK,
    LOCATION,
    PHONE,
    TWITTER_LINK,
    YOUTUBE_LINK,
} from '../common-links'

const NeonFooter = () => {
    const { navigate } = useRouter()
    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const handleGetStarted = () => {
        if (!user_organization?.organization || !user_organization?.branch) {
            navigate({ to: '/onboarding' as string })
        } else {
            const orgName = user_organization.organization?.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

            const branchName = user_organization?.branch.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

            navigate({
                to: `/org/${orgName}/branch/${branchName}` as string,
            })
        }
    }

    const policies = [
        {
            to: '/aml-ctf-policy',
            label: 'AML and CTF Policy',
        },
        {
            to: '/kyc-policy',
            label: 'Know Your Customer (KYC) Policy',
        },
        {
            to: '/complaint-handling-and-dispute-policy',
            label: 'Complaint Handling and Dispute Resolution Policy',
        },
        { to: '/fee-and-charges-policy', label: 'Fee and Charges Policy' },
        { to: '/security-policy', label: 'Security Policy' },
    ]
    const quickLinks = [
        { label: 'Home', onClick: () => navigate({ to: '/' }) },
        { label: 'Get started', onClick: handleGetStarted },
        {
            label: 'Terms and Conditions',
            to: '/terms-and-condition',
        },
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms of use', to: '/terms-of-use' },
        { label: 'Cookie policy', to: '/cookie-policy' },
        {
            label: 'Data Protection Policy',
            to: '/data-protection-policy',
        },
        {
            label: 'Risk Management Policy',
            to: '/risk-management-policy',
        },
    ]
    const contacts = [
        {
            icon: <EmailIcon size={20} className="mr-2 text-lg" />,
            text: EMAIL,
        },
        {
            icon: <PhoneIcon className="mr-2 text-sm" />,
            text: PHONE,
        },
        {
            icon: (
                <PinLocationIcon size={18} className="text-destructive mr-2" />
            ),
            text: LOCATION,
        },
    ]
    const socialLinks = [
        {
            label: 'Facebook',
            href: FACEBOOK_LINK,
            icon: <FacebookIcon className="mr-2 text-lg" />,
        },
        {
            label: 'Twitter',
            href: TWITTER_LINK,
            icon: <TwitterIcon className="mr-2 text-lg" />,
        },
        {
            label: 'Youtube',
            href: YOUTUBE_LINK,
            icon: <YoutubeIcon className="mr-2 text-lg" />,
        },
    ]
    const linkClass =
        'text-gray-500 hover:text-primary transition-colors duration-200 cursor-pointer'
    const socialLinkClass =
        'flex items-center text-accent-foreground hover:text-primary transition-colors duration-200'

    return (
        <footer className="bg-background border-t-[.2px] border-gray-600/20 text-accent-foreground py-12 px-4 md:px-8 lg:px-16">
            <div className="max-w-[100rem] mx-auto flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex flex-col gap-6 w-full md:w-1/8 lg:w-[40%]">
                    <div className="mb-4">
                        <EcoopLogo className="size-16" blurDisabled />
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        All systems operational{' '}
                    </div>
                    <div className="text-sm font-thin">
                        <p>Made for Cooperatives, Powered by Trust</p>
                        <p>Copyright © 2025 - 2026 Lands Horizon Corp.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 w-full md:w-full lg:w-4/5">
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold dark:text-white text-black mb-2">
                            Quick Links
                        </h3>
                        {quickLinks.map((item, index) =>
                            item.to ? (
                                <Link
                                    key={index}
                                    to={`/policy/${item.to}` as string}
                                    className={linkClass}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={index}
                                    onClick={item.onClick}
                                    className={`${linkClass} cursor-pointer`}
                                >
                                    {item.label}
                                </a>
                            )
                        )}
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold dark:text-white text-black mb-2">
                            Policies
                        </h3>
                        {policies.map((item) => (
                            <Link
                                key={item.to}
                                to={`/policy/${item.to}` as string}
                                className={linkClass}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3  text-sm">
                        <h3 className="font-semibold dark:text-white text-black mb-2">
                            Contacts
                        </h3>
                        {contacts.map((item, index) => (
                            <p
                                key={index}
                                className=" text-wrap min-w-5 text-accent-foreground flex items-center cursor-pointer"
                            >
                                <span className="flex items-center p-1.5">
                                    {item.icon}
                                </span>
                                <p className="border break-all inline-block !text-wrap ">
                                    {' '}
                                    {item.text}
                                </p>
                            </p>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold text-accent-foreground mb-2">
                            Follow Us
                        </h3>
                        {socialLinks.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialLinkClass}
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default NeonFooter
