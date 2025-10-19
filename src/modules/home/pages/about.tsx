'use client'

import { useEffect, useState } from 'react'

import { Link } from '@tanstack/react-router'

import ImageMatch from '@/components/image-match'
import { Particles } from '@/components/ui/background-particles'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/ui/gradient-text'
import { InteractiveGridPattern } from '@/components/ui/grid-pattern'

import TeamMemberCard from '../components/about/team-member-card'
import OurServices from '../components/home/our-services'
import { COOPERATIVE_ADVANTAGES, LANDS_TEAM } from '../home.constants'

const INITIAL_GRID_WIDTH = 60
const INITIAL_GRID_HEIGHT = 30

const useGridDimensions = (): [number, number] => {
    const [dimensions, setDimensions] = useState([
        INITIAL_GRID_WIDTH,
        INITIAL_GRID_HEIGHT,
    ])

    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        const updateDimensions = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                const width = Math.max(40, Math.floor(window.innerWidth / 20))
                const height = Math.max(20, Math.floor(window.innerHeight / 30))
                setDimensions([width, height])
            }, 100) // Debounce for 100ms
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions, { passive: true })
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', updateDimensions)
        }
    }, [])

    return [dimensions[0], dimensions[1]]
}

export default function AboutUsPage() {
    const gridSquares = useGridDimensions()

    return (
        <div className="py-20 relative ">
            <Particles
                className="absolute inset-0"
                color="#ffffff"
                ease={80}
                quantity={100}
                refresh
            />
            <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100% dark:block hidden" />

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
                        <p className="font-bold text-2xl mt-4">
                            Empowering cooperatives. Building communities.
                        </p>
                        <p className="font-light text-lg mt-6 text-muted-foreground max-w-3xl mx-auto">
                            Transforming cooperative banking with cutting-edge
                            technology, secure infrastructure, and
                            member-focused solutions that drive financial
                            inclusion and community growth.
                        </p>
                    </h1>
                </div>

                <section className="">
                    <OurServices />
                </section>

                {/* Full-width benefits section */}
            </div>

            <section>
                <div className="bg-gradient-to-tl from-primary to-primary/60 py-16 relative overflow-hidden">
                    <InteractiveGridPattern
                        className="absolute inset-0 opacity-20"
                        height={50}
                        squares={gridSquares}
                        squaresClassName="fill-white/10 hover:fill-white/30 transition-colors duration-500"
                        width={50}
                    />

                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="text-center text-primary-foreground">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                The benefits of using Cooperative Banking API
                            </h2>
                            <p className="text-xl md:text-2xl font-light opacity-90">
                                Developed to save time. Designed to be robust.
                            </p>
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                                {COOPERATIVE_ADVANTAGES.map((advantage) => (
                                    <div
                                        className="text-center grid grid-rows-[80px_auto_1fr] gap-4"
                                        key={advantage.id}
                                    >
                                        <div className="size-16 mx-auto overflow-hidden">
                                            <ImageMatch
                                                alt={advantage.imageAlt}
                                                className="w-full h-full"
                                                color="bg-primary-foreground/20"
                                                src={advantage.imageSrc}
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {advantage.title}
                                        </h3>
                                        <p className="opacity-80 text-sm">
                                            {advantage.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 max-w-6xl">
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
                    <div className="mt-8">
                        <Link to="/contact">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg transition-colors">
                                Let's talk
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
