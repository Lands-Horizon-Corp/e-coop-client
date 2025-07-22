import bg_element_5 from '@/assets/images/landing-page/bg_element_5.webp'
import about_us from '@/assets/images/about-page/about_us.webp'
import { createFileRoute } from '@tanstack/react-router'

const AboutPage = () => {
    return (
        <div className="flex justify-center px-6 py-5 font-inter sm:px-8 lg:px-[60px] lg:py-10 xl:px-[124px]">
            <div className="mt-3 flex max-w-[1200px] flex-col items-center justify-center space-y-4 md:mt-5 lg:mt-16 lg:space-y-7 xl:space-y-10">
                <h1 className="max-w-[1100px] text-center text-[min(64px,5.5vw)] font-black">
                    Empowering Communities, Fostering Sustainable Growth
                </h1>
                <h2 className="max-w-[1007px] text-center text-[min(24px,3.5vw)] font-medium">
                    Helping our members achieve their dreams while building a
                    stronger, more prosperous community.
                </h2>
                <img
                    src={about_us}
                    className="h-auto w-[900px]"
                    alt="image"
                />
                <div className="relative flex w-full justify-start lg:pt-10">
                    <h3 className="text-[min(25px,4.2vw)] font-bold">
                        Get to know us
                    </h3>
                    <img
                        src={bg_element_5}
                        className="absolute -left-5 -top-24 -z-20 h-auto w-[100px] rotate-90 lg:-top-40 lg:w-[178px]"
                        alt="background"
                    />
                </div>
                <p className="text-justify indent-8 text-[min(20px,3.5vw)] font-normal">
                    At Lands Horizon Corp, we are passionate about empowering
                    cooperatives and their members. Through our innovative
                    e-coop-suite platform, we provide secure, transparent, and
                    user-friendly digital solutions to help cooperatives thrive
                    in the modern world. We believe in the values of
                    cooperation, integrity, and shared success. Our dedicated
                    team works tirelessly to deliver technology that enhances
                    financial inclusion, operational efficiency, and community
                    prosperity. Join us on our journey to transform the
                    cooperative experience—where your growth, security, and
                    trust are always at the heart of what we do.
                </p>
                <h2 className="max-w-[1007px] text-center text-[min(20px,3.5vw)] font-light">
                    The people driving the company are passionate visionaries
                    dedicated to empowering creativity and fostering community
                    growth.
                </h2>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})

export default AboutPage
