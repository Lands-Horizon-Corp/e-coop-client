import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, ReactNode } from 'react'

import ARTWORK_EXPERIMENT from '@/assets/artworks/artwork-experiment.svg'

import PageContainer from '@/components/containers/page-container'
import { CurlyBracketIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

export const Route = createFileRoute('/(landing)/developers')({
    component: RouteComponent,
})

const DEVELOPER_POLICY: {
    id: number
    title: string | ReactNode
    lists: ReactNode[] | ReactNode
}[] = [
    {
        id: 1,
        title: 'Eligibility and Registration',
        lists: [
            'API access is available exclusively to registered users who are members of an approved organization within e-coop-suite.',
            <li key="1-2">
                Developers must first{' '}
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={'/auth/sign-up' as string}
                >
                    create an account
                </Link>{' '}
                and then request to join or create an organization on the
                platform.
            </li>,
            'Organization membership is required for API key issuance and usage.',
        ],
    },
    {
        id: 2,
        title: 'API Key Management',
        lists: [
            'API keys are issued only to verified organizational accounts.',
            'Each organization is responsible for managing its issued API keys and the actions performed with them.',
            'API keys must be kept confidential and never shared outside the organization.',
        ],
    },
    {
        id: 3,
        title: 'Acceptable Use',
        lists: [
            <li key="3-1">
                The API may only be used for lawful purposes, and in accordance
                with the platform&apos;s{' '}
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={'/policy/terms-and-condition' as string}
                >
                    Terms of Service
                </Link>{' '}
                and all applicable laws.
            </li>,
            'Use of the API must not compromise the security, stability, or performance of e-coop-suite or its users.',
            'Automated or bulk actions must comply with published rate limits and fair use standards.',
        ],
    },
    {
        id: 4,
        title: 'Security and Privacy',
        lists: [
            'Developers are responsible for the security of their API integrations and for protecting any data accessed or processed.',
            <li key="4-2">
                All data accessed via the API must be handled in accordance with
                our{' '}
                <Link
                    to={'/policy/data-protection-policy' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Data Protection Policy
                </Link>
                .
            </li>,
            'Unauthorized access, attempts to bypass security, or abuse of API endpoints will result in immediate suspension and possible legal action.',
        ],
    },
    {
        id: 5,
        title: 'Revocation and Suspension',
        lists: [
            'Lands Horizon Corp reserves the right to revoke or suspend API access for any organization or user found in violation of this policy, our platform rules, or applicable law.',
            'API access may also be suspended for reasons of security, maintenance, or platform integrity.',
        ],
    },
    {
        id: 6,
        title: 'Updates to the Policy',
        lists: [
            'This policy may be updated periodically to reflect changes in our API offerings, security practices, or legal obligations.',
            'Substantial changes will be communicated to registered developers and organizations via email or platform notification.',
        ],
    },
    {
        id: 7,
        title: 'Support and Contact',
        lists: (
            <div className="space-y-2 not-prose">
                <p className="text-muted-foreground/70">
                    For questions regarding API access, eligibility, or policy
                    terms, please contact:
                </p>
                <div className="!space-y-1">
                    <p className="!my-1 text-lg">Zalven Lemuel Dayao</p>
                    <p className="!text-muted-foreground !text-xs">
                        CEO, Lands Horizon Corp{' '}
                    </p>
                </div>
                <p className="text-muted-foreground text-xs">
                    Email:{' '}
                    <CopyWrapper className="text-teal-700 hover:text-teal-500">
                        zalvendayao888@gmail.com
                    </CopyWrapper>
                </p>
                <p className="text-muted-foreground text-xs">
                    Phone:{' '}
                    <CopyWrapper className="text-teal-700 hover:text-teal-500">
                        +63 991 617 1081
                    </CopyWrapper>
                </p>
            </div>
        ),
    },
]

function RouteComponent() {
    return (
        <PageContainer className="relative bg-background/80 dark:bg-background/90">
            <div className="py-4 z-10 max-w-4xl px-4 md:px-8 w-full space-y-6">
                <ImageDisplay
                    className="size-40 mx-auto rounded-xl animate-in !bg-transparent"
                    imageClassName="bg-transparent"
                    src={ARTWORK_EXPERIMENT}
                />
                <h1 className="text-3xl font-medium text-center !mb-12">
                    Developer API Access Policy
                    <CurlyBracketIcon className="size-9 ml-2 inline mx-auto text-teal-600" />
                </h1>
                <p className="text-sm text-muted-foreground">
                    Effective Date: January 1, 2026
                </p>
                <p className="text-muted-foreground indent-6 text-justify">
                    This policy outlines the requirements and guidelines for
                    accessing and using the Developer API provided by Lands
                    Horizon Corp through the e-coop-suite platform{' '}
                    <Link
                        to={'/' as string}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="underline underline-offset-4 text-teal-600"
                    >
                        ecoop-suite.netlify.app.com
                    </Link>
                </p>
                <div className="space-y-8 prose !max-w-none prose-a:text-teal-600 prose-a:underline-offset-4 prose-li:text-muted-foreground dark:prose-invert">
                    {DEVELOPER_POLICY.map((policy) => {
                        const policyContent = (() => {
                            if (Array.isArray(policy.lists)) {
                                return policy.lists.map((policyList, idx) => {
                                    if (typeof policyList === 'string') {
                                        return (
                                            <li key={`${policy.id}-${idx}`}>
                                                {policyList}
                                            </li>
                                        )
                                    }

                                    return (
                                        <Fragment key={`${policy.id}-${idx}`}>
                                            {policyList}
                                        </Fragment>
                                    )
                                })
                            }

                            return policy.lists
                        })()

                        return (
                            <div key={policy.id} className="">
                                <p className="text-xl !mb-4">
                                    {policy.id}. {policy.title}
                                </p>
                                <div className="space-y-2 text-sm">
                                    {policyContent}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </PageContainer>
    )
}
