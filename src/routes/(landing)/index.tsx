import convenience_automation from '@/assets/images/landing-page/convenience_automation.webp'
import empowerment_growth from '@/assets/images/landing-page/empowerment_growth.webp'
import security_transparency from '@/assets/images/landing-page/security_transparency.webp'
import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import MissionVisionSection from './-landing-components/mission-vision'
import OurServices from './-landing-components/our-services'

const Card = ({
    imageSrc,
    imageAlt = 'Card Icon',
    label,
    description,
}: {
    imageSrc: string
    imageAlt?: string
    label?: string
    description: string
}) => (
    <div className="flex flex-col items-center text-center max-w-xs px-4">
        <div className="border-4 rounded-[30%] w-32 h-32 flex items-center justify-center overflow-hidden">
            <img
                src={imageSrc}
                alt={imageAlt}
                className=" size-32 object-contain"
            />
        </div>
        {label && <div className="mt-2 font-semibold text-xl">{label}</div>}
        <p className="mt-2 text-sm leading-snug">{description}</p>
    </div>
)

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
                <div className="flex w-full flex-wrap items-center justify-evenly gap-4 py-10">
                    <Card
                        imageSrc={security_transparency}
                        label="Security & Transparency"
                        description="All transactions are protected with advanced security and fully transparent for member trust."
                    />
                    <Card
                        imageSrc={convenience_automation}
                        label="Convenience & Automation"
                        description="Easily manage accounts, loans, and payments anytime with automated digital tools."
                    />
                    <Card
                        imageSrc={empowerment_growth}
                        imageAlt="Empowerment & Growth Icon"
                        label="Empowerment & Growth"
                        description="Access financial services and insights designed to help cooperatives and their members prosper."
                    />
                </div>
                <MissionVisionSection />
                <OurServices />
                <div className="relative mt-20 w-full">
                    <h3 className="text-[min(25px,3.5vw)] font-bold lg:h-16">
                        Get to know us
                    </h3>
                    <div className="h-fit w-full space-y-5 self-center">
                        <div>
                            <p className="mt-10 text-justify indent-8 text-[min(18px,4.5vw)] dark:text-[#cccccc] xl:leading-[41px]">
                                At Lands Horizon Corp, we are passionate about
                                empowering cooperatives and their members.
                                Through our innovative e-coop-suite platform, we
                                provide secure, transparent, and user-friendly
                                digital solutions to help cooperatives thrive in
                                the modern world. We believe in the values of
                                cooperation, integrity, and shared success. Our
                                dedicated team works tirelessly to deliver
                                technology that enhances financial inclusion,
                                operational efficiency, and community
                                prosperity. Join us on our journey to transform
                                the cooperative experience—where your growth,
                                security, and trust are always at the heart of
                                what we do.
                            </p>
                        </div>
                        <div className="flex h-[130px] w-full items-center justify-center">
                            <Link to="/about">
                                <Button
                                    className={cn(
                                        'h-10 rounded-full bg-green-500 text-[min(18px,2.5vw)] hover:bg-green-500 xl:h-14 xl:px-5'
                                    )}
                                >
                                    Read more about us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/')({
    component: LandingPage,
})

export default LandingPage
