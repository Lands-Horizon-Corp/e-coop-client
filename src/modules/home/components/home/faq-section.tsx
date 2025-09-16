import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default function FaqSection() {
    const faqs = [
        {
            question: 'When is the launch date?',
            answer: 'January 6, 2026.',
        },
        {
            question: 'How many employees or members can use it?',
            answer: 'Unlimited — the platform is built to scale and can support millions or more members and users.',
        },
        {
            question: 'Is there an API or webhooks for developers?',
            answer: `Yes. Developer APIs and webhook support are available for transactions,
        forecasting, and other integrations. Authorization keys are securely stored
        on your account, and API documentation (endpoints, requests, and responses)
        is provided in the developer portal.`,
        },
        {
            question: 'How does the platform ensure data security?',
            answer: `We use industry-standard measures: encryption at rest and in transit,
        secure authentication, role-based access controls, and regular security
        audits. Our infrastructure is hosted on Fly.io. See our Security Policy for
        full details.`,
        },
        {
            question: 'What is e-coop-suite?',
            answer: `e-coop-suite is a digital platform from Lands Horizon Corp that helps
        cooperatives manage memberships, finances, and operations with secure,
        user-friendly tools.`,
        },
        {
            question: 'Who can use e-coop-suite?',
            answer: `Cooperatives, cooperative banks, their members, staff, and directors.
        Any cooperative looking to modernize operations can register and subscribe.`,
        },
        {
            question: 'Who do I contact for support?',
            answer: `Email us at lands.horizon.corp@gmail.com or call +63 991 617 1081. Our
        support team will assist with inquiries and technical issues.`,
        },
        {
            question: 'What subscription plans are available?',
            answer: `We offer Basic, Standard, Premium, and Enterprise plans tailored to
        cooperative needs. Each plan includes different features and pricing —
        see the Subscription Plans page for details.`,
        },
    ]

    return (
        <section className="py-2 md:py-16">
            <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-full w-full animate-pulse bg-radial-[ellipse_at_-20%_50%] to-10%" />
            <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-full w-full animate-pulse bg-radial-[ellipse_at_100%_50%] to-10%" />

            <div className="container mx-auto px-4">
                <div className="mx-auto w-full max-w-5xl">
                    <h2 className="text-foreground mb-8 text-left text-2xl font-bold md:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-4 md:gap-6">
                        {faqs.map((faq, index) => (
                            <Card
                                className="group transform-gpu shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
                                key={index}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {faq.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-muted-foreground text-sm md:text-base">
                                        {faq.answer}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
