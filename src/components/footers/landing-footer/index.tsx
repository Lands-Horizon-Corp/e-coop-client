import { Link, useRouter } from '@tanstack/react-router'

import EcoopLogo from '@/components/ecoop-logo'
import {
    DownloadIcon,
    EmailIcon,
    FacebookIcon,
    PhoneIcon,
    PinLocationIcon,
    TwitterIcon,
    YoutubeIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import usePWA from '@/hooks/pwa-hook'
import { useGetIntoBranch } from '@/hooks/use-go-to-org'

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
        progress,
        isDownloading,
        isOnline,
        startDownload,
        installApp,
        uninstallPWA,
        isInstallable,
        error,
    } = usePWA()

    const { handleGetStarted } = useGetIntoBranch()

    const handleOneClickSetup = async () => {
        if (isInstallable) {
            await installApp()
        }
        if (isOnline && progress < 100) {
            startDownload()
        }
    }

    const policies = [
        { to: '/aml-ctf-policy', label: 'AML and CTF Policy' },
        { to: '/kyc-policy', label: 'Know Your Customer (KYC) Policy' },
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
        { label: 'Terms and Conditions', to: '/terms-and-condition' },
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms of use', to: '/terms-of-use' },
        { label: 'Cookie policy', to: '/cookie-policy' },
        { label: 'Data Protection Policy', to: '/data-protection-policy' },
        { label: 'Risk Management Policy', to: '/risk-management-policy' },
        {
            label: 'FAQ',
            onClick: () => navigate({ to: '/frequently-asked-questions' }),
        },
        { label: 'Developers', onClick: () => navigate({ to: '/developers' }) },
    ]

    const contacts = [
        { icon: <EmailIcon className="mr-2 text-lg" size={20} />, text: EMAIL },
        { icon: <PhoneIcon className="mr-2 text-sm" />, text: PHONE },
        {
            icon: (
                <PinLocationIcon className="text-destructive mr-2" size={18} />
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
        'flex items-center hover:text-primary transition-colors duration-200'

    return (
        <footer className="bg-background border-t-[.2px] border-gray-600/20 py-12 px-4 md:px-8 lg:px-16">
            <div className="max-w-[100rem] mx-auto flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex flex-col gap-6 w-full md:w-1/8 lg:w-[40%]">
                    <div className="mb-4">
                        <EcoopLogo blurDisabled className="size-16" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm max-w-xs">
                            <div className="flex items-center">
                                <span
                                    className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-primary animate-pulse' : 'bg-destructive'}`}
                                ></span>
                                {isOnline
                                    ? 'All systems operational'
                                    : 'System Offline'}
                            </div>

                            {/* Discreet Reset Button - only shows if app is already synced */}
                            {progress === 100 && (
                                <button
                                    className="text-[10px] text-muted-foreground hover:text-destructive transition-colors underline decoration-dotted"
                                    onClick={uninstallPWA}
                                >
                                    Reset App
                                </button>
                            )}
                        </div>

                        {/* Unified PWA Setup Section */}
                        <div className="max-w-xs">
                            {isDownloading ? (
                                <div className="space-y-2 p-3 border rounded-xl bg-secondary/10 border-primary/20">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-primary">
                                        <span>Installing System</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress
                                        className="h-1.5"
                                        value={progress}
                                    />
                                    <p className="text-[9px] text-muted-foreground animate-pulse text-center">
                                        Optimizing for offline banking...
                                    </p>
                                </div>
                            ) : progress === 100 ? (
                                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-primary/20 bg-primary/5">
                                    <div className="bg-primary/20 p-1.5 rounded-md aspect-square flex items-center justify-center border border-primary/20">
                                        <span className="text-primary text-[10px] font-bold">
                                            ✔
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">
                                            System Ready
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            Verified for offline access
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="w-full h-auto  flex items-center justify-start text-left gap-3 rounded-xl border-primary/20 hover:bg-secondary/50 transition-all"
                                    disabled={!isOnline}
                                    onClick={handleOneClickSetup}
                                    variant="outline"
                                >
                                    <DownloadIcon className="size-5 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text- font-bold">
                                            Setup e-coop App
                                        </span>
                                        <span className="text-[9px] opacity-60">
                                            Install & enable offline mode
                                        </span>
                                    </div>
                                </Button>
                            )}
                            {error && (
                                <p className="text-[10px] text-destructive mt-2 px-1">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="text-sm font-thin text-muted-foreground">
                        <p>Made for Cooperatives, Powered by Trust</p>
                        <p>Copyright © 2025 - 2026 Lands Horizon Corp.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 w-full md:w-full lg:w-4/5">
                    {/* Quick Links */}
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold mb-2">Quick Links</h3>
                        {quickLinks.map((item, index) =>
                            item.to ? (
                                <Link
                                    className={linkClass}
                                    key={index}
                                    to={`/policy/${item.to}` as string}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    className={linkClass}
                                    key={index}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </a>
                            )
                        )}
                    </div>
                    {/* Policies */}
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold mb-2">Policies</h3>
                        {policies.map((item) => (
                            <Link
                                className={linkClass}
                                key={item.to}
                                to={`/policy/${item.to}` as string}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    {/* Contacts */}
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold mb-2">Contacts</h3>
                        {contacts.map((item, index) => (
                            <p
                                className="flex items-center cursor-pointer"
                                key={index}
                            >
                                <span className="flex items-center p-1.5">
                                    {item.icon}
                                </span>
                                <span className="break-all">{item.text}</span>
                            </p>
                        ))}
                    </div>
                    {/* Socials */}
                    <div className="flex flex-col gap-3 text-sm">
                        <h3 className="font-semibold mb-2">Follow Us</h3>
                        {socialLinks.map((item, idx) => (
                            <a
                                className={socialLinkClass}
                                href={item.href}
                                key={idx}
                                rel="noopener noreferrer"
                                target="_blank"
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
