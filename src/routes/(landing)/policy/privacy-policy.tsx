import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/privacy-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === "children's-privacy") {
        return "Children's Privacy"
    }
    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    const personalCollectRef = useRef<HTMLDivElement>(null)
    const howWeCollectDataRef = useRef<HTMLDivElement>(null)
    const purposeDataCollectionRef = useRef<HTMLDivElement>(null)
    const legalBasisProcessingRef = useRef<HTMLDivElement>(null)
    const howWeUseYourDataRef = useRef<HTMLDivElement>(null)
    const sharingDisclosureDataRef = useRef<HTMLDivElement>(null)
    const DataRetentionRef = useRef<HTMLDivElement>(null)
    const SecurityMeasuresRef = useRef<HTMLDivElement>(null)
    const yourRightsRef = useRef<HTMLDivElement>(null)
    const internationalDataTransferRef = useRef<HTMLDivElement>(null)
    const cookiesTrackingTechnologyRef = useRef<HTMLDivElement>(null)
    const childrenPrivacyRef = useRef<HTMLDivElement>(null)
    const policyUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'personal-data-we-collect': personalCollectRef,
            'how-we-collect-data': howWeCollectDataRef,
            'purpose-of-data-collection': purposeDataCollectionRef,
            'legal-basis-for-processing': legalBasisProcessingRef,
            'how-we-use-your-data': howWeUseYourDataRef,
            'sharing-and-disclosure-of-data': sharingDisclosureDataRef,
            'data-retention': DataRetentionRef,
            'security-measures': SecurityMeasuresRef,
            'your-rights': yourRightsRef,
            'international-data-transfers': internationalDataTransferRef,
            'cookies-and-tracking-technologies': cookiesTrackingTechnologyRef,
            "children's-privacy": childrenPrivacyRef,
            'policy-updates': policyUpdatesRef,
            'contact-us': contactUsRef,
        }
    }, [
        personalCollectRef,
        howWeCollectDataRef,
        purposeDataCollectionRef,
        legalBasisProcessingRef,
        howWeUseYourDataRef,
        sharingDisclosureDataRef,
        DataRetentionRef,
        SecurityMeasuresRef,
        yourRightsRef,
        internationalDataTransferRef,
        cookiesTrackingTechnologyRef,
        childrenPrivacyRef,
        policyUpdatesRef,
        contactUsRef,
    ])

    const contentScrollRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        const hash = window.location.hash.substring(1)
        if (hash) {
            const timeoutId = setTimeout(() => {
                scrollToSection(hash)
            }, 100)

            return () => clearTimeout(timeoutId)
        }
    }, [scrollToSection])

    const articleList = Object.keys(sectionRefs)

    return (
        <PageContainer className="w-full  flex flex-col-reverse lg:flex-row  flex-grow">
            <div
                ref={contentScrollRef}
                className="flex-1 overflow-y-auto px-4 py-8 border-none lg:border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-theme(spacing.16))]"
            >
                <h1 className="text-3xl font-bold mb-4">
                    Lands Horizon Privacy Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    Welcome to e-coop-suite. This Privacy Policy describes how
                    Lands Horizon Corp (“we”, “us”, or “our”) collects, uses,
                    stores, and protects your personal information through the
                    e-coop-suite platform
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . By using our services, you agree to the practices
                    described in this policy.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1 --- */}
                <SitePolicyItem
                    ref={personalCollectRef}
                    id="personal-data-we-collect"
                    title="1. Personal Data We Collect"
                >
                    <div>
                        We may collect the following types of personal
                        information:
                        <ul className="list-disc pl-10 space-y-2">
                            <li> Name </li>
                            <li>Email address </li>
                            <li>Contact number </li>
                            <li>Residential or business address </li>
                            <li>Government-issued ID </li>
                            <li>Geographic location </li>
                            <li>Transaction history and records </li>
                            <li>Device information </li>
                            <li>
                                Other information necessary for service
                                delivery{' '}
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2 --- */}
                <SitePolicyItem
                    ref={howWeCollectDataRef}
                    id="how-we-collect-data"
                    title="2. How We Collect Data"
                >
                    <div>
                        Personal data is collected through:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Registration forms and account setup</li>
                            <li>Website and app usage tracking</li>
                            <li>Cookies and similar technologies</li>
                            <li>
                                Third-party integrations (e.g., payment
                                providers)
                            </li>
                            <li>Manual uploads and submissions by users</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3 --- */}
                <SitePolicyItem
                    ref={purposeDataCollectionRef}
                    id="purpose-of-data-collection"
                    title="3. Purpose of Data Collection"
                >
                    <div>
                        We collect and use your data for the following purposes:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Account creation and management</li>
                            <li>
                                Processing transactions and banking operations
                            </li>
                            <li>Improving our products and services</li>
                            <li>
                                Marketing and communication (with your consent)
                            </li>
                            <li>Data analytics and platform optimization</li>
                            <li>
                                Compliance with legal and regulatory
                                requirements
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4 --- */}
                <SitePolicyItem
                    ref={legalBasisProcessingRef}
                    id="legal-basis-for-processing"
                    title="4. Legal Basis for Processing"
                >
                    <div>
                        We process your personal data based on:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Your explicit consent</li>
                            <li>
                                Contractual necessity (to provide our services)
                            </li>
                            <li>
                                Compliance with legal and regulatory obligations
                            </li>
                            <li>
                                Our legitimate interests (such as fraud
                                prevention and service improvement)
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5 --- */}
                <SitePolicyItem
                    ref={howWeUseYourDataRef}
                    id="how-we-use-your-data"
                    title="5. How We Use Your Data"
                    // onClick removed as scrolling is handled by TOC
                >
                    <div>
                        Your data may be used for:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Authenticating users and securing accounts</li>
                            <li>Delivering banking and cooperative services</li>
                            <li>
                                Communicating important updates or service
                                information
                            </li>
                            <li>
                                Conducting analytics for service improvement and
                                risk management
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6 --- */}
                <SitePolicyItem
                    ref={sharingDisclosureDataRef}
                    id="sharing-and-disclosure-of-data"
                    title="6. Sharing and Disclosure of Data"
                >
                    <div>
                        We may share your data with:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Partner cooperatives (for banking and member
                                transactions)
                            </li>
                            <li>
                                Payment processors (to facilitate financial
                                operations)
                            </li>
                            <li>
                                Regulatory bodies (for compliance, as required
                                by law)
                            </li>
                            <li>
                                Developers or third parties with approved API
                                access
                            </li>
                        </ul>
                        Data is only shared:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>With your consent</li>
                            <li>To fulfill legal obligations</li>
                            <li>
                                With business partners and service providers
                                under strict agreements
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7 --- */}
                <SitePolicyItem
                    ref={DataRetentionRef}
                    id="data-retention"
                    title="7. Data Retention"
                >
                    <div>
                        We retain user data for the duration of your membership,
                        plus up to five (5) years after account or cooperative
                        closure, or as required by law. Data deletion is subject
                        to approval from management and regulatory compliance.
                    </div>
                </SitePolicyItem>

                {/* --- Section 8 --- */}
                <SitePolicyItem
                    ref={SecurityMeasuresRef}
                    id="security-measures"
                    title="8. Security Measures"
                >
                    <div>
                        We take the security of your information very seriously,
                        implementing measures such as:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Encryption of sensitive data at rest and in
                                transit
                            </li>
                            <li>Strong password hashing (e.g., Argon2)</li>
                            <li>Access controls and role-based permissions</li>
                            <li>Regular security audits and system reviews</li>
                            <li>Secure storage infrastructure</li>
                            <li>
                                Protection against XSS (Cross-Site Scripting),
                                SQL injection, CSRF (Cross-Site Request Forgery)
                            </li>
                            <li>
                                Rate limiting and IP blocking for suspicious or
                                illegal activities
                            </li>
                            <li>
                                Prohibition of access to sensitive files (e.g.,
                                environment files, Dockerfiles)
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 9 --- */}
                <SitePolicyItem
                    ref={yourRightsRef}
                    id="your-rights"
                    title="9. Your Rights"
                >
                    <div>
                        You have the following rights regarding your personal
                        data:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Access your data and request feedback</li>
                            <li>Correct or update your information</li>
                            <li>
                                Request deletion or restriction of your data
                            </li>
                            <li>Withdraw consent for data processing</li>
                            <li>Request data portability</li>
                            <li>File a complaint or provide a user rating</li>
                        </ul>
                        How to exercise your rights:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Visit the homepage and use the feedback or
                                contact forms
                            </li>
                            <li>
                                Contact us directly using the details provided
                                below
                            </li>
                            <li>
                                Options are also available in the website/app
                                footer
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 10 --- */}
                <SitePolicyItem
                    ref={internationalDataTransferRef}
                    id="international-data-transfers"
                    title="10. International Data Transfers"
                >
                    <div>
                        Currently, we do not store or process data outside the
                        Philippines. If international transfer becomes
                        necessary, data will be protected by currency exchange
                        checks and API-based security. No cross-border transfers
                        will occur without explicit action and consent from
                        users, and exchange rates are verified before completing
                        any such transaction.
                    </div>
                </SitePolicyItem>

                {/* --- Section 11 --- */}
                <SitePolicyItem
                    ref={cookiesTrackingTechnologyRef}
                    id="cookies-and-tracking-technologies"
                    title="11. Cookies and Tracking Technologies"
                >
                    <div>
                        We use cookies and similar technologies for:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Analytics and service optimization</li>
                            <li>Enhancing user experience</li>
                            <li>Authentication and security</li>
                            <li>User and bank protection</li>
                        </ul>
                        You may manage your cookie preferences in your browser
                        settings.
                    </div>
                </SitePolicyItem>

                {/* --- Section 12 --- */}
                <SitePolicyItem
                    ref={childrenPrivacyRef}
                    id="children's-privacy"
                    title="12. Children’s Privacy"
                >
                    <div>
                        We do not intentionally collect data from children. The
                        platform is intended for individuals involved in
                        cooperative banking and management. Any data related to
                        minors associated with members is subject to parental
                        consent and legal requirements.
                    </div>
                </SitePolicyItem>

                {/* --- Section 13 --- */}
                <SitePolicyItem
                    ref={policyUpdatesRef}
                    id="policy-updates"
                    title="13. Policy Updates"
                >
                    <div>
                        We may update this Privacy Policy from time to time.
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Major changes will be communicated via email or
                                platform notification.
                            </li>
                            <li>
                                Continued use of our services after changes
                                constitutes your acceptance of the updated
                                policy.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 14 --- */}
                <SitePolicyItem
                    ref={contactUsRef}
                    id="contact-us"
                    title="14. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For privacy-related questions or requests, please
                        contact:
                        <p className=" text-lg font-bold mt-2">
                            Zalven Lemuel Dayao
                        </p>
                        <p className="text-xs text-muted-foreground">
                            CEO, Lands Horizon Corp
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
            <div className="w-full h-fit lg:w-80 flex-shrink-0 border-b lg:border-l border-gray-200 dark:border-gray-700 px-4 py-8 sticky top-0 lg:h-screen overflow-y-auto">
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
