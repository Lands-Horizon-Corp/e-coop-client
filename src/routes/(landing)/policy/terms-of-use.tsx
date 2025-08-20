import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCallback, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/terms-of-use')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    const acceptanceOfTermsRef = useRef<HTMLDivElement>(null)
    const permittedUsesRef = useRef<HTMLDivElement>(null)
    const prohibitedUsesRef = useRef<HTMLDivElement>(null)
    const userResponsibilitiesRef = useRef<HTMLDivElement>(null)
    const intellectualPropertyRef = useRef<HTMLDivElement>(null)
    const terminationOfUseRef = useRef<HTMLDivElement>(null)
    const changesToTermsRef = useRef<HTMLDivElement>(null)
    const governingLawRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'acceptance-of-terms': acceptanceOfTermsRef,
            'permitted-uses': permittedUsesRef,
            'prohibited-uses': prohibitedUsesRef,
            'user-responsibilities': userResponsibilitiesRef,
            'intellectual-property': intellectualPropertyRef,
            'termination-of-use': terminationOfUseRef,
            'changes-to-terms': changesToTermsRef,
            'governing-law': governingLawRef,
            'contact-us': contactUsRef,
        }
    }, [
        acceptanceOfTermsRef,
        permittedUsesRef,
        prohibitedUsesRef,
        userResponsibilitiesRef,
        intellectualPropertyRef,
        terminationOfUseRef,
        changesToTermsRef,
        governingLawRef,
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
                    Lands Horizon Terms of Use
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    Welcome to e-coop-suite{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    , operated by Lands Horizon Corp (“we”, “our”, “us”). By
                    accessing or using our website and digital platforms, you
                    (“user”, “member”, “organization”) agree to comply with
                    these Terms of Use. Please read them carefully to ensure
                    safe and respectful use of our online resources.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1: Acceptance of Terms --- */}
                <SitePolicyItem
                    ref={acceptanceOfTermsRef}
                    id="acceptance-of-terms"
                    title="1. Acceptance of Terms"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                By using our website, applications, or any
                                related services, you agree to be bound by these
                                Terms of Use and any applicable laws and
                                regulations.
                            </li>
                            <li>
                                If you do not agree with any part of these
                                terms, please do not use our services.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Permitted Uses --- */}
                <SitePolicyItem
                    ref={permittedUsesRef}
                    id="permitted-uses"
                    title="2. Permitted Uses"
                >
                    <div>
                        You are permitted to use our digital platforms for the
                        following:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Creating and managing cooperative accounts and
                                memberships
                            </li>
                            <li>
                                Accessing and utilizing banking services such as
                                savings, loans, and payments
                            </li>
                            <li>
                                Managing member information and transactions
                            </li>
                            <li>
                                Accessing educational and informational
                                resources
                            </li>
                            <li>
                                Communicating with other cooperative members and
                                staff through provided tools
                            </li>
                            <li>
                                Other lawful activities consistent with the
                                goals of cooperative banking and management
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Prohibited Uses --- */}
                <SitePolicyItem
                    ref={prohibitedUsesRef}
                    id="prohibited-uses"
                    title="3. Prohibited Uses"
                >
                    <div>
                        You are strictly prohibited from:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Sharing your login credentials or allowing
                                unauthorized access to your account
                            </li>
                            <li>
                                Attempting to gain unauthorized access to other
                                users’ accounts or restricted areas of the
                                platform
                            </li>
                            <li>
                                Engaging in fraudulent, deceptive, or illegal
                                activities
                            </li>
                            <li>
                                Using bots, scripts, or automated means to
                                access or manipulate the platform
                            </li>
                            <li>
                                Uploading, sharing, or transmitting harmful
                                code, malware, or viruses
                            </li>
                            <li>
                                Misusing the platform to harass, abuse, or harm
                                others
                            </li>
                            <li>
                                Attempting to interfere with, disrupt, or
                                compromise the security or functionality of the
                                platform
                            </li>
                            <li>
                                Accessing, copying, or distributing content or
                                data without proper authorization
                            </li>
                            <li>
                                Circumventing or attempting to bypass any
                                security measures or usage restrictions
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: User Responsibilities --- */}
                <SitePolicyItem
                    ref={userResponsibilitiesRef}
                    id="user-responsibilities"
                    title="4. User Responsibilities"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Ensure the accuracy and completeness of
                                information provided on the platform
                            </li>
                            <li>
                                Protect your account by using a strong password
                                and updating it regularly
                            </li>
                            <li>
                                Report any suspicious activity or security
                                concerns to the platform administrators
                                immediately
                            </li>
                            <li>
                                Use the platform in a manner that respects the
                                rights and privacy of others
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Intellectual Property --- */}
                <SitePolicyItem
                    ref={intellectualPropertyRef}
                    id="intellectual-property"
                    title="5. Intellectual Property"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All content, trademarks, logos, and materials
                                provided on the platform are the property of
                                Lands Horizon Corp or its licensors, except
                                user-uploaded content which remains the property
                                of the user or their cooperative.
                            </li>
                            <li>
                                You may not use, copy, reproduce, or distribute
                                any content from the platform without prior
                                written permission, except for your own
                                cooperative’s data.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Termination of Use --- */}
                <SitePolicyItem
                    ref={terminationOfUseRef}
                    id="termination-of-use"
                    title="6. Termination of Use"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We reserve the right to suspend or terminate
                                your access to the platform at any time for
                                violation of these Terms of Use, security
                                concerns, or as required by law.
                            </li>
                            <li>
                                You may terminate your use of the platform at
                                any time by closing your account, subject to the
                                cooperative’s internal policies.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Changes to Terms --- */}
                <SitePolicyItem
                    ref={changesToTermsRef}
                    id="changes-to-terms"
                    title="7. Changes to Terms"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Lands Horizon Corp may update these Terms of Use
                                at any time.
                            </li>
                            <li>
                                Notice of significant changes will be provided
                                via email or platform notification.
                            </li>
                            <li>
                                Continued use of the platform after changes
                                constitutes your acceptance of the revised
                                terms.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Governing Law --- */}
                <SitePolicyItem
                    ref={governingLawRef}
                    id="governing-law"
                    title="8. Governing Law"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                These Terms of Use are governed by the laws of
                                the Philippines.
                            </li>
                            <li>
                                Any disputes will be subject to the exclusive
                                jurisdiction of the Philippine courts.
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
                        For questions or concerns regarding these Terms of Use,
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
