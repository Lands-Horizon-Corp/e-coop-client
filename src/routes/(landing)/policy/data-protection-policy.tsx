import { useCallback, useRef } from 'react'
import { useMemo } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/data-protection-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'staff-responsibilities-and-training')
        return 'Staff Responsibilities & Training'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const dataWeProtectRef = useRef<HTMLDivElement>(null)
    const principlesDataProtectionRef = useRef<HTMLDivElement>(null)
    const securityMeasuresRef = useRef<HTMLDivElement>(null)
    const dataSubjectRightsRef = useRef<HTMLDivElement>(null)
    const dataSharingDisclosureRef = useRef<HTMLDivElement>(null)
    const dataBreachNotificationRef = useRef<HTMLDivElement>(null)
    const staffResponsibilitiesTrainingRef = useRef<HTMLDivElement>(null)
    const policyReviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'data-we-protect': dataWeProtectRef,
            'principles-of-data-protection': principlesDataProtectionRef,
            'security-measures': securityMeasuresRef,
            'data-subject-rights': dataSubjectRightsRef,
            'data-sharing-and-disclosure': dataSharingDisclosureRef,
            'data-breach-notification': dataBreachNotificationRef,
            'staff-responsibilities-and-training':
                staffResponsibilitiesTrainingRef,
            'policy-review-and-updates': policyReviewUpdatesRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        dataWeProtectRef,
        principlesDataProtectionRef,
        securityMeasuresRef,
        dataSubjectRightsRef,
        dataSharingDisclosureRef,
        dataBreachNotificationRef,
        staffResponsibilitiesTrainingRef,
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
                    Lands Horizon Data Protection Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Data Protection Policy describes how Lands Horizon Corp
                    (“we”, “us”, or “our”) protects personal and sensitive data
                    on the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . We are committed to upholding the highest standards of
                    data privacy and security in accordance with the Data
                    Privacy Act of 2012 (Republic Act No. 10173) and other
                    applicable laws and best practices in the Philippines.
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
                                To outline our commitment to the protection of
                                all personal and sensitive information processed
                                on our platform.
                            </li>
                            <li>
                                This policy applies to all data subjects,
                                including users, members, cooperative
                                organizations, employees, and third-party
                                partners.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Data We Protect --- */}
                <SitePolicyItem
                    ref={dataWeProtectRef}
                    id="data-we-protect"
                    title="2. Data We Protect"
                >
                    <div>
                        We protect all types of data we collect and process,
                        including:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Personal information (name, contact details,
                                address, government ID)
                            </li>
                            <li>
                                Sensitive personal information (financial data,
                                transaction history, location, organization
                                data)
                            </li>
                            <li>
                                Any other information that can identify, or be
                                used to identify, an individual
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Principles of Data Protection --- */}
                <SitePolicyItem
                    ref={principlesDataProtectionRef}
                    id="principles-of-data-protection"
                    title="3. Principles of Data Protection"
                >
                    <div>
                        We are guided by the following principles:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                <strong>Transparency:</strong> Users are
                                informed about the collection and use of their
                                data.
                            </li>
                            <li>
                                <strong>Legitimacy and Lawfulness:</strong> Data
                                is collected and processed lawfully and fairly.
                            </li>
                            <li>
                                <strong>Purpose Limitation:</strong> Data is
                                collected for specified, legitimate purposes
                                only.
                            </li>
                            <li>
                                <strong>Data Minimization:</strong> Only data
                                necessary for our operations and compliance is
                                collected.
                            </li>
                            <li>
                                <strong>Accuracy:</strong> We ensure data is
                                accurate, complete, and up to date.
                            </li>
                            <li>
                                <strong>Storage Limitation:</strong> Data is
                                retained only as long as necessary for business,
                                legal, or regulatory purposes.
                            </li>
                            <li>
                                <strong>Integrity and Confidentiality:</strong>{' '}
                                Data is protected from unauthorized or unlawful
                                processing, access, or disclosure.
                            </li>
                            <li>
                                <strong>Accountability:</strong> We take
                                responsibility for complying with data
                                protection laws and best practices.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Security Measures --- */}
                <SitePolicyItem
                    ref={securityMeasuresRef}
                    id="security-measures"
                    title="4. Security Measures"
                >
                    <div>
                        To ensure the safety and integrity of data, we
                        implement:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Encryption of data at rest and in transit</li>
                            <li>Access controls based on user roles (RBAC)</li>
                            <li>
                                Secure authentication and password hashing
                                (e.g., Argon2)
                            </li>
                            <li>
                                Regular security audits, risk assessments, and
                                vulnerability scans
                            </li>
                            <li>
                                Protection against XSS, CSRF, SQL injection,
                                brute force, and other cyber threats
                            </li>
                            <li>
                                Secure storage infrastructure and data backup
                            </li>
                            <li>
                                Monitoring and logging of access and activity
                            </li>
                            <li>Immediate incident response procedures</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Data Subject Rights --- */}
                <SitePolicyItem
                    ref={dataSubjectRightsRef}
                    id="data-subject-rights"
                    title="5. Data Subject Rights"
                >
                    <div>
                        All users and data subjects have the right to:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Access their personal data</li>
                            <li>
                                Request correction or deletion of incorrect or
                                outdated data
                            </li>
                            <li>
                                Object to or restrict processing (where
                                applicable)
                            </li>
                            <li>
                                Withdraw consent at any time (where applicable)
                            </li>
                            <li>
                                Data portability (receive their data in a
                                structured format)
                            </li>
                            <li>File a complaint regarding data handling</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Data Sharing and Disclosure --- */}
                <SitePolicyItem
                    ref={dataSharingDisclosureRef}
                    id="data-sharing-and-disclosure"
                    title="6. Data Sharing and Disclosure"
                >
                    <div>
                        Personal and sensitive data is not shared with third
                        parties except:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>With explicit user consent</li>
                            <li>As required by law or regulation</li>
                            <li>
                                With trusted partners and service providers
                                under strict data protection agreements
                            </li>
                        </ul>
                        All third-party access is controlled, audited, and
                        subject to RBAC permissions and executive approval.
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Data Breach Notification --- */}
                <SitePolicyItem
                    ref={dataBreachNotificationRef}
                    id="data-breach-notification"
                    title="7. Data Breach Notification"
                >
                    <div>
                        In the event of a data breach, affected users and
                        relevant authorities will be notified promptly, in
                        accordance with legal and regulatory requirements. We
                        will take immediate steps to contain, investigate, and
                        mitigate breaches.
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Staff Responsibilities and Training --- */}
                <SitePolicyItem
                    ref={staffResponsibilitiesTrainingRef}
                    id="staff-responsibilities-and-training"
                    title="8. Staff Responsibilities and Training"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All employees, contractors, and partners are
                                required to adhere to this policy.
                            </li>
                            <li>
                                Regular training is provided to ensure awareness
                                of data protection responsibilities and best
                                practices.
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
                                This policy is reviewed regularly and updated to
                                comply with changes in laws, regulations, or
                                business practices.
                            </li>
                            <li>
                                Users will be notified of significant changes
                                via email or platform notice.
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
                        For questions, concerns, or to exercise your data
                        protection rights, please contact:
                        <p className=" text-lg font-bold mt-2">
                            Zalven Lemuel Dayao
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Data Protection Officer / CEO, Lands Horizon Corp
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
