import { cn } from '@/helpers'

import {
    DotBigIcon,
    DotsHorizontalIcon,
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    PlusIcon,
} from '@/components/icons'
import Image from '@/components/image'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { ILandsTeamMember } from '../../home.types'

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
    teamMember: ILandsTeamMember
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
            <Image
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
                    showCloseButton
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    className={cn(
                        'max-w-4xl p-0 flex outline-none gap-x-0 py-0 max-h-[70vh]',
                        className
                    )}
                >
                    <div className="w-1/2 shrink-0">
                        <Image
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

export default TeamMemberCard
