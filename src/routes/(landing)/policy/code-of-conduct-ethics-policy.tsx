import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useMemo, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute(
    '/(landing)/policy/code-of-conduct-ethics-policy'
)({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'core-values-and-principles') return 'Core Values & Principles'
    if (id === 'expected-standards-of-behavior')
        return 'Expected Standards of Behavior'
    if (id === 'confidentiality-and-data-protection')
        return 'Confidentiality & Data Protection'
    if (id === 'use-of-cooperative-resources')
        return 'Use of Cooperative Resources'
    if (id === 'compliance-and-reporting') return 'Compliance & Reporting'
    if (id === 'consequences-of-violations') return 'Consequences of Violations'
    if (id === 'policy-review-and-updates') return 'Policy Review & Updates'
    if (id === 'contact-information') return 'Contact Information'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const coreValuesPrinciplesRef = useRef<HTMLDivElement>(null)
    const expectedStandardsBehaviorRef = useRef<HTMLDivElement>(null)
    const confidentialityDataProtectionRef = useRef<HTMLDivElement>(null)
    const useCooperativeResourcesRef = useRef<HTMLDivElement>(null)
    const complianceReportingRef = useRef<HTMLDivElement>(null)
    const consequencesViolationsRef = useRef<HTMLDivElement>(null)
    const policyReviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactInformationRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(
        () => ({
            'purpose-and-scope': purposeScopeRef,
            'core-values-and-principles': coreValuesPrinciplesRef,
            'expected-standards-of-behavior': expectedStandardsBehaviorRef,
            'confidentiality-and-data-protection':
                confidentialityDataProtectionRef,
            'use-of-cooperative-resources': useCooperativeResourcesRef,
            'compliance-and-reporting': complianceReportingRef,
            'consequences-of-violations': consequencesViolationsRef,
            'policy-review-and-updates': policyReviewUpdatesRef,
            'contact-information': contactInformationRef,
        }),
        [
            purposeScopeRef,
            coreValuesPrinciplesRef,
            expectedStandardsBehaviorRef,
            confidentialityDataProtectionRef,
            useCooperativeResourcesRef,
            complianceReportingRef,
            consequencesViolationsRef,
            policyReviewUpdatesRef,
            contactInformationRef,
        ]
    )

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
                    Lands Horizon Code of Conduct / Ethics Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Code of Conduct/Ethics Policy sets forth the standards
                    for ethical behavior, integrity, and professionalism
                    expected of all members, staff, directors, and affiliated
                    individuals of Lands Horizon Corp (“we”, “us”, “our”) and
                    users of the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . Our goal is to foster a culture of trust, respect,
                    accountability, and excellence within the cooperative.
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
                                To promote ethical conduct and establish clear
                                expectations for all members, employees,
                                directors, and partners.
                            </li>
                            <li>
                                Applies to all activities, communications, and
                                transactions related to e-coop-suite.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Core Values and Principles --- */}
                <SitePolicyItem
                    ref={coreValuesPrinciplesRef}
                    id="core-values-and-principles"
                    title="2. Core Values and Principles"
                >
                    <div>
                        All individuals are expected to uphold and promote the
                        following:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                <strong>Integrity:</strong> Act honestly and
                                transparently in all dealings.
                            </li>
                            <li>
                                <strong>Respect:</strong> Treat others with
                                dignity, fairness, and courtesy.
                            </li>
                            <li>
                                <strong>Accountability:</strong> Take
                                responsibility for personal actions and
                                decisions.
                            </li>
                            <li>
                                <strong>Confidentiality:</strong> Protect
                                sensitive and personal information.
                            </li>
                            <li>
                                <strong>Compliance:</strong> Adhere strictly to
                                all applicable laws, regulations, and
                                organizational policies.
                            </li>
                            <li>
                                <strong>Professionalism:</strong> Maintain high
                                standards of conduct in all interactions.
                            </li>
                            <li>
                                <strong>Impartiality:</strong> Avoid conflicts
                                of interest and make decisions in the best
                                interest of the cooperative and its members.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Expected Standards of Behavior --- */}
                <SitePolicyItem
                    ref={expectedStandardsBehaviorRef}
                    id="expected-standards-of-behavior"
                    title="3. Expected Standards of Behavior"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Conduct all business and personal interactions
                                with honesty and integrity.
                            </li>
                            <li>
                                Avoid fraudulent, deceptive, or unethical
                                practices.
                            </li>
                            <li>
                                Refrain from discrimination, harassment,
                                bullying, or any form of abusive behavior.
                            </li>
                            <li>
                                Safeguard the cooperative’s assets, reputation,
                                and resources.
                            </li>
                            <li>
                                Use the cooperative’s digital platforms
                                responsibly and securely.
                            </li>
                            <li>
                                Report any potential breaches of law, policy, or
                                ethics promptly.
                            </li>
                            <li>
                                Cooperate fully with investigations and respect
                                the outcome of ethical reviews.
                            </li>
                            <li>
                                Avoid conflicts of interest and disclose any
                                situations that may influence objectivity.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Confidentiality and Data Protection --- */}
                <SitePolicyItem
                    ref={confidentialityDataProtectionRef}
                    id="confidentiality-and-data-protection"
                    title="4. Confidentiality and Data Protection"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Do not disclose confidential or proprietary
                                information to unauthorized individuals.
                            </li>
                            <li>
                                Handle personal and sensitive data in accordance
                                with the Data Protection Policy and relevant
                                laws.
                            </li>
                            <li>
                                Protect the privacy of all members, staff, and
                                stakeholders.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Use of Cooperative Resources --- */}
                <SitePolicyItem
                    ref={useCooperativeResourcesRef}
                    id="use-of-cooperative-resources"
                    title="5. Use of Cooperative Resources"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Use cooperative resources, property, and digital
                                platforms only for authorized purposes.
                            </li>
                            <li>
                                Prevent misuse, wastage, or unauthorized access
                                to cooperative assets.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Compliance and Reporting --- */}
                <SitePolicyItem
                    ref={complianceReportingRef}
                    id="compliance-and-reporting"
                    title="6. Compliance and Reporting"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Adhere at all times to this Code of
                                Conduct/Ethics Policy and all other relevant
                                policies and procedures.
                            </li>
                            <li>
                                Promptly report any violations, ethical
                                concerns, or suspicious activities through the
                                designated feedback form, email, or direct
                                contact with management.
                            </li>
                            <li>
                                No retaliation or adverse action will be taken
                                against anyone who, in good faith, reports a
                                suspected violation.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Consequences of Violations --- */}
                <SitePolicyItem
                    ref={consequencesViolationsRef}
                    id="consequences-of-violations"
                    title="7. Consequences of Violations"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Breaches of this policy may result in
                                disciplinary action, including but not limited
                                to warnings, suspension, termination of
                                membership or employment, and possible legal
                                action.
                            </li>
                            <li>
                                All violations will be investigated fairly and
                                confidentially.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Policy Review and Updates --- */}
                <SitePolicyItem
                    ref={policyReviewUpdatesRef}
                    id="policy-review-and-updates"
                    title="8. Policy Review and Updates"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                This policy will be reviewed regularly and
                                updated to reflect best practices and changes in
                                laws or organizational needs.
                            </li>
                            <li>
                                Significant changes will be communicated to all
                                members and stakeholders.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 9: Contact Information --- */}
                <SitePolicyItem
                    ref={contactInformationRef}
                    id="contact-information"
                    title="9. Contact Information"
                >
                    <div className="space-y-2 not-prose">
                        For questions or to report concerns regarding this
                        policy, please contact:
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
