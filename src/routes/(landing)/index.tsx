import { cn } from '@/lib'
import { useTheme } from '@/providers/theme-provider'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import {
    ArrowChevronRight,
    BorderedShieldIcon,
    GiClockIcon,
    RiCommunityFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Galaxy3D } from '@/components/ui/galaxy'
import Plane from '@/components/ui/plane'

import MissionVisionSection from './-landing-components/mission-vision'
import OurServices from './-landing-components/our-services'

interface CardProps {
    icon: React.ReactNode
    label: string
    description: string
}

const Card: React.FC<CardProps> = ({ icon, label, description }) => {
    return (
        <div className="flex flex-col items-center bg-transparent p-8 min-w-[260px] max-w-[320px] transition-transform duration-300 hover:scale-105">
            <div className="mb-5 flex items-center justify-center rounded-full p-5 shadow-inner transition-shadow duration-300 group-hover:shadow-primary/70 hover:shadow-primary/70">
                <span className="transition-shadow duration-300 group-hover:drop-shadow-[0_0_16px_theme(colors.primary.DEFAULT)] hover:drop-shadow-[0_0_16px_theme(colors.primary.DEFAULT)]">
                    {icon}
                </span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground text-center tracking-tight">
                {label}
            </h3>
            <p className="text-base text-muted-foreground text-center leading-relaxed">
                {description}
            </p>
        </div>
    )
}

export function HeroSection() {
    const { theme } = useTheme()

    return (
        <>
            <div className={cn(theme === 'dark' ? 'hidden' : 'block')}>
                <Plane />
            </div>
            <div className={cn(theme === 'dark' ? 'block' : 'hidden')}>
                <Galaxy3D />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 ">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Main heading */}
                    <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                        Empowering Communities
                        <br />
                        <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                            Through Cooperative
                        </span>
                        <br />
                        Ownership
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
                        Cooperatives embody the power of community, where shared
                        ownership and mutual aid transform economic challenges
                        into opportunities for progress and empowerment.
                    </p>

                    {/* CTA Button */}
                    <div className="mb-12">
                        <Button
                            size="lg"
                            className="bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                            asChild
                        >
                            <Link to="/auth/sign-up">
                                {"Let's get Started"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Feature highlights */}
                    <div className="flex w-full items-center gap-4 py-10 justify-center">
                        <Card
                            icon={
                                <BorderedShieldIcon
                                    size={40}
                                    className="text-primary"
                                />
                            }
                            label="Security & Transparency"
                            description="All transactions are protected with advanced security and fully transparent for member trust."
                        />
                        <div className="flex items-center">
                            <ArrowChevronRight
                                size={20}
                                className="text-primary/50 opacity-30"
                            />
                            <ArrowChevronRight
                                size={20}
                                className="text-primary"
                            />
                            <ArrowChevronRight
                                size={20}
                                className="text-primary/50 opacity-30"
                            />
                        </div>
                        <Card
                            icon={
                                <GiClockIcon
                                    size={40}
                                    className="text-primary"
                                />
                            }
                            label="Convenience & Automation"
                            description="Easily manage accounts, loans, and payments anytime with automated digital tools."
                        />
                        <div className="flex items-center">
                            <ArrowChevronRight
                                size={20}
                                className="text-primary/50 opacity-30"
                            />
                            <ArrowChevronRight
                                size={20}
                                className="text-primary"
                            />
                            <ArrowChevronRight
                                size={20}
                                className="text-primary/50 opacity-30"
                            />
                        </div>
                        <Card
                            icon={
                                <RiCommunityFillIcon
                                    size={40}
                                    className="text-primary"
                                />
                            }
                            label="Empowerment & Growth"
                            description="Access financial services and insights designed to help cooperatives and their members prosper."
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <MissionVisionSection />
            <OurServices />
        </div>
    )
}

export const Route = createFileRoute('/(landing)/')({
    component: LandingPage,
})

export default LandingPage
