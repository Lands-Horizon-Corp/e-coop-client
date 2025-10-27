import { useMemo } from 'react'
import { useCallback, useRef } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/developer-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'api-key-management') return 'API Key Management'
    if (id === 'acceptable-use') return 'Acceptable Use'
    if (id === 'security-and-privacy') return 'Security & Privacy'
    if (id === 'revocation-and-suspension') return 'Revocation & Suspension'
    if (id === 'updates-to-the-policy') return 'Updates to the Policy'
    if (id === 'support-and-contact') return 'Support & Contact'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const eligibilityRegistrationRef = useRef<HTMLDivElement>(null)
    const apiKeyManagementRef = useRef<HTMLDivElement>(null)
    const acceptableUseRef = useRef<HTMLDivElement>(null)
    const securityPrivacyRef = useRef<HTMLDivElement>(null)
    const revocationSuspensionRef = useRef<HTMLDivElement>(null)
    const updatesPolicyRef = useRef<HTMLDivElement>(null)
    const supportContactRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'eligibility-and-registration': eligibilityRegistrationRef,
            'api-key-management': apiKeyManagementRef,
            'acceptable-use': acceptableUseRef,
            'security-and-privacy': securityPrivacyRef,
            'revocation-and-suspension': revocationSuspensionRef,
            'updates-to-the-policy': updatesPolicyRef,
            'support-and-contact': supportContactRef,
        }
    }, [
        eligibilityRegistrationRef,
        apiKeyManagementRef,
        acceptableUseRef,
        securityPrivacyRef,
        revocationSuspensionRef,
        updatesPolicyRef,
        supportContactRef,
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
            <div className="flex-1 overflow-y-auto ecoop-scroll px-4 py-8   h-[calc(100vh-theme(spacing.16))]">
                <h1 className="text-3xl font-bold mb-4">
                    Lands Horizon Developer API Access Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This policy outlines the requirements and guidelines for
                    accessing and using the Developer API provided by Lands
                    Horizon Corp through the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            name={` (http://ecoop-suite.com/)`}
                            target="_blank"
                        />
                    </span>
                    . The API is designed to empower developers to build
                    integrations and custom solutions for cooperatives, while
                    maintaining security and compliance.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1: Eligibility and Registration --- */}
                <SitePolicyItem
                    id="eligibility-and-registration"
                    ref={eligibilityRegistrationRef}
                    title="1. Eligibility and Registration"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                API access is available exclusively to
                                registered users who are members of an approved
                                organization within e-coop-suite.
                            </li>
                            <li>
                                Developers must first create an account and then
                                request to join or create an organization on the
                                platform.
                            </li>
                            <li>
                                Organization membership is required for API key
                                issuance and usage.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: API Key Management --- */}
                <SitePolicyItem
                    id="api-key-management"
                    ref={apiKeyManagementRef}
                    title="2. API Key Management"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                API keys are issued only to verified
                                organizational accounts.
                            </li>
                            <li>
                                Each organization is responsible for managing
                                its issued API keys and the actions performed
                                with them.
                            </li>
                            <li>
                                API keys must be kept confidential and never
                                shared outside the organization.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Acceptable Use --- */}
                <SitePolicyItem
                    id="acceptable-use"
                    ref={acceptableUseRef}
                    title="3. Acceptable Use"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                The API may only be used for lawful purposes,
                                and in accordance with the platform’s Terms of
                                Service and all applicable laws.
                            </li>
                            <li>
                                Use of the API must not compromise the security,
                                stability, or performance of e-coop-suite or its
                                users.
                            </li>
                            <li>
                                Automated or bulk actions must comply with
                                published rate limits and fair use standards.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Security and Privacy --- */}
                <SitePolicyItem
                    id="security-and-privacy"
                    ref={securityPrivacyRef}
                    title="4. Security and Privacy"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Developers are responsible for the security of
                                their API integrations and for protecting any
                                data accessed or processed.
                            </li>
                            <li>
                                All data accessed via the API must be handled in
                                accordance with our Data Protection Policy.
                            </li>
                            <li>
                                Unauthorized access, attempts to bypass
                                security, or abuse of API endpoints will result
                                in immediate suspension and possible legal
                                action.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Revocation and Suspension --- */}
                <SitePolicyItem
                    id="revocation-and-suspension"
                    ref={revocationSuspensionRef}
                    title="5. Revocation and Suspension"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Lands Horizon Corp reserves the right to revoke
                                or suspend API access for any organization or
                                user found in violation of this policy, our
                                platform rules, or applicable law.
                            </li>
                            <li>
                                API access may also be suspended for reasons of
                                security, maintenance, or platform integrity.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Updates to the Policy --- */}
                <SitePolicyItem
                    id="updates-to-the-policy"
                    ref={updatesPolicyRef}
                    title="6. Updates to the Policy"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                This policy may be updated periodically to
                                reflect changes in our API offerings, security
                                practices, or legal obligations.
                            </li>
                            <li>
                                Substantial changes will be communicated to
                                registered developers and organizations via
                                email or platform notification.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Support and Contact --- */}
                <SitePolicyItem
                    id="support-and-contact"
                    ref={supportContactRef}
                    title="7. Support and Contact"
                >
                    <div>
                        For questions regarding API access, eligibility, or
                        policy terms, please contact:
                        <br />
                        <strong>Zalven Lemuel Dayao</strong>
                        <br />
                        CEO, Lands Horizon Corp
                        <br />
                        Email:{' '}
                        <LinkTag
                            href="zalvendayao888@gmail.com"
                            name="zalvendayao888@gmail.com"
                        />
                        <br />
                        Phone: +63 991 617 1081
                        <br />
                        <br />
                        Address:
                        <br />
                        BLK 5 LOT 49, MAKADIYOS STREET
                        <br />
                        VILLA MUZON SUBD, MUZON EAST
                        <br />
                        CITY OF SAN JOSE DEL MONTE
                        <br />
                        BULACAN, REGION III (CENTRAL LUZON), 3023, PHILIPPINES
                    </div>
                </SitePolicyItem>
            </div>

            {/* Table of Contents (Right Sidebar) */}
            <div className="hidden lg:block w-80 flex-shrink-0   px-4 py-8 sticky top-0 h-screen overflow-y-auto">
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    In this article
                </h4>{' '}
                <nav className="list-none space-y-2">
                    {articleList.map((sectionId, idx) => (
                        <li key={sectionId}>
                            <a
                                className="block py-1 text-primary hover:underline cursor-pointer text-sm"
                                href={`#${sectionId}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    scrollToSection(sectionId)
                                }}
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
