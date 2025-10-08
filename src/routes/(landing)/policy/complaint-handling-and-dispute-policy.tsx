import { useCallback, useMemo, useRef } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute(
    '/(landing)/policy/complaint-handling-and-dispute-policy'
)({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'how-to-lodge-a-complaint') return 'How to Lodge a Complaint'
    if (id === 'complaint-handling-process') return 'Complaint Handling Process'
    if (id === 'dispute-resolution') return 'Dispute Resolution'
    if (id === 'record-keeping') return 'Record Keeping'
    if (id === 'continuous-improvement') return 'Continuous Improvement'
    if (id === 'contact-us') return 'Contact Us'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const howToLodgeComplaintRef = useRef<HTMLDivElement>(null)
    const complaintHandlingProcessRef = useRef<HTMLDivElement>(null)
    const disputeResolutionRef = useRef<HTMLDivElement>(null)
    const recordKeepingRef = useRef<HTMLDivElement>(null)
    const continuousImprovementRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'how-to-lodge-a-complaint': howToLodgeComplaintRef,
            'complaint-handling-process': complaintHandlingProcessRef,
            'dispute-resolution': disputeResolutionRef,
            'record-keeping': recordKeepingRef,
            'continuous-improvement': continuousImprovementRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        howToLodgeComplaintRef,
        complaintHandlingProcessRef,
        disputeResolutionRef,
        recordKeepingRef,
        continuousImprovementRef,
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
                    Lands Horizon Complaint Handling and Dispute Resolution
                    Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This policy describes the procedures of Lands Horizon Corp
                    (“we”, “us”, “our”) for handling complaints and resolving
                    disputes on the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            name={` (http://ecoop-suite.com/)`}
                            target="_blank"
                        />
                    </span>
                    . We are committed to ensuring that all complaints and
                    disputes are addressed fairly, promptly, and transparently.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1: Purpose and Scope --- */}
                <SitePolicyItem
                    id="purpose-and-scope"
                    ref={purposeScopeRef}
                    title="1. Purpose and Scope"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                To provide a clear and accessible process for
                                members to lodge complaints and resolve
                                disputes.
                            </li>
                            <li>
                                Applies to all users, members, cooperatives, and
                                organizations using e-coop-suite.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: How to Lodge a Complaint --- */}
                <SitePolicyItem
                    id="how-to-lodge-a-complaint"
                    ref={howToLodgeComplaintRef}
                    title="2. How to Lodge a Complaint"
                >
                    <div>
                        Members can submit complaints through any of the
                        following channels:
                        <br />
                        <br />
                        <strong>Online Feedback Form:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Available on the homepage or footer of the
                                e-coop-suite platform.
                            </li>
                        </ul>
                        <br />
                        <strong>Email:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Send your complaint to{' '}
                                <LinkTag
                                    href="mailto:lands.horizon.corp@gmail.com"
                                    name="lands.horizon.corp@gmail.com"
                                />{' '}
                                with a clear description of the issue and any
                                supporting documentation.
                            </li>
                        </ul>
                        <br />
                        <strong>Phone:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Contact our support hotline at +63 991 617 1081.
                            </li>
                        </ul>
                        <br />
                        <strong>Address:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Address your written complaint to:
                                <br />
                                BLK 5 LOT 49, MAKADIYOS STREET
                                <br />
                                VILLA MUZON SUBD, MUZON EAST
                                <br />
                                CITY OF SAN JOSE DEL MONTE
                                <br />
                                BULACAN, REGION III (CENTRAL LUZON), 3023,
                                PHILIPPINES
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Complaint Handling Process --- */}
                <SitePolicyItem
                    id="complaint-handling-process"
                    ref={complaintHandlingProcessRef}
                    title="3. Complaint Handling Process"
                >
                    <div>
                        <strong>Acknowledgment:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                All complaints will be acknowledged within three
                                (3) business days of receipt.
                            </li>
                        </ul>
                        <br />
                        <strong>Investigation:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                We will investigate the complaint thoroughly and
                                may request additional information from the
                                complainant if necessary.
                            </li>
                        </ul>
                        <br />
                        <strong>Resolution:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                We aim to resolve all complaints within fifteen
                                (15) business days. If more time is needed, we
                                will keep the complainant informed of progress
                                and expected resolution timelines.
                            </li>
                        </ul>
                        <br />
                        <strong>Communication:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                The outcome of the investigation and the
                                resolution will be communicated to the
                                complainant via their preferred contact method
                                (email, phone, or mail).
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Dispute Resolution --- */}
                <SitePolicyItem
                    id="dispute-resolution"
                    ref={disputeResolutionRef}
                    title="4. Dispute Resolution"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                If a complaint is not resolved to the
                                satisfaction of the member, the issue may be
                                escalated to higher management or an independent
                                mediator.
                            </li>
                            <li>
                                Internal mediation between parties (such as
                                between a member and their cooperative) is
                                encouraged before involving external parties.
                            </li>
                            <li>
                                For unresolved disputes involving financial or
                                legal matters, parties may seek resolution
                                through appropriate regulatory authorities or
                                the courts in the Philippines.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Record Keeping --- */}
                <SitePolicyItem
                    id="record-keeping"
                    ref={recordKeepingRef}
                    title="5. Record Keeping"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All complaints and dispute cases are documented
                                and retained for at least five (5) years, in
                                accordance with legal and regulatory
                                requirements.
                            </li>
                            <li>
                                Records are kept confidential and are accessible
                                only to authorized personnel.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Continuous Improvement --- */}
                <SitePolicyItem
                    id="continuous-improvement"
                    ref={continuousImprovementRef}
                    title="6. Continuous Improvement"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We regularly review complaints and dispute data
                                to identify trends and improve our products,
                                services, and processes.
                            </li>
                            <li>
                                Feedback from complaints is used constructively
                                to enhance member experience and platform
                                operations.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Contact Us --- */}
                <SitePolicyItem
                    id="contact-us"
                    ref={contactUsRef}
                    title="7. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For questions about this policy or to lodge a complaint,
                        please contact:
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
