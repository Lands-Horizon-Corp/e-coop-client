import { useCallback, useMemo, useRef } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/aml-ctf-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'customer-due-diligence-and-know-your-customer')
        return 'Customer Due Diligence & KYC'
    if (id === 'reporting-suspicious-activities')
        return 'Reporting Suspicious Activities'
    if (id === 'staff-training-and-awareness')
        return 'Staff Training & Awareness'
    if (id === 'compliance-and-cooperation') return 'Compliance & Cooperation'
    if (id === 'sanctions-and-enforcement') return 'Sanctions & Enforcement'
    if (id === 'policy-review-and-updates') return 'Policy Review & Updates'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const cddKycRef = useRef<HTMLDivElement>(null)
    const transactionMonitoringRef = useRef<HTMLDivElement>(null)
    const recordKeepingRef = useRef<HTMLDivElement>(null)
    const reportingSuspiciousActivitiesRef = useRef<HTMLDivElement>(null)
    const staffTrainingAwarenessRef = useRef<HTMLDivElement>(null)
    const complianceCooperationRef = useRef<HTMLDivElement>(null)
    const sanctionsEnforcementRef = useRef<HTMLDivElement>(null)
    const policyReviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(
        () => ({
            'purpose-and-scope': purposeScopeRef,
            'customer-due-diligence-and-know-your-customer': cddKycRef,
            'transaction-monitoring': transactionMonitoringRef,
            'record-keeping': recordKeepingRef,
            'reporting-suspicious-activities': reportingSuspiciousActivitiesRef,
            'staff-training-and-awareness': staffTrainingAwarenessRef,
            'compliance-and-cooperation': complianceCooperationRef,
            'sanctions-and-enforcement': sanctionsEnforcementRef,
            'policy-review-and-updates': policyReviewUpdatesRef,
            'contact-us': contactUsRef,
        }),
        [
            purposeScopeRef,
            cddKycRef,
            transactionMonitoringRef,
            recordKeepingRef,
            reportingSuspiciousActivitiesRef,
            staffTrainingAwarenessRef,
            complianceCooperationRef,
            sanctionsEnforcementRef,
            policyReviewUpdatesRef,
            contactUsRef,
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
                    Lands Horizon Anti-Money Laundering (AML) and
                    Counter-Terrorism Financing (CTF) Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This policy describes the measures and procedures
                    implemented by Lands Horizon Corp (“we”, “us”, “our”) to
                    detect, prevent, and report activities related to money
                    laundering and terrorist financing. We are committed to
                    complying with all applicable laws and regulations in the
                    Philippines, including the Anti-Money Laundering Act (AMLA),
                    its amendments, and relevant guidelines.
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
                                To protect the integrity of e-coop-suite{' '}
                                <LinkTag
                                    href="http://ecoop-suite.com/"
                                    target="_blank"
                                    name={` (http://ecoop-suite.com/)`}
                                />{' '}
                                and its users from involvement in money
                                laundering or terrorist financing activities.
                            </li>
                            <li>
                                Applies to all users, members, cooperatives,
                                employees, and transactions conducted through
                                our platform.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Customer Due Diligence (CDD) and Know Your Customer (KYC) --- */}
                <SitePolicyItem
                    ref={cddKycRef}
                    id="customer-due-diligence-and-know-your-customer"
                    title="2. Customer Due Diligence (CDD) and Know Your Customer (KYC)"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All users and organizations must provide valid
                                identification and verification documents upon
                                registration.
                            </li>
                            <li>
                                Required information includes (but is not
                                limited to): full name, contact information,
                                address, government-issued ID, and location.
                            </li>
                            <li>
                                Ongoing monitoring of user activity and periodic
                                updates of KYC information are conducted.
                            </li>
                            <li>
                                Enhanced due diligence is applied for high-risk
                                users, transactions, or jurisdictions.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Transaction Monitoring --- */}
                <SitePolicyItem
                    ref={transactionMonitoringRef}
                    id="transaction-monitoring"
                    title="3. Transaction Monitoring"
                >
                    <div>
                        All transactions are subject to automated and manual
                        monitoring for unusual or suspicious activity, such as:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Large, frequent, or irregular transactions
                                inconsistent with user profile
                            </li>
                            <li>
                                Transactions involving high-risk countries or
                                entities
                            </li>
                            <li>
                                Complex or unnecessarily layered transactions
                            </li>
                        </ul>
                        Alerts are generated for further review and
                        investigation by compliance staff.
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Record Keeping --- */}
                <SitePolicyItem
                    ref={recordKeepingRef}
                    id="record-keeping"
                    title="4. Record Keeping"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Records of customer identification,
                                transactions, and related documents are securely
                                retained for at least five (5) years after
                                account closure or as required by law.
                            </li>
                            <li>
                                All records are encrypted and access is
                                restricted to authorized personnel only.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Reporting Suspicious Activities --- */}
                <SitePolicyItem
                    ref={reportingSuspiciousActivitiesRef}
                    id="reporting-suspicious-activities"
                    title="5. Reporting Suspicious Activities"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Any suspicious activity or transaction is
                                promptly reported to the Anti-Money Laundering
                                Council (AMLC) and other relevant authorities as
                                required by law.
                            </li>
                            <li>
                                Employees and users are encouraged to report
                                suspicious behavior to the designated compliance
                                officer.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Staff Training and Awareness --- */}
                <SitePolicyItem
                    ref={staffTrainingAwarenessRef}
                    id="staff-training-and-awareness"
                    title="6. Staff Training and Awareness"
                >
                    <div>
                        All relevant employees, administrators, and agents
                        receive regular AML/CTF training, including:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Identifying suspicious activities</li>
                            <li>Reporting obligations</li>
                            <li>Legal and regulatory updates</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Compliance and Cooperation --- */}
                <SitePolicyItem
                    ref={complianceCooperationRef}
                    id="compliance-and-cooperation"
                    title="7. Compliance and Cooperation"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We fully cooperate with law enforcement agencies
                                and regulatory bodies in the investigation and
                                prosecution of money laundering and terrorism
                                financing offenses.
                            </li>
                            <li>
                                Regular internal audits and policy reviews are
                                conducted to ensure ongoing compliance with
                                AML/CTF regulations.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Sanctions and Enforcement --- */}
                <SitePolicyItem
                    ref={sanctionsEnforcementRef}
                    id="sanctions-and-enforcement"
                    title="8. Sanctions and Enforcement"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Any user or organization found violating this
                                policy may be subject to account suspension,
                                termination, and reporting to authorities.
                            </li>
                            <li>
                                Employees who fail to comply with this policy
                                may face disciplinary action, including
                                dismissal.
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
                                This policy is reviewed and updated regularly to
                                reflect changes in legislation, technology, and
                                business practices.
                            </li>
                            <li>
                                Users will be notified of any significant
                                changes via email or platform notice.
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
                        For questions or to report suspicious activity, contact:
                        <p className=" text-lg font-bold mt-2">
                            Zalven Lemuel Dayao
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Compliance Officer / CEO, Lands Horizon Corp
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
