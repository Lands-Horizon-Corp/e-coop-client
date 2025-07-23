import bg_element_4 from '@/assets/images/landing-page/bg_element_4.webp'

import { HandsHelpingIcon } from '@/components/icons'
import { Separator } from '@/components/ui/separator'

const MissionIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-12 h-12 lg:w-16 lg:h-16 text-primary"
    >
        <path d="M12 2a8 8 0 018 8c0 2.8-.84 5.3-2.5 7.4L16 20h-8l-1.5-2.6C4.84 15.3 4 12.8 4 10a8 8 0 018-8zm0 2a6 6 0 00-6 6c0 2.2.66 4.2 1.95 5.85L8.5 18h7l1.55-2.15C17.34 14.2 18 12.2 18 10a6 6 0 00-6-6zM9 21h6v2H9v-2z" />
    </svg>
)

const MissionVisionSection = () => {
    return (
        <div className="relative  space-y-8 py-10 lg:space-y-16 lg:py-20">
            <img
                src={bg_element_4}
                className="absolute -top-12 -z-40 h-auto w-[985px] 2xl:left-0 opacity-50"
                alt="background"
            />
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
                    <MissionIcon />
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Our Mission
                        </h2>
                        <p className="text-lg lg:text-xl font-normal text-gray-700 dark:text-[#cccccc] lg:w-[85%] leading-relaxed">
                            To{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                empower
                            </span>{' '}
                            cooperatives and their members globally through{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                secure, intuitive, and innovative digital
                                solutions
                            </span>
                            , fostering{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                financial inclusion
                            </span>
                            , robust{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                transparency
                            </span>
                            , and sustainable,{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                community-driven growth
                            </span>
                            .
                        </p>
                    </div>
                </div>
                <Separator className="my-10 lg:my-20 border-t border-gray-200 dark:border-gray-700" />{' '}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
                    <HandsHelpingIcon className="text-primary text-5xl lg:text-6xl" />
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Our Vision
                        </h2>
                        <p className="text-lg lg:text-xl font-normal text-gray-700 dark:text-[#cccccc] lg:w-[85%] leading-relaxed">
                            To be the{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                foremost digital platform
                            </span>{' '}
                            for cooperatives worldwide, cultivating a{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                dynamic ecosystem
                            </span>{' '}
                            where members and organizations{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                flourish
                            </span>{' '}
                            through cutting-edge,{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                trust-driven technology
                            </span>{' '}
                            and a commitment to{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                shared success
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionVisionSection
