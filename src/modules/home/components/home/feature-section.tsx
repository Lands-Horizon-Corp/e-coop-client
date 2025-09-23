import { Link } from '@tanstack/react-router'

import { BankIcon, CodeIcon, Users3FillIcon } from '@/components/icons'
import Image from '@/components/image'
import { Button } from '@/components/ui/button'

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
                        <div className="bg-card overflow-hidden rounded-lg shadow-sm">
                            <div className="relative h-40 rounded-2xl p-3">
                                <Image
                                    alt="Membership management"
                                    className="h-full w-full rounded-2xl object-cover"
                                    src="/pictures/home/membership.png"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-foreground mb-2 min-h-[28px] font-bold md:mb-4">
                                    <Users3FillIcon className="inline size-5 mr-2" />
                                    Membership Management
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Easy onboarding and KYC verification. Member
                                    records, profiles, and digital ID. Automated
                                    membership renewals and status tracking.
                                </p>
                            </div>
                        </div>
                        <div className="bg-card overflow-hidden rounded-lg shadow-sm">
                            <div className="relative w-full rounded-2xl">
                                <div className="h-40 rounded-2xl p-3">
                                    <Image
                                        alt="API integrations"
                                        className="h-full w-full rounded-2xl object-cover"
                                        src="/pictures/home/api.png"
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-foreground mb-2 min-h-[28px] font-bold md:mb-4">
                                <CodeIcon className="inline size-4 mr-2" />
                                    API & Integrations
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Developer API access for custom integrations
                                    (with organization membership). Seamless
                                    connection to third-party apps and services.
                                </p>
                            </div>
                        </div>
                        <div className="bg-card overflow-hidden rounded-lg shadow-sm">
                            <div className="h-40 rounded-2xl p-3">
                                <Image
                                    alt="Digital cooperative banking"
                                    className="h-full w-full rounded-2xl object-cover"
                                    src="/pictures/home/transaction.png"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-foreground mb-2 min-h-[28px] font-bold md:mb-4">
                                    <BankIcon className="inline size-4 mr-2" />
                                    Digital Cooperative Banking
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Secure online account management for members
                                    and cooperatives. Digital transactions,
                                    savings, loans, and payments. Real-time
                                    balance and transaction history.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button
                            className="h-[42px] w-full md:w-auto"
                            variant="default"
                            asChild
                        >
                            <Link to="/auth/sign-in">Sign in Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
