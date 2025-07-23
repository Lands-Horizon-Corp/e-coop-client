import about_us from '@/assets/gifs/about-us.gif'
import { createFileRoute } from '@tanstack/react-router'

import ImageDisplay from '@/components/image-display'

const AboutPage = () => {
    return (
        <div className="flex justify-center px-6 py-5 bg-background/70 font-inter sm:px-8 lg:px-[60px] lg:py-10 xl:px-[124px]">
            <div className="mt-3 flex lg:max-w-[1000px]  flex-col items-center justify-center space-y-8 md:mt-5 lg:mt-16 lg:space-y-12 xl:space-y-16">
                <h1 className="flex text-center justify-center items-center text-[min(52px,6vw)] font-bold leading-tight ">
                    <ImageDisplay
                        src={about_us}
                        className="block size-8 md:size-12 lg:size-16 rounded-none mr-2 !bg-transparent "
                    />
                    About Lands Horizon Corp
                </h1>
                <p className="max-w-[1000px] text-center text-[min(18px,4.5vw)] font-medium text-muted-foreground">
                    Lands Horizon Corp is dedicated to empowering cooperatives
                    with secure, innovative, and user-friendly digital solutions
                    through the{' '}
                    <span className="font-semibold text-foreground">
                        e-coop-suite
                    </span>{' '}
                    platform. We prioritize transparency, trust, and member
                    success in every service we provide.
                </p>
                <div className="relative mt-20 w-full">
                    <h3 className="text-[min(25px,3.5vw)] font-bold lg:h-5">
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
                                the modern world.
                            </p>
                        </div>
                    </div>
                    <div className="h-fit w-full space-y-5 self-center">
                        <div>
                            <p className="mt-10 text-justify indent-8 text-[min(18px,4.5vw)] dark:text-[#cccccc] xl:leading-[41px]">
                                We believe in the values of cooperation,
                                integrity, and shared success. Our dedicated
                                team works tirelessly to deliver technology that
                                enhances financial inclusion, operational
                                efficiency, and community prosperity. Join us on
                                our journey to transform the cooperative
                                experience—where your growth, security, and
                                trust are always at the heart of what we do.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})

export default AboutPage
