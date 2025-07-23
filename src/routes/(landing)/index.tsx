import { Link, createFileRoute } from '@tanstack/react-router'

import {
    ArrowChevronRight,
    BorderedShieldIcon,
    GiClockIcon,
    RiCommunityFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import MissionVisionSection from './-landing-components/mission-vision'
import OurServices from './-landing-components/our-services'

interface CardProps {
    icon: React.ReactNode
    label: string
    description: string
}

const Card: React.FC<CardProps> = ({ icon, label, description }) => {
    return (
        <div className="flex flex-col items-center p-6 rounded-lg transition-shadow duration-300">
            <div className="mb-4 bg-green-900/20 border-primary/20 border-[1px] rounded-full p-7">
                {icon}
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                {label}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                {description}
            </p>
        </div>
    )
}

const LandingPage = () => {
    return (
        <div className="flex h-fit justify-center px-6 font-inter sm:px-8 lg:px-[60px] xl:px-[124px]">
            <div className="h-fit w-full max-w-[1240px]">
                <div className="flex w-full flex-col md:mb-24 lg:mb-32 items-center justify-center space-y-12 py-10 lg:py-20">
                    <h1 className="w-[80%] text-center pt-2 text-[min(64px,5.5vw)] font-black capitalize md:pt-20 lg:leading-[4.8rem]">
                        Empowering Communities Through Cooperative Ownership
                    </h1>
                    <p className="w-full flex-none text-justify text-[min(25px,3.0vw)] font-semibold text-[#5A5A5A] dark:text-[#cccccc] ">
                        Cooperatives embody the power of community, where shared
                        ownership and mutual aid transform economic challenges
                        into opportunities for progress and empowerment.
                    </p>
                    <div className="flex w-full items-center justify-center py-5">
                        <Link to="/auth/sign-up">
                            <Button
                                className={cn(
                                    'h-10 rounded-full bg-green-500 text-[min(18px,2.5vw)] hover:bg-green-500 dark:text-white xl:h-14 xl:px-5'
                                )}
                            >
                                Let's get Started
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex w-full items-center  gap-4 py-10">
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
                    <div className="flex items-center ">
                        <ArrowChevronRight
                            size={20}
                            className="text-primary/50 opacity-30"
                        />
                        <ArrowChevronRight size={20} className="text-primary" />
                        <ArrowChevronRight
                            size={20}
                            className="text-primary/50 opacity-30"
                        />
                    </div>
                    <Card
                        icon={
                            <GiClockIcon size={40} className="text-primary" />
                        }
                        label="Convenience & Automation"
                        description="Easily manage accounts, loans, and payments anytime with automated digital tools."
                    />
                    <div className="flex items-center ">
                        <ArrowChevronRight
                            size={20}
                            className="text-primary/50 opacity-30"
                        />
                        <ArrowChevronRight
                            size={20}
                            className="text-primary "
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
                <MissionVisionSection />
                <OurServices />
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/')({
    component: LandingPage,
})

export default LandingPage
