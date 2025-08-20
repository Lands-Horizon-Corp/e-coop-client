import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCallback, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/security-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'physical-security-measures') return 'Physical Security Measures'
    if (id === 'digital-security-measures') return 'Digital Security Measures'
    if (id === 'data-protection-and-privacy') return 'Data Protection & Privacy'
    if (id === 'member-and-user-responsibilities')
        return 'Member & User Responsibilities'
    if (id === 'security-for-subscription-plans')
        return 'Security for Subscription Plans'
    if (id === 'third-party-and-vendor-security')
        return 'Third-Party & Vendor Security'
    if (id === 'policy-review-and-updates') return 'Policy Review & Updates'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const physicalSecurityMeasuresRef = useRef<HTMLDivElement>(null)
    const digitalSecurityMeasuresRef = useRef<HTMLDivElement>(null)
    const dataProtectionPrivacyRef = useRef<HTMLDivElement>(null)
    const incidentResponseRef = useRef<HTMLDivElement>(null)
    const memberUserResponsibilitiesRef = useRef<HTMLDivElement>(null)
    const securitySubscriptionPlansRef = useRef<HTMLDivElement>(null)
    const thirdPartyVendorSecurityRef = useRef<HTMLDivElement>(null)
    const policyReviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'physical-security-measures': physicalSecurityMeasuresRef,
            'digital-security-measures': digitalSecurityMeasuresRef,
            'data-protection-and-privacy': dataProtectionPrivacyRef,
            'incident-response': incidentResponseRef,
            'member-and-user-responsibilities': memberUserResponsibilitiesRef,
            'security-for-subscription-plans': securitySubscriptionPlansRef,
            'third-party-and-vendor-security': thirdPartyVendorSecurityRef,
            'policy-review-and-updates': policyReviewUpdatesRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        physicalSecurityMeasuresRef,
        digitalSecurityMeasuresRef,
        dataProtectionPrivacyRef,
        incidentResponseRef,
        memberUserResponsibilitiesRef,
        securitySubscriptionPlansRef,
        thirdPartyVendorSecurityRef,
        policyReviewUpdatesRef,
        contactUsRef,
    ])

    const scrollToSection = useCallback(
        (sectionId: string) => {
            const ref = sectionRefs[sectionId as keyof typeof sectionRefs]

            if (ref && ref.current) {
                ref.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
                history.pushState(null, '', `#${sectionId}`)
            }
        },
        [sectionRefs]
    )

    const articleList = Object.keys(sectionRefs)

    return (
        <PageContainer className="w-full flex flex-row flex-grow">
            <div className="flex-1 overflow-y-auto px-4 py-8 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-theme(spacing.16))]">
                <h1 className="text-3xl font-bold mb-4">
                    Lands Horizon Security Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Security Policy describes the physical and digital
                    measures implemented by Lands Horizon Corp (“we”, “us”, or
                    “our”) to protect the assets and information of all users,
                    members, and cooperatives on the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . Our security practices are designed to provide robust
                    protection for users on all subscription plans and to comply
                    with applicable laws and best practices.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1: Purpose and Scope --- */}
                <SitePolicyItem
                    ref={purposeScopeRef}
                    id="purpose-and-scope"
                    title="1. Purpose and Scope"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                To ensure the confidentiality, integrity, and
                                availability of assets, data, and systems on the
                                e-coop-suite platform.
                            </li>
                            <li>
                                Applies to all users, members, cooperative
                                organizations, employees, partners, and
                                third-party service providers.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Physical Security Measures --- */}
                <SitePolicyItem
                    ref={physicalSecurityMeasuresRef}
                    id="physical-security-measures"
                    title="2. Physical Security Measures"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All servers and core infrastructure are hosted
                                via the Fly.io Cloud Platform.
                            </li>
                            <li>
                                Physical security and environmental controls
                                (such as access management, surveillance, and
                                disaster prevention) are managed by Fly.io and
                                its global data center partners.
                            </li>
                            <li>
                                We rely on Fly.io's compliance with industry
                                standards and certifications for physical data
                                center security.
                            </li>
                            <li>
                                Our team and users do not have direct physical
                                access to the data centers where our services
                                are hosted.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Digital Security Measures --- */}
                <SitePolicyItem
                    ref={digitalSecurityMeasuresRef}
                    id="digital-security-measures"
                    title="3. Digital Security Measures"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                <strong>Encryption:</strong> All sensitive data
                                is encrypted in transit (TLS/SSL) and at rest.
                            </li>
                            <li>
                                <strong>Authentication:</strong> Multi-factor
                                authentication (MFA) is required for privileged
                                accounts; strong password policies are enforced.
                            </li>
                            <li>
                                <strong>Access Controls:</strong> Role-based
                                access controls (RBAC) restrict access to data
                                and features based on user roles and
                                subscription plans.
                            </li>
                            <li>
                                <strong>Password Security:</strong> Passwords
                                are hashed using secure algorithms (e.g.,
                                Argon2) and never stored in plain text.
                            </li>
                            <li>
                                <strong>Regular Audits:</strong> Security
                                audits, penetration tests, and vulnerability
                                assessments are conducted regularly.
                            </li>
                            <li>
                                <strong>Network Security:</strong> Firewalls,
                                intrusion detection/prevention systems
                                (IDS/IPS), and anti-malware tools protect our
                                infrastructure.
                            </li>
                            <li>
                                <strong>Session Management:</strong> Automatic
                                timeouts and session controls prevent
                                unauthorized access.
                            </li>
                            <li>
                                <strong>Security Monitoring:</strong> Continuous
                                monitoring detects suspicious activity and
                                potential threats.
                            </li>
                            <li>
                                <strong>API Security:</strong> All APIs are
                                protected with rate limiting, authentication,
                                and input validation.
                            </li>
                            <li>
                                <strong>Application Security:</strong>{' '}
                                Protection against threats such as XSS, CSRF,
                                and SQL injection is enforced.
                            </li>
                            <li>
                                <strong>Change Management:</strong> All
                                system/code changes are reviewed, tested, and
                                logged before deployment.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Data Protection and Privacy --- */}
                <SitePolicyItem
                    ref={dataProtectionPrivacyRef}
                    id="data-protection-and-privacy"
                    title="4. Data Protection and Privacy"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Data is collected, processed, and stored in
                                compliance with the Data Privacy Act of 2012 and
                                relevant local regulations.
                            </li>
                            <li>
                                Access to personal and sensitive data is
                                strictly limited, monitored, and logged.
                            </li>
                            <li>
                                Data backups are performed regularly and stored
                                securely for recoverability.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Incident Response --- */}
                <SitePolicyItem
                    ref={incidentResponseRef}
                    id="incident-response"
                    title="5. Incident Response"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                A formal incident response plan is in place for
                                detecting, reporting, and addressing security
                                incidents.
                            </li>
                            <li>
                                Users and members are promptly notified of any
                                breaches that may affect their assets or
                                information, in accordance with legal
                                requirements.
                            </li>
                            <li>
                                Lessons learned from incidents are used to
                                strengthen controls and prevent recurrence.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Member and User Responsibilities --- */}
                <SitePolicyItem
                    ref={memberUserResponsibilitiesRef}
                    id="member-and-user-responsibilities"
                    title="6. Member and User Responsibilities"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Users are responsible for safeguarding their
                                login credentials and promptly reporting
                                suspicious activity.
                            </li>
                            <li>
                                Members should use strong, unique passwords and
                                enable MFA where available.
                            </li>
                            <li>
                                Sharing of accounts or credentials is strictly
                                prohibited.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Security for Subscription Plans --- */}
                <SitePolicyItem
                    ref={securitySubscriptionPlansRef}
                    id="security-for-subscription-plans"
                    title="7. Security for Subscription Plans"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All users benefit from core physical and digital
                                security measures regardless of subscription
                                level.
                            </li>
                            <li>
                                Higher-tier plans may receive additional
                                security features or priority support (see
                                Subscription Plans for details).
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Third-Party and Vendor Security --- */}
                <SitePolicyItem
                    ref={thirdPartyVendorSecurityRef}
                    id="third-party-and-vendor-security"
                    title="8. Third-Party and Vendor Security"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All vendors and partners undergo security
                                assessments before integration.
                            </li>
                            <li>
                                Data sharing with third parties is governed by
                                strict contracts and access controls.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 9: Policy Review and Updates --- */}
                <SitePolicyItem
                    ref={policyReviewUpdatesRef}
                    id="policy-review-and-updates"
                    title="9. Policy Review and Updates"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                This policy is reviewed at least annually and
                                updated to reflect new threats, technologies, or
                                regulatory requirements.
                            </li>
                            <li>
                                Users will be notified of significant changes
                                via email or platform notification.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 10: Contact Us --- */}
                <SitePolicyItem
                    ref={contactUsRef}
                    id="contact-us"
                    title="10. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For questions or concerns about this Security Policy,
                        please contact:
                        <p className=" text-lg font-bold mt-2">
                            Zalven Lemuel Dayao
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Chief Information Security Officer / CEO, Lands
                            Horizon
                        </p>
                        <p className="text-muted-foreground text-xs ">
                            Email:{' '}
                            <CopyWrapper className="text-xs">
                                <LinkTag name="lands.horizon.corp@gmail.com" />
                            </CopyWrapper>
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Phone:{' '}
                            <CopyWrapper className="text-xs">
                                +63 991 617 1081
                            </CopyWrapper>
                        </p>
                        <div className="flex gap-x-2 text-xs">
                            <p className="text-muted-foreground">Address:</p>
                            <p className="text-muted-foreground p-2 border rounded-lg capitalize">
                                BLK 5 LOT 49, MAKADIYOS STREET VILLA MUZON SUBD,
                                MUZON EAST CITY OF SAN JOSE DEL MONTE BULACAN,
                                REGION III (CENTRAL LUZON), 3023, PHILIPPINES
                            </p>
                        </div>
                    </div>
                </SitePolicyItem>
            </div>

            {/* Table of Contents (Right Sidebar) */}
            <div className="hidden lg:block w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 px-4 py-8 sticky top-0 h-screen overflow-y-auto">
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    In this article
                </h4>{' '}
                <nav className="list-none space-y-2">
                    {articleList.map((sectionId, idx) => (
                        <li key={sectionId}>
                            <a
                                href={`#${sectionId}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    scrollToSection(sectionId)
                                }}
                                className="block py-1 text-primary hover:underline cursor-pointer text-sm"
                            >
                                {idx + 1}
                                {'. '}
                                {formatSectionTitle(sectionId)}
                            </a>
                        </li>
                    ))}
                </nav>
            </div>
        </PageContainer>
    )
}
