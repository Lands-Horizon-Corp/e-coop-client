import ImageMatch from '@/components/image-match'

import { SERVICES } from '../../home.constants'

const FeatureItem = ({
    icon,
    title,
    alt,
}: {
    icon: string
    title: string
    alt?: string
}) => {
    return (
        <div className="flex items-center space-x-3 p-2">
            <ImageMatch
                alt={alt || `${title} feature icon`}
                containerClassName="shadow-card overflow-hidden rounded-2xl size-12 flex-shrink-0"
                glow
                src={icon}
            />
            <p className="font-bold text-sm md:text-base antialiased font-smooth">
                {title}
            </p>
        </div>
    )
}
const IntroSection = () => {
    return (
        <section className="flex items-center justify-center ">
            <div className="to-background via-background from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_100%_40%] to-100% dark:block hidden" />

            <div className="mx-auto">
                <div className="mx-auto w-full max-w-7xl rounded-2xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                        <div className="relative order-2 a overflow-hidden rounded-lg md:order-1">
                            <ImageMatch
                                alt="Cooperative community working together"
                                containerClassName="shadow-card overflow-hidden rounded-2xl"
                                src="/pictures/home/trade.png"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">
                                What are you up to?
                            </h2>

                            <p className="mb-4 text-current/70 md:mb-6">
                                Our comprehensive cooperative banking platform
                                helps cooperatives and credit unions build
                                stronger financial communities.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Launch date: January 6, 2026
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1">
                                {SERVICES.map((item, index) => (
                                    <FeatureItem
                                        alt={item.alt}
                                        icon={item.icon}
                                        key={index}
                                        title={item.title}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IntroSection
