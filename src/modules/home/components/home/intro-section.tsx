import ImageMatch from '@/components/image-match'

import FeatureList from './feature-list'

const IntroSection = () => {
    const features = [
        { text: 'AI forecasting & planning (LLMs + time-series)' },
        {
            text: 'Advanced security: encryption, hashing, secure key management',
        },
        { text: 'Member & employee management, accounts, and reporting' },
        { text: 'Automated loan calculations and blotter validation' },
        {
            text: 'Accounts: time deposits, savings, ledgers and reconciliations',
        },
        { text: 'Role-based access (tellers, managers, owners, employees)' },
        { text: 'Modern, proven UI/UX for efficient workflows' },
        {
            text: 'Fast, scalable backend with real-time updates (built for billions of transactions)',
        },
        { text: 'Global cloud infrastructure with high availability' },
    ]

    return (
        <section className="flex items-center bg-none px-5">
            <div className="to-background via-background from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_100%_40%] to-100%" />

            <div className="mx-auto">
                <div className="mx-auto w-full max-w-5xl rounded-2xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-lg md:order-1">
                            <ImageMatch
                                alt="Cooperative community working together"
                                containerClassName="shadow-card overflow-hidden rounded-2xl"
                                src="/pictures/home/software.png"
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

                            <FeatureList
                                items={features}
                                title="What we offer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IntroSection
