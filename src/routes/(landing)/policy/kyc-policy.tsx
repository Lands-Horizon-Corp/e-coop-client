import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useRef } from 'react'
import { useMemo } from 'react'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/kyc-policy')({
    component: RouteComponent,
})
const formatSectionTitle = (id: string): string => {
    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const kycRequirementsRef = useRef<HTMLDivElement>(null)
    const kycProcessRef = useRef<HTMLDivElement>(null)
    const ongoingMonitoringRef = useRef<HTMLDivElement>(null)
    const dataProtectionRef = useRef<HTMLDivElement>(null)
    const failureToComplyRef = useRef<HTMLDivElement>(null)
    const recordKeepingRef = useRef<HTMLDivElement>(null)
    const reviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'kyc-requirements': kycRequirementsRef,
            'kyc-process': kycProcessRef,
            'ongoing-monitoring': ongoingMonitoringRef,
            'data-protection': dataProtectionRef,
            'failure-to-comply': failureToComplyRef,
            'record-keeping': recordKeepingRef,
            'review-and-updates': reviewUpdatesRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        kycRequirementsRef,
        kycProcessRef,
        ongoingMonitoringRef,
        dataProtectionRef,
        failureToComplyRef,
        recordKeepingRef,
        reviewUpdatesRef,
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
                    Lands Horizon Know Your Customer (KYC) Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Know Your Customer (KYC) Policy outlines the procedures
                    of Lands Horizon Corp (“we”, “us”, “our”) for verifying the
                    identity of members and organizations on e-coop-suite{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . Our goal is to prevent fraud, support financial
                    transparency, and ensure compliance with legal and
                    regulatory requirements in the Philippines.
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
                                To verify the identity of all users and
                                organizations using e-coop-suite.
                            </li>
                            <li>
                                To prevent fraudulent activities, identity
                                theft, and other financial crimes.
                            </li>
                            <li>
                                To comply with the Anti-Money Laundering Act
                                (AMLA) and other related regulations.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: KYC Requirements --- */}
                <SitePolicyItem
                    ref={kycRequirementsRef}
                    id="kyc-requirements"
                    title="2. KYC Requirements"
                >
                    <div>
                        We require the following information and documents from
                        all users and organizations:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Full name (as shown on a valid government-issued
                                ID)
                            </li>
                            <li>Email address and contact number</li>
                            <li>Residential or business address</li>
                            <li>
                                Government-issued identification (e.g.,
                                passport, driver’s license, national ID)
                            </li>
                            <li>Location information</li>
                            <li>
                                For organizations: official registration details
                                and authorized representative information
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: KYC Process --- */}
                <SitePolicyItem
                    ref={kycProcessRef}
                    id="kyc-process"
                    title="3. KYC Process"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All users must provide accurate and up-to-date
                                information during the registration process.
                            </li>
                            <li>
                                Users may be required to upload scanned copies
                                or photos of identification documents.
                            </li>
                            <li>
                                Our system verifies the submitted information
                                for authenticity and completeness.
                            </li>
                            <li>
                                Additional verification measures may be applied
                                for high-risk users or transactions.
                            </li>
                            <li>
                                Periodic re-verification may be conducted to
                                ensure information remains current.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Ongoing Monitoring --- */}
                <SitePolicyItem
                    ref={ongoingMonitoringRef}
                    id="ongoing-monitoring"
                    title="4. Ongoing Monitoring"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                User activity and transactions are continuously
                                monitored to detect suspicious or unusual
                                behavior.
                            </li>
                            <li>
                                Any inconsistencies or red flags may trigger a
                                request for additional information or
                                re-verification.
                            </li>
                            <li>
                                Enhanced due diligence is performed for users or
                                transactions deemed high risk.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Data Protection --- */}
                <SitePolicyItem
                    ref={dataProtectionRef}
                    id="data-protection"
                    title="5. Data Protection"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All personal and organizational data collected
                                during the KYC process is encrypted and securely
                                stored.
                            </li>
                            <li>
                                Access to KYC data is restricted to authorized
                                personnel only.
                            </li>
                            <li>
                                We comply with the Philippine Data Privacy Act
                                and implement strict security measures to
                                protect your information.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Failure to Comply --- */}
                <SitePolicyItem
                    ref={failureToComplyRef}
                    id="failure-to-comply"
                    title="6. Failure to Comply"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Users or organizations that fail to provide
                                required KYC information or whose information
                                cannot be verified may have their accounts
                                restricted, suspended, or terminated.
                            </li>
                            <li>
                                We reserve the right to decline or terminate any
                                account that poses a risk or fails to meet KYC
                                standards.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Record Keeping --- */}
                <SitePolicyItem
                    ref={recordKeepingRef}
                    id="record-keeping"
                    title="7. Record Keeping"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                KYC records are maintained for at least five (5)
                                years after the closure of an account, or as
                                required by law.
                            </li>
                            <li>
                                All records are kept secure and confidential.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Review and Updates --- */}
                <SitePolicyItem
                    ref={reviewUpdatesRef}
                    id="review-and-updates"
                    title="8. Review and Updates"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                This policy is reviewed regularly and updated to
                                comply with evolving laws, regulations, and best
                                practices.
                            </li>
                            <li>
                                Significant changes will be communicated to
                                users via email or platform notification.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 9: Contact Us --- */}
                <SitePolicyItem
                    ref={contactUsRef}
                    id="contact-us"
                    title="9. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For questions or concerns about our KYC Policy, please
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
