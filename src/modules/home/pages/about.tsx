'use client'

import { Link } from '@tanstack/react-router'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import { ArrowRightIcon, UserIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/ui/gradient-text'

import TeamMemberCard from '../components/about/team-member-card'
import OurServices from '../components/home/our-services'
import { ILandsTeamMember } from '../home.types'

export const LANDS_TEAM: ILandsTeamMember[] = [
    {
        name: 'Zalven Lemuel S. Dayao',
        image: '/pictures/team/zalven.webp',
        position: 'CEO & Founder',
        description:
            "Principal architect driving the company's technological direction. Oversees the design and optimization of backend infrastructures, ensures robust database management systems, and spearheads initiatives for high-performance, scalable, and secure systems across the organization.",
        linkedInUrl: 'https://www.linkedin.com/in/zalven-dayao-293b2a22a/',
        instagramUrl: 'https://www.instagram.com/zalven_blue/',
    },
    {
        name: 'Nelma Dayao',
        image: '/pictures/team/nelma.webp',
        position: 'President & Co-Founder',
        description:
            'Dynamic executive and project management leader. Orchestrates the development and execution of strategic initiatives, particularly the cooperative project. Focuses on operational excellence, team synergy, and the realization of long-term company goals.',
        facebookUrl: 'https://www.facebook.com/nelma.dayao',
    },
    {
        name: 'Sajiron Dayao',
        image: '/pictures/team/vpsanty.webp',
        position: 'CFO (Chief Financial Officer) & Investor',
        description:
            "Financial strategist and key investor ensuring the company's fiscal health and growth. Leads marketing initiatives, provides life coaching for team development, and oversees funding strategies and business sustainability.",
        facebookUrl: 'https://www.facebook.com/vpsantyofficial',
    },
    {
        name: 'Danilo Dayao',
        image: '/pictures/team/danilo.webp',
        position: 'Lead Marketing',
        description:
            "Danilo is the driving force behind the company's marketing vision, serving as the Lead Marketing Strategist. With a solid background in both marketing and business, he brings a strategic edge to every campaign. His experience enables him to effectively market software solutions tailored for cooperatives, bridging the gap between complex technology and practical value. Danilo leads brand positioning and customer engagement efforts that deliver lasting impact helping the brand grow with purpose and precision.",
        facebookUrl: 'https://www.facebook.com/danilo.dayao.12',
    },
    {
        name: 'Jerbee Paragas',
        image: '/pictures/team/jerbee.webp',
        position: 'CTO (Chief Technology Officer)',
        description:
            'Technical strategist and senior frontend engineering expert. Leads API integration processes, enhances application performance, and architects frontend systems with modern frameworks to deliver seamless, responsive, and highly optimized user experiences.',
        linkedInUrl: 'https://www.linkedin.com/in/jerbee-paragas-8970b024b/',
        instagramUrl: 'https://www.instagram.com/jerbcxz/',
    },
    {
        name: 'Rojan Yepes',
        image: '/pictures/team/rojan.webp',
        position: 'CTO (Chief Technology Officer)',
        description:
            'Creative technologist and UI/UX leader. Heads the frontend team to craft innovative, user-centric designs while aligning visual identity with functional requirements. Drives UI/UX strategies ensuring intuitive and engaging digital experiences.',
        linkedInUrl: 'https://www.linkedin.com/in/rojan-yepes-5a8395254/',
        instagramUrl:
            'https://www.instagram.com/rojanyepes?utm_source=ig_web_button_share_sheet&igsh=MWFyYjIwYjZvb3gzMg==',
    },
]
export default function AboutUsPage() {
    return (
        <div className="py-20 relative ">
            <FlickeringGrid
                gridGap={1}
                squareSize={64}
                maxOpacity={0.5}
                flickerChance={0.05}
                className="absolute animate-in inset-0 h-screen -top-5 w-full -z-10 opacity-50 mask-r-from-30% mask-b-to-50% dark:opacity-80"
            />
            <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100%" />

            <div className="container mx-auto px-4  max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-foreground text-4xl font-extrabold">
                        About
                        <GradientText
                            variant="primary"
                            size="4xl"
                            animate="shimmer"
                            className="leading-relaxed ml-2"
                            style={{
                                fontFamily: "'Knewave', cursive",
                            }}
                        >
                            <h1>E-coop</h1>
                        </GradientText>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        Lands Horizon Corp builds e-coop-suite to empower
                        cooperatives with secure, user-friendly digital tools
                        that increase financial inclusion, transparency, and
                        operational efficiency.
                    </p>

                    <div className="bg-card/50 mt-8 rounded-lg p-6 shadow-sm">
                        <h2 className="text-foreground text-xl font-semibold">
                            Our Promise
                        </h2>
                        <p className="mt-2">
                            We prioritize transparency, trust, and member
                            success in every product we build — combining modern
                            security with simple, practical workflows for
                            cooperative growth.
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button variant="default" asChild>
                                <Link to="/auth/sign-up">
                                    <UserIcon className="inline h-5 w-5" />
                                    Sign Up Now
                                    <ArrowRightIcon className="inline h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <section className="mt-16">
                    <h3 className="sr-only">Services</h3>
                    <OurServices />
                </section>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-8 gap-6">
                        {LANDS_TEAM.map((member) => (
                            <TeamMemberCard
                                key={`${member.name}${member.position}`}
                                teamMember={member}
                                className="even:mt-8 odd:mb-8"
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
