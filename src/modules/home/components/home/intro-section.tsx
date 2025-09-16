import { Check } from 'lucide-react'

import Image from '@/components/image'

const IntroSection = () => {
    return (
        <section className="flex items-center bg-none px-5">
            <div className="to-background via-background from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_100%_40%] to-100%" />

            <div className="mx-auto">
                <div className="mx-auto w-full max-w-5xl rounded-2xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-lg md:order-1">
                            <Image
                                alt="Intro Section Image"
                                className="object-cover"
                                height={1000}
                                src="/images/software.webp"
                                width={1000}
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">
                                Cooperative Banking, Simplified
                            </h2>

                            <p className="mb-4 text-current/70 md:mb-6">
                                AI-powered, secure platform tailored for
                                cooperatives — easy to use, built for scale and
                                security.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Launch date: January 6, 2026
                            </p>

                            <div className="space-y-3 md:space-y-4">
                                <h3 className="text-lg font-semibold md:text-xl">
                                    What we offer
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            AI forecasting & planning (LLMs +
                                            time-series)
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Advanced security: encryption,
                                            hashing, secure key management
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Member & employee management,
                                            accounts, and reporting
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Automated loan calculations and
                                            blotter validation
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Accounts: time deposits, savings,
                                            ledgers and reconciliations
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Role-based access (tellers,
                                            managers, owners, employees)
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Modern, proven UI/UX for efficient
                                            workflows
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Fast, scalable backend with
                                            real-time updates (built for
                                            billions of transactions)
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Check
                                            className="text-primary h-5 w-5"
                                            aria-hidden
                                        />
                                        <span className="text-current/70">
                                            Global cloud infrastructure with
                                            high availability
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IntroSection
