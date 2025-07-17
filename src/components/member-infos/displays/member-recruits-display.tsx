import { toReadableDate } from '@/utils'
import { sanitizeHtml } from '@/utils/sanitizer'

import CopyTextButton from '@/components/copy-text-button'
import { UsersAddIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMemberRecruitedMembers } from '@/types'

import SectionTitle from '../section-title'

interface Props {
    recruits?: IMemberRecruitedMembers[]
}

const MemberRecruitsDisplay = ({ recruits }: Props) => {
    return (
        <div className="space-y-4">
            <SectionTitle
                Icon={UsersAddIcon}
                title="Member Recruits"
                subTitle="Accounts of your registered relative for reference"
            />

            {(!recruits || recruits.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No recruits found
                </p>
            )}
            {recruits?.map((recruit) => (
                <div
                    key={recruit.id}
                    className="space-y-2 rounded-xl bg-secondary/20 p-4"
                >
                    <div className="flex items-center gap-x-4">
                        <PreviewMediaWrapper
                            media={recruit.membersProfileRecruited?.media}
                        >
                            <ImageDisplay
                                src={
                                    recruit.membersProfileRecruited?.media
                                        ?.download_url
                                }
                                className="size-16 rounded-xl"
                            />
                        </PreviewMediaWrapper>
                        <div className="grid flex-1 gap-2 md:grid-cols-5">
                            <div className="space-y-2">
                                <p>
                                    {`${recruit.membersProfile?.first_name ?? '-'} ${recruit.membersProfileRecruited?.middle_name ?? '-'} ${recruit.membersProfileRecruited?.last_name ?? '-'} ${recruit.membersProfileRecruited?.suffix ?? ''}`}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Full Name
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p>
                                    {recruit.membersProfileRecruited
                                        ?.passbook ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Passbook Number{' '}
                                    {recruit.membersProfileRecruited
                                        ?.passbook && (
                                        <CopyTextButton
                                            successText="Passbook number copied"
                                            textContent={
                                                recruit.membersProfileRecruited
                                                    .passbook
                                            }
                                        />
                                    )}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="truncate">
                                    {recruit.membersProfileRecruited
                                        ?.member_type?.name ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Member Type
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="truncate">
                                    {recruit?.membersProfileRecruited
                                        ?.passbook ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Passbook Number
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p>
                                    {recruit.dateRecruited
                                        ? toReadableDate(recruit.dateRecruited)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Date Recruited
                                </p>
                            </div>
                        </div>
                    </div>
                    <Accordion collapsible type="single" className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-normal">
                                Description
                            </AccordionTrigger>
                            <AccordionContent className="prose-h1: prose w-full !max-w-full rounded-xl p-4 text-sm text-foreground/70 dark:prose-invert prose-p:text-foreground/80 prose-strong:text-foreground sm:text-sm">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            recruit.description &&
                                                recruit.description.length > 0
                                                ? recruit.description
                                                : '<i>No Description</i>'
                                        ),
                                    }}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))}
        </div>
    )
}

export default MemberRecruitsDisplay
