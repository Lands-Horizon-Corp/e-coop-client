import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCallback, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute(
    '/(landing)/policy/risk-management-policy'
)({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'roles-and-responsibilities') return 'Roles & Responsibilities'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const riskManagementObjectivesRef = useRef<HTMLDivElement>(null)
    const typesOfRisksMonitoredRef = useRef<HTMLDivElement>(null)
    const riskIdentificationRef = useRef<HTMLDivElement>(null)
    const riskAssessmentEvaluationRef = useRef<HTMLDivElement>(null)
    const riskMitigationControlsRef = useRef<HTMLDivElement>(null)
    const monitoringReviewRef = useRef<HTMLDivElement>(null)
    const rolesResponsibilitiesRef = useRef<HTMLDivElement>(null)
    const policyReviewUpdatesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'risk-management-objectives': riskManagementObjectivesRef,
            'types-of-risks-monitored': typesOfRisksMonitoredRef,
            'risk-identification': riskIdentificationRef,
            'risk-assessment-and-evaluation': riskAssessmentEvaluationRef,
            'risk-mitigation-and-controls': riskMitigationControlsRef,
            'monitoring-and-review': monitoringReviewRef,
            'roles-and-responsibilities': rolesResponsibilitiesRef,
            'policy-review-and-updates': policyReviewUpdatesRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        riskManagementObjectivesRef,
        typesOfRisksMonitoredRef,
        riskIdentificationRef,
        riskAssessmentEvaluationRef,
        riskMitigationControlsRef,
        monitoringReviewRef,
        rolesResponsibilitiesRef,
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
                    Lands Horizon Risk Management Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Risk Management Policy outlines the framework and
                    procedures adopted by Lands Horizon Corp (“we”, “us”, or
                    “our”) to identify, assess, and manage risks associated with
                    the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . Our objective is to ensure the safety, stability, and
                    sustainability of the cooperative bank and its stakeholders.
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
                                To provide a structured approach to risk
                                management for all activities, operations, and
                                services on the e-coop-suite platform.
                            </li>
                            <li>
                                Applies to all users, members, cooperative
                                organizations, employees, and partners.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Risk Management Objectives --- */}
                <SitePolicyItem
                    ref={riskManagementObjectivesRef}
                    id="risk-management-objectives"
                    title="2. Risk Management Objectives"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Safeguard the assets, data, and interests of the
                                cooperative bank and its members.
                            </li>
                            <li>
                                Ensure compliance with legal and regulatory
                                requirements.
                            </li>
                            <li>
                                Promote a risk-aware culture across the
                                organization.
                            </li>
                            <li>
                                Enhance operational resilience and business
                                continuity.
                            </li>
                            <li>Support informed decision-making processes.</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Types of Risks Monitored --- */}
                <SitePolicyItem
                    ref={typesOfRisksMonitoredRef}
                    id="types-of-risks-monitored"
                    title="3. Types of Risks Monitored"
                >
                    <div>
                        We identify and monitor, but are not limited to, the
                        following categories of risk:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                <strong>Operational Risk:</strong> Risks arising
                                from internal processes, people, systems, or
                                external events.
                            </li>
                            <li>
                                <strong>Financial Risk:</strong> Risks related
                                to credit, liquidity, market fluctuations, and
                                capital adequacy.
                            </li>
                            <li>
                                <strong>Compliance and Legal Risk:</strong>{' '}
                                Risks of non-compliance with laws, regulations,
                                and contractual obligations.
                            </li>
                            <li>
                                <strong>
                                    Information Security and Cyber Risk:
                                </strong>{' '}
                                Risks of data breaches, cyberattacks, and
                                unauthorized access.
                            </li>
                            <li>
                                <strong>Strategic Risk:</strong> Risks
                                associated with business decisions, market
                                changes, and competition.
                            </li>
                            <li>
                                <strong>Reputational Risk:</strong> Risks that
                                may damage the trust and credibility of the
                                platform or its stakeholders.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Risk Identification --- */}
                <SitePolicyItem
                    ref={riskIdentificationRef}
                    id="risk-identification"
                    title="4. Risk Identification"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Risks are identified through regular risk
                                assessments, audits, user feedback, monitoring
                                of operations, and incident reporting.
                            </li>
                            <li>
                                Employees and users are encouraged to report
                                potential risks or vulnerabilities to
                                management.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Risk Assessment and Evaluation --- */}
                <SitePolicyItem
                    ref={riskAssessmentEvaluationRef}
                    id="risk-assessment-and-evaluation"
                    title="5. Risk Assessment and Evaluation"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Each identified risk is assessed for likelihood
                                and potential impact.
                            </li>
                            <li>
                                Risks are prioritized based on their severity,
                                probability, and potential consequences.
                            </li>
                            <li>
                                Risk registers and assessment tools are used to
                                document and monitor risks.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Risk Mitigation and Controls --- */}
                <SitePolicyItem
                    ref={riskMitigationControlsRef}
                    id="risk-mitigation-and-controls"
                    title="6. Risk Mitigation and Controls"
                >
                    <div>
                        Appropriate controls and procedures are implemented to
                        reduce or manage identified risks, such as:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Internal controls and segregation of duties</li>
                            <li>Automated monitoring and alerting systems</li>
                            <li>
                                Data encryption, access controls, and
                                cybersecurity measures
                            </li>
                            <li>
                                Regular staff training and awareness programs
                            </li>
                            <li>Insurance and financial safeguards</li>
                            <li>
                                Business continuity and disaster recovery
                                planning
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Monitoring and Review --- */}
                <SitePolicyItem
                    ref={monitoringReviewRef}
                    id="monitoring-and-review"
                    title="7. Monitoring and Review"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Risks and controls are regularly monitored,
                                tested, and reviewed to ensure effectiveness and
                                relevance.
                            </li>
                            <li>
                                Risk management practices are updated in
                                response to new threats, regulatory changes, and
                                business needs.
                            </li>
                            <li>
                                Regular internal audits and independent reviews
                                are conducted.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Roles and Responsibilities --- */}
                <SitePolicyItem
                    ref={rolesResponsibilitiesRef}
                    id="roles-and-responsibilities"
                    title="8. Roles and Responsibilities"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Senior management is responsible for overseeing
                                the risk management framework and ensuring
                                resources are allocated to manage risks
                                effectively.
                            </li>
                            <li>
                                All employees, users, and partners are
                                responsible for adhering to risk management
                                policies and reporting potential risks.
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
                                updated as needed to address emerging risks or
                                changes in operations or regulations.
                            </li>
                            <li>
                                Significant changes will be communicated to
                                users and stakeholders via email or platform
                                notification.
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
                        For questions or concerns about this Risk Management
                        Policy, please contact:
                        <p className=" text-lg font-bold mt-2">
                            Zalven Lemuel Dayao
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Risk Management Officer / CEO, Lands Horizon Corp
                        </p>
                        <p className="text-muted-foreground text-xs ">
                            Email:{' '}
                            <CopyWrapper className="text-xs">
                                <LinkTag name="lands.horizon.corp@gmail.com" />
                            </CopyWrapper>
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Phone:{' '}
                            <CopyWrapper className="">
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
