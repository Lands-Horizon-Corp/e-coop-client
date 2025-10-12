'use client'

import { GradientText } from '@/components/ui/gradient-text'

import TeamMemberCard from '../components/about/team-member-card'
import OurServices from '../components/home/our-services'
import { LANDS_TEAM } from '../home.constants'

export default function AboutUsPage() {
    return (
        <div className="py-20 relative ">
            <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100%" />

            <div className="container mx-auto px-4  max-w-6xl">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="text-foreground text-4xl font-extrabold">
                        <GradientText
                            animate="shimmer"
                            className="leading-relaxed ml-2"
                            size="4xl"
                            style={{
                                fontFamily: "'Knewave', cursive",
                            }}
                            variant="primary"
                        >
                            <h1>E-coop</h1>
                        </GradientText>
                        <p className="font-bold">
                            Empowering cooperatives. Building communities.
                        </p>
                        <p className="font-bold text-lg">Whats yours?</p>
                    </h1>
                </div>

                <section className="mt-16">
                    <OurServices />
                </section>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-8 gap-6">
                        {LANDS_TEAM.map((member) => (
                            <TeamMemberCard
                                className="even:mt-8 odd:mb-8"
                                key={`${member.name}${member.position}`}
                                teamMember={member}
                            />
                        ))}
                    </div>
                </section>
                <section className="mx-auto mt-16 max-w-3xl text-center">
                    <h3 className="text-foreground text-2xl font-semibold">
                        Get to know us
                    </h3>
                    <p className="text-muted-foreground mt-4">
                        At Lands Horizon Corp, we are passionate about
                        empowering cooperatives and their members. Our team
                        delivers technology that enhances financial inclusion,
                        operational efficiency, and community prosperity.
                    </p>
                    <p className="text-muted-foreground mt-4">
                        Join us on our journey to transform the cooperative
                        experience — where growth, security, and trust are
                        always at the heart of what we do.
                    </p>
                </section>
            </div>
        </div>
    )
}
