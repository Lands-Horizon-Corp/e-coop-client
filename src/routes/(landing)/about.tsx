import about_us from '@/assets/gifs/about-us.gif'
import { LANDS_TEAM } from '@/constants'
import { cn } from '@/lib'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import {
    DotBigIcon,
    DotsHorizontalIcon,
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    PlusIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, LandsTeamMember } from '@/types'

const AboutPage = () => {
    return (
        <PageContainer className="space-y-16 py-0 px-0 bg-background/70 font-inter">
            <div className="mt-3 flex lg:max-w-[1000px] px-8 sm:px-0 flex-col items-center justify-center space-y-8 md:mt-5 lg:mt-16 lg:space-y-12 xl:space-y-16">
                <h1 className="flex text-center justify-center items-center text-[min(52px,6vw)] font-bold leading-tight ">
                    <ImageDisplay
                        src={about_us}
                        className="block size-8 md:size-12 lg:size-16 rounded-none mr-2 !bg-transparent "
                    />
                    About Lands Horizon Corp
                </h1>
                <p className="max-w-5xl text-center text-[min(18px,4.5vw)] font-medium text-muted-foreground">
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
            <div className="bg-background w-screen flex flex-col items-center">
                <div className="px-8 sm:px-24 py-16 space-y-4 max-w-6xl w-full">
                    <p className="text-5xl text-left">Meet Our Team</p>
                    <p className="text-muted-foreground">
                        Meet our team of experts dedicated to helping
                        cooperatives transition to modern, cloud-based
                        technologies.
                    </p>
                    <div className="grid grid-cols-3 py-8 gap-6">
                        {LANDS_TEAM.map((member) => (
                            <TeamMemberCard
                                key={`${member.name}${member.position}`}
                                teamMember={member}
                                className="even:mt-8 odd:mb-8"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}

const TeamMemberCard = ({
    className,
    teamMember: {
        name,
        image,
        position,
        description,
        facebookUrl,
        linkedInUrl,
        instagramUrl,
    },
}: {
    teamMember: LandsTeamMember
} & IClassProps) => {
    const viewMoreModal = useModalState()

    return (
        <div
            onClick={() => viewMoreModal.onOpenChange(!viewMoreModal.open)}
            className={cn(
                'group cursor-pointer group relative overflow-hidden rounded-2xl bg-card border-0 hover:shadow-sm transition-all duration-500 delay-150',
                className
            )}
        >
            <img
                src={image || '/placeholder.svg'}
                className="object-cover absolute top-0 left-0 size-full transition-transform duration-300 group-hover:scale-105"
            />
            <Button
                size="icon"
                variant="secondary"
                className="size-fit p-2 absolute bg-secondary/40 backdrop-blur-sm top-5 group-hover:bg-primary right-5 z-10 rounded-full"
            >
                <PlusIcon className="size-4 group-hover:rotate-45 duration-200 ease-in-out" />
            </Button>
            <div className="relative mt-[300px] pt-16">
                <div className="absolute pointer-events-none inset-0 z-0 bg-gradient-to-t from-popover via-background/40 to-transparent" />
                <div
                    className="backdrop-blur-sm inset-0 w-full z-0 absolute bottom-0 left-0"
                    style={{
                        maskImage:
                            'linear-gradient(to top, rgb(0, 0, 0) 25%, transparent)',
                    }}
                />
                <div className="pt-4 px-4 pb-2 relative z-10">
                    <h3 className="text-xl mb-1">{name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                        <DotBigIcon className="inline text-primary" />{' '}
                        {position}
                    </p>
                    <p className="text-muted-foreground text-xs hover:underline">
                        <DotsHorizontalIcon className="ml-1 inline" />
                    </p>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    {...viewMoreModal}
                    hideCloseButton
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    className={cn(
                        'max-w-4xl p-0 flex outline-none gap-x-0 py-0 max-h-[70vh]',
                        className
                    )}
                >
                    <div className="w-1/2 shrink-0">
                        <img
                            src={image || '/placeholder.svg'}
                            className="object-cover size-full transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex-1 min-h-0 max-h-full overflow-auto ecoop-scroll p-8 space-y-5">
                        <h3 className="text-xl mb-1">{name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                            <DotBigIcon className="inline text-primary" />{' '}
                            {position}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground mb-2">
                            {description}
                        </p>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Socials
                            </p>
                            <div
                                className="flex gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {instagramUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-fuchsia-300 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <InstagramIcon className="size-4" />
                                            <span className="sr-only">
                                                Instagram
                                            </span>
                                        </a>
                                    </Button>
                                )}
                                {linkedInUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-blue-300 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={linkedInUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <LinkedInIcon className="size-4" />
                                            <span className="sr-only">
                                                LinkedIn
                                            </span>
                                        </a>
                                    </Button>
                                )}
                                {facebookUrl && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-fit p-2 text-muted-foreground/70 hover:text-blue-400 hover:bg-foreground/20 transition-colors"
                                        asChild
                                    >
                                        <a
                                            href={facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FacebookIcon className="size-4" />
                                            <span className="sr-only">
                                                Facebook
                                            </span>
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/about')({
    component: AboutPage,
})

export default AboutPage
