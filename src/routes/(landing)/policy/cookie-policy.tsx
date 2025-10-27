import { useCallback, useRef } from 'react'
import { useMemo } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/cookie-policy')({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'what-are-cookies') return 'What Are Cookies?'
    if (id === 'what-data-is-collected') return 'What Data is Collected'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const whatAreCookiesRef = useRef<HTMLDivElement>(null)
    const typesOfCookiesRef = useRef<HTMLDivElement>(null)
    const whatDataCollectedRef = useRef<HTMLDivElement>(null)
    const howWeUseCookiesRef = useRef<HTMLDivElement>(null)
    const managingCookiesRef = useRef<HTMLDivElement>(null)
    const thirdPartyCookiesRef = useRef<HTMLDivElement>(null)
    const changesToPolicyRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'what-are-cookies': whatAreCookiesRef,
            'types-of-cookies-we-use': typesOfCookiesRef,
            'what-data-is-collected': whatDataCollectedRef,
            'how-we-use-cookies': howWeUseCookiesRef,
            'managing-cookies': managingCookiesRef,
            'third-party-cookies': thirdPartyCookiesRef,
            'changes-to-this-policy': changesToPolicyRef,
            'contact-us': contactUsRef,
        }
    }, [
        whatAreCookiesRef,
        typesOfCookiesRef,
        whatDataCollectedRef,
        howWeUseCookiesRef,
        managingCookiesRef,
        thirdPartyCookiesRef,
        changesToPolicyRef,
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
            <div className="flex-1 overflow-y-auto ecoop-scroll px-4 py-8   h-[calc(100vh-theme(spacing.16))]">
                <h1 className="text-3xl font-bold mb-4">
                    Lands Horizon Cookie Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Cookie Policy describes how Lands Horizon Corp (“we”,
                    “us”, or “our”) uses cookies and similar tracking
                    technologies on the e-coop-suite platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            name={` (http://ecoop-suite.com/)`}
                            target="_blank"
                        />
                    </span>
                    . By using our website or digital services, you agree to the
                    placement and use of cookies as described below.
                    <Separator className="my-5 h-1" />
                </p>

                {/* --- Section 1: What Are Cookies? --- */}
                <SitePolicyItem
                    id="what-are-cookies"
                    ref={whatAreCookiesRef}
                    title="1. What Are Cookies?"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Cookies are small text files stored on your
                                device by your web browser when you visit a
                                website.
                            </li>
                            <li>
                                Cookies help us recognize your device, remember
                                your preferences, and enhance your user
                                experience.
                            </li>
                            <li>
                                We may also use other tracking technologies such
                                as web beacons, pixels, or local storage.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Types of Cookies We Use --- */}
                <SitePolicyItem
                    id="types-of-cookies-we-use"
                    ref={typesOfCookiesRef}
                    title="2. Types of Cookies We Use"
                >
                    <div>
                        We use the following types of cookies and tracking
                        technologies:
                        <br />
                        <br />
                        <strong>Essential Cookies:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Required for the basic operation of our
                                platform, such as authentication and security.
                            </li>
                        </ul>
                        <br />
                        <strong>Performance and Analytics Cookies:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Help us understand how users interact with our
                                website, so we can improve features and
                                performance.
                            </li>
                        </ul>
                        <br />
                        <strong>Functionality Cookies:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Remember your preferences and settings to
                                provide a more personalized experience.
                            </li>
                        </ul>
                        <br />
                        <strong>Security Cookies:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Used to detect and prevent security risks, such
                                as fraudulent activities or unauthorized access.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: What Data is Collected --- */}
                <SitePolicyItem
                    id="what-data-is-collected"
                    ref={whatDataCollectedRef}
                    title="3. What Data is Collected"
                >
                    <div>
                        Through cookies, we may collect:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Device information (type, model, OS, browser)
                            </li>
                            <li>IP address and geographic location</li>
                            <li>
                                Usage data (pages visited, actions taken, time
                                spent)
                            </li>
                            <li>Authentication and session data</li>
                            <li>Preferences and settings</li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: How We Use Cookies --- */}
                <SitePolicyItem
                    id="how-we-use-cookies"
                    ref={howWeUseCookiesRef}
                    title="4. How We Use Cookies"
                >
                    <div>
                        We use cookies and tracking technologies to:
                        <ul className="list-disc pl-10 space-y-2">
                            <li>Authenticate users and safeguard accounts</li>
                            <li>Enhance website and app security</li>
                            <li>
                                Analyze website usage and improve our services
                            </li>
                            <li>
                                Remember your login details, preferences, and
                                settings
                            </li>
                            <li>
                                Provide a seamless and personalized user
                                experience
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Managing Cookies --- */}
                <SitePolicyItem
                    id="managing-cookies"
                    ref={managingCookiesRef}
                    title="5. Managing Cookies"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Most web browsers automatically accept cookies,
                                but you may set your browser to block or delete
                                cookies.
                            </li>
                            <li>
                                Please note that disabling cookies may affect
                                the functionality and performance of our
                                platform.
                            </li>
                            <li>
                                For more information on how to manage cookies,
                                refer to your browser’s help section.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Third-Party Cookies --- */}
                <SitePolicyItem
                    id="third-party-cookies"
                    ref={thirdPartyCookiesRef}
                    title="6. Third-Party Cookies"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We may allow certain trusted third-party service
                                providers (such as analytics or payment
                                partners) to place cookies or similar
                                technologies on our platform.
                            </li>
                            <li>
                                These third parties may collect information
                                about your online activities over time and
                                across different websites.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Changes to This Policy --- */}
                <SitePolicyItem
                    id="changes-to-this-policy"
                    ref={changesToPolicyRef}
                    title="7. Changes to This Policy"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We may update this Cookie Policy from time to
                                time.
                            </li>
                            <li>
                                Changes will be communicated via email or
                                platform notification.
                            </li>
                            <li>
                                Continued use of our platform after changes
                                constitutes your acceptance of the updated
                                policy.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 8: Contact Us --- */}
                <SitePolicyItem
                    id="contact-us"
                    ref={contactUsRef}
                    title="8. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For questions or concerns about our Cookie Policy,
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
