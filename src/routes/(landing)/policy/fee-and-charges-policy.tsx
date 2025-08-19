import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useRef } from 'react'
import { useMemo } from 'react'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { Separator } from '@/components/ui/separator'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute(
    '/(landing)/policy/fee-and-charges-policy'
)({
    component: RouteComponent,
})

const formatSectionTitle = (id: string): string => {
    if (id === 'types-of-fees-and-charges') return 'Types of Fees & Charges'
    if (id === 'fee-changes-and-notifications')
        return 'Fee Changes & Notifications'
    if (id === 'refunds-and-disputes') return 'Refunds & Disputes'

    return id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function RouteComponent() {
    // Refs for each section
    const purposeScopeRef = useRef<HTMLDivElement>(null)
    const typesOfFeesChargesRef = useRef<HTMLDivElement>(null)
    const pricingTransparencyRef = useRef<HTMLDivElement>(null)

    const paymentBillingRef = useRef<HTMLDivElement>(null)
    const feeChangesNotificationsRef = useRef<HTMLDivElement>(null)
    const refundsDisputesRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            'purpose-and-scope': purposeScopeRef,
            'types-of-fees-and-charges': typesOfFeesChargesRef,
            'pricing-transparency': pricingTransparencyRef,
            'payment-and-billing': paymentBillingRef,
            'fee-changes-and-notifications': feeChangesNotificationsRef,
            'refunds-and-disputes': refundsDisputesRef,
            'contact-us': contactUsRef,
        }
    }, [
        purposeScopeRef,
        typesOfFeesChargesRef,
        pricingTransparencyRef,
        paymentBillingRef,
        feeChangesNotificationsRef,
        refundsDisputesRef,
        contactUsRef,
    ])

    // Ref for the main scrollable content area

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
                    Lands Horizon Fee and Charges Policy
                </h1>
                <Separator className="my-1" />
                <h3 className="text-lg font-semibold mt-4 mb-6">
                    Effective Date: January 1, 2026
                </h3>
                <p className="mb-6">
                    This Fee and Charges Policy outlines the principles of
                    transparency and fairness that Lands Horizon Corp (“we”,
                    “us”, or “our”) applies to all fees, charges, and
                    commissions associated with the use of the e-coop-suite
                    platform{' '}
                    <span>
                        <LinkTag
                            href="http://ecoop-suite.com/"
                            target="_blank"
                            name={` (http://ecoop-suite.com/)`}
                        />
                    </span>
                    . Our goal is to ensure that all users, members, and
                    cooperatives are fully informed about the costs of our
                    products and services, including all subscription plans.
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
                                To provide clear, accessible information on all
                                applicable fees, charges, and commissions.
                            </li>
                            <li>
                                Applies to all users, members, cooperative
                                organizations, and partners utilizing
                                e-coop-suite products and services.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 2: Types of Fees and Charges --- */}
                <SitePolicyItem
                    ref={typesOfFeesChargesRef}
                    id="types-of-fees-and-charges"
                    title="2. Types of Fees and Charges"
                >
                    <div>
                        The following fees and charges may apply:
                        <br />
                        <br />
                        <strong>Subscription Fees:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Regular charges for access to digital platform
                                features, based on the selected subscription
                                plan (e.g., Basic, Standard, Premium,
                                Enterprise).
                            </li>
                        </ul>
                        <br />
                        <strong>Transaction Fees:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Fees applied to specific financial transactions,
                                such as payments, transfers, withdrawals, or
                                loan processing.
                            </li>
                        </ul>
                        <br />
                        <strong>Service Charges:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Charges for additional or optional services,
                                such as premium support, customization, or
                                special integrations.
                            </li>
                        </ul>
                        <br />
                        <strong>Commission Fees:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Commissions charged on certain products,
                                partnerships, or third-party services.
                            </li>
                        </ul>
                        <br />
                        <strong>Administrative Fees:</strong>
                        <ul className="list-disc pl-10 space-y-2 mt-2">
                            <li>
                                Fees for administrative actions, such as account
                                maintenance, document requests, or manual
                                processing.
                            </li>
                        </ul>
                        <br />
                        For a detailed breakdown of current plans and specific
                        charges, please refer to the Subscription Plans page or
                        contact support.
                    </div>
                </SitePolicyItem>

                {/* --- Section 3: Pricing Transparency --- */}
                <SitePolicyItem
                    ref={pricingTransparencyRef}
                    id="pricing-transparency"
                    title="3. Pricing Transparency"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                All fees, charges, and commissions are disclosed
                                clearly before the user commits to any service
                                or transaction.
                            </li>
                            <li>
                                Users will receive advance notice of any changes
                                to fees or the introduction of new charges.
                            </li>
                            <li>
                                No hidden or undisclosed fees will be applied.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 4: Payment and Billing --- */}
                <SitePolicyItem
                    ref={paymentBillingRef}
                    id="payment-and-billing"
                    title="4. Payment and Billing"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Fees and charges are billed according to the
                                terms of the selected subscription plan or upon
                                completion of a transaction or service.
                            </li>
                            <li>
                                Accepted payment methods include bank transfer,
                                credit/debit card, or any other options
                                specified on the platform.
                            </li>
                            <li>
                                Invoices, receipts, or statements will be
                                provided for all payments.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 5: Fee Changes and Notifications --- */}
                <SitePolicyItem
                    ref={feeChangesNotificationsRef}
                    id="fee-changes-and-notifications"
                    title="5. Fee Changes and Notifications"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                We reserve the right to update fees, charges,
                                and commissions as necessary to reflect
                                business, regulatory, or market changes.
                            </li>
                            <li>
                                Users will be notified at least fifteen (15)
                                days in advance of any fee increases or the
                                introduction of new fees via email or platform
                                notification.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 6: Refunds and Disputes --- */}
                <SitePolicyItem
                    ref={refundsDisputesRef}
                    id="refunds-and-disputes"
                    title="6. Refunds and Disputes"
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                Refunds for fees and charges are subject to the
                                terms of the relevant subscription plan or
                                service agreement.
                            </li>
                            <li>
                                Users who believe they have been incorrectly
                                charged may submit a dispute or request
                                clarification via the platform’s feedback form,
                                support email, or hotline.
                            </li>
                            <li>
                                Disputes will be addressed promptly and fairly
                                according to the Complaint Handling and Dispute
                                Resolution Policy.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>

                {/* --- Section 7: Contact Us --- */}
                <SitePolicyItem
                    ref={contactUsRef}
                    id="contact-us"
                    title="7. Contact Us"
                >
                    <div className="space-y-2 not-prose">
                        For questions or clarifications regarding this Fee and
                        Charges Policy, or for a detailed fee breakdown, please
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
