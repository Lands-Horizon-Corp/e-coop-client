import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import CopyWrapper from '@/components/elements/copy-wrapper'
import { ChatBubbleIcon, MagnifyingGlassIcon } from '@/components/icons'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

import useDebounce from '@/hooks/use-debounce'

export const Route = createFileRoute('/(landing)/frequently-asked-questions')({
    component: RouteComponent,
})

const FAQ_ITEMS: {
    id: string
    title: string | React.ReactNode
    content: string | React.ReactNode
}[] = [
    {
        id: 'what-is-ecoopsuite',
        title: 'What is e-coop-suite?',
        content: (
            <>
                <strong>e-coop-suite</strong> is a digital platform developed by
                Lands Horizon Corp to empower cooperatives with secure,
                user-friendly, and innovative online tools for managing
                operations, memberships, and financial activities.
            </>
        ),
    },
    {
        id: 'who-can-use-ecoopsuite',
        title: 'Who can use e-coop-suite?',
        content: (
            <>
                The platform is designed for cooperatives, cooperative banks,
                their members, staff, and directors. Any cooperative
                organization looking to modernize and streamline its operations
                can register and subscribe.
            </>
        ),
    },
    {
        id: 'how-to-register',
        title: 'How do I register or sign up?',
        content: (
            <>
                You can register by visiting{' '}
                <Link
                    to={'/' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    ecoop
                </Link>{' '}
                and clicking on the “Sign Up” button or just visit the{' '}
                <Link
                    to={'/auth/sign-up' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    Sign-Up Page
                </Link>{' '}
                . Follow the prompts to provide the required information and
                complete the registration process.
            </>
        ),
    },
    {
        id: 'subscription-plans',
        title: 'What subscription plans are available?',
        content: (
            <>
                We offer several subscription plans tailored to different
                cooperative needs, including Basic, Standard, Premium, and
                Enterprise. Each plan comes with its own set of features and
                pricing. For more details, visit our{' '}
                <Link
                    to={'/subscription-plan' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    Subscription Plans
                </Link>{' '}
                page.
            </>
        ),
    },
    {
        id: 'data-security',
        title: 'How does the platform ensure data security?',
        content: (
            <>
                Our platform employs industry-standard security measures such as
                data encryption, secure authentication, access controls, and
                regular security audits. All servers are hosted on Fly.io, a
                reputable cloud provider. For more information, see our{' '}
                <a
                    href="http://ecoop-suite.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Security Policy
                </a>
                .
            </>
        ),
    },
    {
        id: 'kyc-process',
        title: 'What is the KYC process?',
        content: (
            <>
                All users are required to undergo a Know Your Customer (KYC)
                verification, which includes submitting valid identification and
                other necessary documents. This ensures compliance with
                regulatory requirements and protects against fraud. See our{' '}
                <Link
                    target="_blank"
                    to={'/policy/kyc-policy' as string}
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    KYC Policy
                </Link>{' '}
                for details.
            </>
        ),
    },
    {
        id: 'data-protection',
        title: 'How are my personal and cooperative data protected?',
        content: (
            <>
                We adhere strictly to data privacy laws and best practices. Your
                data is encrypted, securely stored, and only accessible to
                authorized personnel. For more, see our{' '}
                <Link
                    to={'/policy/data-protection' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    Data Protection Policy
                </Link>
                .
            </>
        ),
    },
    {
        id: 'fees-and-charges',
        title: 'What fees or charges should I expect?',
        content: (
            <>
                There are subscription fees, and certain services or
                transactions may incur additional charges. All fees are
                transparently listed on our{' '}
                <Link
                    to={'/policy/fee-and-charges-policy' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    Fee and Charges Policy
                </Link>{' '}
                page.
            </>
        ),
    },
    {
        id: 'complaints-disputes',
        title: 'How do I lodge a complaint or resolve a dispute?',
        content: (
            <>
                You can submit complaints via our online feedback form, email,
                phone, or mail. We are committed to addressing all concerns
                fairly and promptly. Read our{' '}
                <Link
                    to={
                        '/policy/complaint-handling-and-dispute-policy' as string
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-teal-600"
                >
                    Complaint Handling and Dispute Resolution Policy
                </Link>{' '}
                for the process.
            </>
        ),
    },
    {
        id: 'contact-support',
        title: 'Who do I contact for support?',
        content: (
            <>
                For support, you can email us at{' '}
                <CopyWrapper className="ml-1 text-teal-600 underline-offset-4 underline hover:text-teal-400">
                    lands.horizon.corp@gmail.com
                </CopyWrapper>{' '}
                or call
                <CopyWrapper className="ml-1 text-teal-600 underline-offset-4 underline hover:text-teal-400">
                    +63 991 617 1081
                </CopyWrapper>
                . Our team is ready to assist you with any inquiries or
                technical issues.
            </>
        ),
    },
]

function RouteComponent() {
    const [rawSearch, setRawSearch] = useState('')
    const searchTerm = useDebounce(rawSearch, 300)
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const fuse = useMemo(
        () =>
            new Fuse(FAQ_ITEMS, {
                keys: ['title', 'content'],
                includeScore: true,
                threshold: 0.4,
            }),
        []
    )

    const filteredFAQs = useMemo(() => {
        if (!searchTerm.trim()) {
            setExpandedItems([])
            return FAQ_ITEMS
        }
        const results = fuse.search(searchTerm)
        const ids = results.map((r) => r.item.id)
        setExpandedItems(ids)
        return results.map((r) => r.item)
    }, [searchTerm, fuse])

    return (
        <PageContainer className="relative bg-background/80 dark:bg-background/90">
            <div className="py-16 z-10 max-w-4xl px-4 md:px-8 w-full space-y-6">
                <ChatBubbleIcon className="size-16 mx-auto text-teal-600" />
                <h1 className="text-3xl font-medium text-center">
                    Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground/80 text-center text-sm">
                    Welcome to the e-coop-suite FAQ page! Here you&apos;ll find
                    answers to common questions about our platform, services,
                    and policies. You can also directly{' '}
                    <Link
                        resetScroll
                        to="/contact"
                        className="underline underline-offset-4 text-teal-600"
                    >
                        send us a message
                    </Link>
                    .
                </p>

                <div className="relative group">
                    <Input
                        type="text"
                        placeholder="Search FAQs..."
                        className="w-full pr-10"
                        onChange={(e) => setRawSearch(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:text-foreground text-muted-foreground/80 ease-in-out duration-200" />
                </div>

                {FAQ_ITEMS.length === 0 && (
                    <p className="text-center text-muted-foreground/80 text-sm">
                        No FAQS yet
                    </p>
                )}
                {filteredFAQs.length === 0 && (
                    <p className="text-center text-muted-foreground/80 text-sm">
                        {searchTerm.length > 0 &&
                            `No result matched for search '${searchTerm}'`}
                    </p>
                )}
                <Accordion
                    type="multiple"
                    className="w-full space-y-2"
                    value={expandedItems}
                    onValueChange={(values) => setExpandedItems(values)}
                >
                    {filteredFAQs.map((item) => (
                        <AccordionItem
                            value={item.id}
                            key={item.id}
                            className="py-2 border-b-0 px-4 data-[state=open]:bg-popover rounded-xl hover:bg-popover/70"
                        >
                            <AccordionTrigger className="text-foreground/70 hover:text-foreground duration-300">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground max-w-full pb-4">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <p className="text-muted-foreground">
                    Didn&apos;t find your question? Contact us at
                    <CopyWrapper className="ml-1 text-teal-600 underline-offset-4 underline hover:text-teal-400">
                        lands.horizon.corp@gmail.com
                    </CopyWrapper>{' '}
                    or{' '}
                    <Link
                        resetScroll
                        to="/contact"
                        className="underline underline-offset-4 text-teal-600"
                    >
                        send us a message
                    </Link>{' '}
                    for further assistance.
                </p>
            </div>
        </PageContainer>
    )
}
