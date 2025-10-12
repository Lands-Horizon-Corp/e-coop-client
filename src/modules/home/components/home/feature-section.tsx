import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

import FeatureCard from './feature-card'
import { featureCardsData } from '../../constants'
export default function FeatureSection() {
    return (
        <section className="flex items-center bg-none px-5 my-16">
            <div className="absolute inset-0 -z-10 h-full w-full bg-radial-[ellipse_at_-20%_50%] from-primary/20 via-background/0 to-background/0 to-10%" />

            <div className="container mx-auto px-4">
                <div className="mx-auto w-full max-w-5xl">
                    <h2 className="text-foreground mb-2 text-left text-2xl font-bold md:mb-3 md:text-3xl">
                        Key Features
                    </h2>
                    <p className="text-muted-foreground mb-6 text-left md:mb-8">
                        Core features designed to help cooperatives manage
                        members, finances, and integrations.
                    </p>

                    <div className="space-y-4 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                        {featureCardsData.map((card) => (
                            <FeatureCard
                                description={card.description}
                                icon={card.icon}
                                imageAlt={card.imageAlt}
                                imageSrc={card.imageSrc}
                                key={card.id}
                                title={card.title}
                                useImageMatch={card.useImageMatch}
                            />
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button
                            asChild
                            className="h-[42px] w-full md:w-auto"
                            variant="default"
                        >
                            <Link to="/auth/sign-in">Sign in Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
