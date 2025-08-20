import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useCallback, useRef } from 'react'

import PageContainer from '@/components/containers/page-container'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import LinkTag from './-components/link-tag'
import SitePolicyItem from './-components/site-policy-items'

export const Route = createFileRoute('/(landing)/policy/terms-and-condition')({
    component: RouteComponent,
})

function RouteComponent() {
    const definitionsRef = useRef<HTMLDivElement>(null)
    const eligibilityRef = useRef<HTMLDivElement>(null)
    const serviceProviderRef = useRef<HTMLDivElement>(null)
    const rolePermissionsRef = useRef<HTMLDivElement>(null)
    const feesSubscriptionRef = useRef<HTMLDivElement>(null)
    const userResponsibilityRef = useRef<HTMLDivElement>(null)
    const dataOwnershipPrivacyRef = useRef<HTMLDivElement>(null)
    const disputeResolutionRef = useRef<HTMLDivElement>(null)
    const terminationSuspensionRef = useRef<HTMLDivElement>(null)
    const modificationTermsRef = useRef<HTMLDivElement>(null)
    const governingLawRef = useRef<HTMLDivElement>(null)
    const contactUsRef = useRef<HTMLDivElement>(null)

    const sectionRefs = useMemo(() => {
        return {
            definitions: definitionsRef,
            'eligibility-registration': eligibilityRef,
            'services-provided': serviceProviderRef,
            'roles-and-permissions': rolePermissionsRef,
            'fees-and-subscription': feesSubscriptionRef,
            'user-responsibility': userResponsibilityRef,
            'data-ownership-privacy': dataOwnershipPrivacyRef,
            'dispute-resolution': disputeResolutionRef,
            'termination-and-suspension': terminationSuspensionRef,
            'modification-terms': modificationTermsRef,
            'governing-law': governingLawRef,
            'contact-us': contactUsRef,
        }
    }, [
        definitionsRef,
        eligibilityRef,
        serviceProviderRef,
        rolePermissionsRef,
        feesSubscriptionRef,
        userResponsibilityRef,
        dataOwnershipPrivacyRef,
        disputeResolutionRef,
        terminationSuspensionRef,
        modificationTermsRef,
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

    const articleList = Object.keys(sectionRefs) ?? []

    return (
        <PageContainer className=" w-full flex-row flex-grow">
            <div className="justify-start h-[100vh] overflow-auto px-4 py-8  border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold min-h-16 flex items-center justify-start w-full mb-4">
                    Lands Horizon Terms and Conditions
                </h1>
                <Separator className="my-1" />
                <h3 className="flex min-h-12 items-center justify-start w-full text-lg font-semibold mt-4">
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
                    using our platform and services, you (“you”, “your”, “user”,
                    “member”, or “organization”) agree to comply with these
                    Terms and Conditions. Please read carefully.
                    <Separator className="my-5 h-1" />
                </p>
                <SitePolicyItem
                    ref={definitionsRef}
                    id="definitions"
                    title="1. Definitions"
                    onClick={() => scrollToSection('definitions')}
                >
                    <div>
                        <ul className="list-disc pl-10 space-y-2">
                            <li>
                                <strong>Platform:</strong> The e-coop-suite
                                digital solution for cooperative banking and
                                management.
                            </li>
                            <li>
                                <strong>Service:</strong> Includes savings,
                                loans, digital wallets, payment processing,
                                member management, accounts, and related
                                features.
                            </li>
                            <li>
                                <strong>Users:</strong> Cooperative businesses,
                                their members, staff, admins, tellers,
                                collectors, employees, and the general public.
                            </li>
                            <li>
                                <strong>Organization:</strong> Refers to the
                                cooperative business registered on the platform.
                            </li>
                        </ul>
                    </div>
                </SitePolicyItem>
                <SitePolicyItem
                    ref={eligibilityRef}
                    id="eligibility-registration"
                    title="2. Eligibility & Registration"
                    onClick={() => scrollToSection('eligibility-registration')}
                >
                    <ul className="list-disc pl-8 space-y-4 ">
                        <li>
                            <span className="font-semibold">
                                Registration is open to:
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Cooperative organizations and businesses
                                </li>
                                <li>
                                    Individual members, staff, and employees of
                                    cooperatives
                                </li>
                                <li>
                                    The general public (subject to platform
                                    approval)
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">
                                Registration requirements:
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>Valid email address</li>
                                <li>Secure password</li>
                                <li>Contact number</li>
                                <li>
                                    Accurate physical location (for security and
                                    anti-fraud purposes)
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">Users can:</span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>Join an existing cooperative</li>
                                <li>
                                    Create a new cooperative business after
                                    registration
                                </li>
                            </ul>
                        </li>
                        <li>
                            Users are responsible for maintaining the
                            confidentiality of their login credentials.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="services-provided"
                    title="3. Services Provided"
                    onClick={() => scrollToSection('services-provided')}
                    ref={serviceProviderRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            <span className="font-semibold">
                                The platform offers (but is not limited to):
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>Digital savings and loan products</li>
                                <li>Digital wallet functionality</li>
                                <li>Payment processing</li>
                                <li>Member and account management tools</li>
                                <li>Batch and blotter balancing</li>
                            </ul>
                        </li>
                        <li className="mt-4 ">
                            Services are available to both organizations and
                            their individual members.
                        </li>
                    </ul>
                    <ul className="list-disc pl-8 space-y-2 " />
                </SitePolicyItem>
                <SitePolicyItem
                    id="roles-permissions"
                    title="4. Roles & Permissions"
                    onClick={() => scrollToSection('roles-and-permissions')}
                    ref={rolePermissionsRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            <span className="font-semibold">
                                The platform uses Role-Based Access Control
                                (RBAC):
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Roles include: owner, staff, teller,
                                    collector, member, employee, and others
                                </li>
                                Each role has specific permissions and access
                                rights
                            </ul>
                        </li>
                        <li className="mt-4 ">
                            Actions and data access are restricted according to
                            assigned roles.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="fees-and-subscription"
                    title="5. Fees & Subscription"
                    onClick={() => scrollToSection('fees-and-subscription')}
                    ref={feesSubscriptionRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            <span className="font-semibold">
                                Use of the platform is subject to subscription
                                fees:
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>Monthly or yearly billing cycles</li>
                                <li>
                                    Pricing is based on the number of members
                                    and employees in the organization
                                </li>
                            </ul>
                        </li>
                        <li className="mt-4 ">
                            All fees are disclosed during subscription sign-up.
                        </li>
                        <li className="mt-4 ">
                            Fees may be updated; changes will be communicated in
                            advance.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="user-responsibility"
                    title="6. User Responsibilities"
                    onClick={() => scrollToSection('user-responsibility')}
                    ref={userResponsibilityRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            <span className="font-semibold">
                                Users and organizations must:
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Protect their login credentials and never
                                    share passwords
                                </li>
                                <li>
                                    Safeguard the privacy and security of member
                                    data
                                </li>
                                <li>
                                    Use strong passwords and update them
                                    regularly
                                </li>
                                <li>
                                    Comply with all applicable laws,
                                    regulations, and platform policies
                                </li>
                            </ul>
                        </li>

                        <li>
                            <span className="font-semibold">
                                Prohibited activities include:
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Sharing passwords or other sensitive
                                    information
                                </li>
                                <li>
                                    Unauthorized changes to account values or
                                    data
                                </li>
                                <li>
                                    Attempting to bypass, disable, or tamper
                                    with platform security features
                                </li>
                                <li>
                                    Engaging in fraud, scams, or any illegal
                                    activities
                                </li>
                            </ul>
                        </li>

                        <li>
                            All major changes (e.g., financial transactions,
                            account modifications) require higher-level approval
                            or authorized signatures.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="data-ownership-privacy"
                    title="7. Data Ownership & Privacy"
                    onClick={() => scrollToSection('data-ownership-privacy')}
                    ref={dataOwnershipPrivacyRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            <span className="font-semibold">Ownership:</span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    All data entered or uploaded belongs to the
                                    organization and respective users.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">Security:</span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Data is stored securely and encrypted using
                                    industry best practices (including Argon2
                                    hashing, cryptography, SSH, and TLS).
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">Usage:</span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Data is used solely for the purposes of
                                    accounting, banking, and service provision
                                    within the platform.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <span className="font-semibold">
                                Data Sharing:{' '}
                            </span>
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>
                                    Data is never shared with third parties
                                    without explicit consent and a secure,
                                    multi-stage developer key approval process.
                                </li>
                                <li>
                                    All third-party API access is subject to
                                    strict review and owner permission.
                                </li>
                            </ul>
                        </li>
                        <li>
                            For more details, refer to our{' '}
                            <span className="font-semibold">
                                <LinkTag
                                    href="/site-policy/privacy-policy"
                                    target="_blank"
                                    name="Privacy Policy."
                                />
                            </span>
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="dispute-resolution"
                    title="8. Dispute Resolution"
                    onClick={() => scrollToSection('dispute-resolution')}
                    ref={disputeResolutionRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            All financial transactions require approval by
                            authorized personnel and are subject to daily batch
                            balancing.
                        </li>
                        <li>
                            Disputes between users and their cooperative are
                            handled by the cooperative’s admin and staff.
                        </li>
                        <li>
                            Arbitration or mediation is available for unresolved
                            issues between employees and administrators.
                        </li>
                        <li>
                            Platform management does not interfere in internal
                            cooperative disputes unless required by law or
                            platform security.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="termination-and-suspension"
                    title="9. Termination & Suspension"
                    onClick={() =>
                        scrollToSection('termination-and-suspension')
                    }
                    ref={terminationSuspensionRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            User accounts or memberships may be suspended or
                            terminated by the cooperative organization, subject
                            to their internal policies.
                        </li>
                        <li>
                            The platform reserves the right to suspend or
                            terminate access in cases of:
                            <ul className="list-[circle] pl-6 mt-2 space-y-1">
                                <li>Security breaches</li>
                                <li>Fraudulent activity</li>
                                <li>Violation of these Terms and Conditions</li>
                            </ul>
                        </li>
                        <li>
                            We do not manage or remove members on behalf of
                            cooperatives except as required by law.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="modification-terms"
                    title="10. Modifications to Terms"
                    onClick={() => scrollToSection('modification-terms')}
                    ref={modificationTermsRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            Lands Horizon Corp may update these Terms and
                            Conditions at any time.
                        </li>
                        <li>
                            Significant changes will be communicated to users
                            via email or platform notifications.
                        </li>
                        <li>
                            Continued use of the platform after changes
                            constitutes acceptance of the revised terms.
                        </li>
                    </ul>
                </SitePolicyItem>

                <SitePolicyItem
                    id="governing-law"
                    title="11. Governing Law"
                    onClick={() => scrollToSection('governing-law')}
                    ref={governingLawRef}
                >
                    <ul className="list-disc pl-8 space-y-4">
                        <li>
                            These Terms and Conditions are governed by the laws
                            of the Philippines.
                        </li>
                        <li>
                            Any disputes will be subject to the exclusive
                            jurisdiction of the Philippine courts.
                        </li>
                    </ul>
                </SitePolicyItem>
                <SitePolicyItem
                    id="contact-us"
                    title="12. Contact Us"
                    onClick={() => scrollToSection('contact-us')}
                    ref={contactUsRef}
                >
                    <div className="space-y-2 not-prose">
                        For questions, support, or legal inquiries, contact:
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
                    </div>
                </SitePolicyItem>
            </div>
            <div className="mb-8 p-4 rounded-lg h-full">
                <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                    In this article
                </h4>{' '}
                <ul className="list-none space-y-2 min-w-64">
                    {articleList.map((sectionId, idx) => {
                        return (
                            <li>
                                <a
                                    href={`#{${sectionId}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        scrollToSection(sectionId)
                                    }}
                                    className="text-green-600 min-w-64 dark:text-green-400 hover:underline cursor-pointer text-sm"
                                >
                                    {idx + 1}
                                    {'. '}
                                    {sectionId
                                        .replace(/-/g, ' ')
                                        .replace(/\b\w/g, (c) =>
                                            c.toUpperCase()
                                        )}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </PageContainer>
    )
}
