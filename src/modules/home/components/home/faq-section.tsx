import { Link } from '@tanstack/react-router'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

export default function FaqSection() {
    const faqs = [
        {
            question: 'When is the launch date?',
            answer: 'January 6, 2026.',
        },
        {
            question: 'What is e-coop-suite?',
            answer: `e-coop-suite is a digital platform from Lands Horizon Corp that helps cooperatives manage memberships, finances, and operations with secure, user-friendly tools.`,
        },
        {
            question: 'Who can use e-coop-suite?',
            answer: `Cooperatives, cooperative banks, their members, staff, and directors. Any cooperative looking to modernize operations can register and subscribe.`,
        },
        {
            question: 'Is there an API or webhooks for developers?',
            answer: `Yes. Developer APIs and webhook support are available for transactions, forecasting, and other integrations. API documentation is provided in the developer portal.`,
        },
    ]

    return (
        <section className="py-8 md:py-16 ">
            <div className="container mx-auto px-4 lg:max-w-[66.666%] md:max-w-[83.333%]">
                <div className="w-full mx-auto max-w-screen-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="hidden md:block space-y-0 pl-10 md:w-[80%]">
                            {/* Primary FAQ Box */}
                            <div className="bg-primary text-primary-foreground p-2 text-center max-w-[83.333%] rounded-lg">
                                <h2 className="text-lg font-bold">
                                    Frequently Asked Questions
                                </h2>
                            </div>
                            {/* Help Box */}
                            <div className="bg- p-5 max-w-[83.333%] ml-[16.666%] rounded-lg">
                                <h3 className="text-2xl font-bold mb-4 text-foreground">
                                    Can't find your question here?
                                </h3>
                                <p className="text-muted-foreground mb-6 text-lg">
                                    Browse all our frequently asked questions or
                                    contact us directly
                                </p>
                                <Link
                                    className="text-primary hover:text-primary/80 flex items-center group text-lg font-semibold"
                                    to="/contact"
                                >
                                    Contact us for more help
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg">
                                Here you'll find the most common questions.
                                Can't find what you're looking for? Feel free to
                                contact us directly.
                            </p>
                            <div className="space-y-3 md:space-y-4 pb-4">
                                <Accordion
                                    className="space-y-3 md:space-y-4"
                                    collapsible
                                    type="single"
                                >
                                    {faqs.map((faq, index) => (
                                        <AccordionItem
                                            className="border rounded-lg"
                                            key={index}
                                            value={`item-${index + 1}`}
                                        >
                                            <AccordionTrigger className="px-4 md:px-6 text-sm md:text-base">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 md:px-6 text-sm md:text-base">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
