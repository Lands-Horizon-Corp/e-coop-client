import about_us from '@/assets/gifs/about-us.gif'
import { createFileRoute } from '@tanstack/react-router'

import ImageDisplay from '@/components/image-display'

const AboutPage = () => {
    return (
        <div className="flex justify-center px-6 py-5 font-inter sm:px-8 lg:px-[60px] lg:py-10 xl:px-[124px]">
            <div className="mt-3 flex max-w-[1200px] flex-col items-center justify-center space-y-8 md:mt-5 lg:mt-16 lg:space-y-12 xl:space-y-16">
                <h1 className="flex text-center text-[min(52px,6vw)] font-bold leading-tight ">
                    <ImageDisplay
                        src={about_us}
                        className="block size-20 rounded-none mr-2 !bg-transparent "
                    />
                    About Lands Horizon Corp
                </h1>
                <p className="max-w-[1000px] text-center text-[min(20px,3vw)] font-medium text-muted-foreground">
                    Lands Horizon Corp is dedicated to empowering cooperatives
                    with secure, innovative, and user-friendly digital solutions
                    through the{' '}
                    <span className="font-semibold text-foreground">
                        e-coop-suite
                    </span>{' '}
                    platform. We prioritize transparency, trust, and member
                    success in every service we provide.
                </p>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})

export default AboutPage
