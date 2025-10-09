'use client'

import { cn } from '@/helpers/tw-utils'

import { Separator } from '@/components/ui/separator'

import { useIsMobile } from '@/hooks/use-mobile'

import type { IBaseProps } from '@/types'

import { ContactInfo } from './accounts-settings/contact-info'
import { ExternalLinks } from './accounts-settings/external-links'
import { MobileDropdown } from './accounts-settings/mobile-dropdown'
import { NavigationSection } from './accounts-settings/navigation-section'
import { QuickActions } from './accounts-settings/quick-actions'

interface Props extends IBaseProps {}

const settingsNavItems = [
    { name: 'General', path: '/account-profile' },
    { name: 'Profile', path: '/account-profile/profile' },
    { name: 'Security', path: '/account-profile/security' },
    { name: 'Verify Email', path: '/account-profile/verify/email' },
    { name: 'Verify Contact', path: '/account-profile/verify/contact' },
    { name: 'Account QR', path: '/account-profile/qr' },
    { name: 'Activity Logs', path: '/account-profile/activity-logs' },
]

const externalLinks = [
    { title: 'Home', path: '/' },
    { title: 'Terms and Conditions', path: '/policy/terms-and-condition' },
    { title: 'Privacy Policy', path: '/policy/privacy-policy' },
    { title: 'Terms of Use', path: '/policy/terms-of-use' },
    { title: 'Cookie Policy', path: '/policy/cookie-policy' },
    { title: 'Data Protection Policy', path: '/policy/data-protection-policy' },
    { title: 'Risk Management Policy', path: '/policy/risk-management-policy' },
    {
        title: 'Anti-Money Laundering (AML) & Counter-Terrorism Financing (CTF) Policy',
        path: '/policy/aml-ctf-policy',
    },
    { title: 'Know Your Customer (KYC)', path: '/policy/kyc-policy/' },
    {
        title: 'Complaint Handling and Dispute Resolution Policy',
        path: '/policy/complaint-handling-and-dispute-policy/',
    },
    {
        title: 'Fee and Charges Policy',
        path: '/policy/fee-and-charges-policy/',
    },
    { title: 'Security Policy', path: '/policy/security-policy/' },
]

const AccountSettingsSidebar = ({ className }: Props) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <MobileDropdown
                externalLinks={externalLinks}
                settingsNavItems={settingsNavItems}
            />
        )
    }

    return (
        <div className={cn('space-y-4 px-2 py-3 max-w-72', className)}>
            <NavigationSection items={settingsNavItems} title="Settings" />
            <Separator />
            <QuickActions />
            <Separator />
            <ExternalLinks links={externalLinks} title="Legal" />
            <Separator />
            <ContactInfo />
        </div>
    )
}

export default AccountSettingsSidebar
