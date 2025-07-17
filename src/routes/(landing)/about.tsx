import about_bg_element_1 from '@/assets/images/about-page/about_bg_element_1.webp'
import about_image_1 from '@/assets/images/about-page/about_image_1.webp'
import about_picture_1 from '@/assets/images/about-page/about_picture_1.webp'
import about_picture_2 from '@/assets/images/about-page/about_picture_2.webp'
import about_picture_3 from '@/assets/images/about-page/about_picture_3.webp'
import bg_element_5 from '@/assets/images/landing-page/bg_element_5.webp'
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
                    src={about_image_1}
                    className="h-auto w-[1193px]"
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
                    The concept of cooperatives dates back to the early 19th
                    century, rooted in the principles of mutual aid and
                    community-driven progress. Cooperatives were initially
                    established to address the needs of marginalized groups,
                    particularly in rural and working-class communities. The
                    first recognized cooperative was formed in Rochdale,
                    England, in 1844 by a group of weavers known as the Rochdale
                    Pioneers. They aimed to combat economic hardship by pooling
                    their resources to create a community store that sold
                    affordable goods to its members.
                </p>
                <div className="relative flex w-full justify-start lg:pt-10">
                    <h3 className="text-[min(25px,4.2vw)] font-bold">People</h3>
                    <img
                        src={about_bg_element_1}
                        className="absolute left-3 -z-20 h-auto w-[300px] md:left-5 lg:-top-40 lg:w-[464px]"
                        alt="background"
                    />
                </div>
                <div className="flex w-full justify-between">
                    <img src={about_picture_1} className="" alt="picture" />
                    <img src={about_picture_2} className="" alt="picture" />
                    <img src={about_picture_3} className="" alt="picture" />
                </div>
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
