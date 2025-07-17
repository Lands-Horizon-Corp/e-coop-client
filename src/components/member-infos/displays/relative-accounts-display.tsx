import { toReadableDate } from '@/utils'
import { sanitizeHtml } from '@/utils/sanitizer'

import CopyTextButton from '@/components/copy-text-button'
import { FamilyIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMemberRelativeAccount } from '@/types'

import SectionTitle from '../section-title'

interface Props {
    relativeAccounts?: IMemberRelativeAccount[]
}

const RelativeAccountsDisplay = ({ relativeAccounts }: Props) => {
    return (
        <div className="space-y-4">
            <SectionTitle
                title="Relative Accounts"
                subTitle="Accounts of your registered relative for reference"
                Icon={FamilyIcon}
            />
            {(!relativeAccounts || relativeAccounts.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    no relative accounts
                </p>
            )}
            {relativeAccounts?.map((relativeAcc) => (
                <div
                    key={relativeAcc.id}
                    className="space-y-2 rounded-xl bg-secondary/20 p-4"
                >
                    <div className="flex items-center gap-x-4">
                        <PreviewMediaWrapper
                            media={relativeAcc.relative_member_profile?.media}
                        >
                            <ImageDisplay
                                src={
                                    relativeAcc.relative_member_profile?.media
                                        ?.download_url
                                }
                                className="size-16 rounded-xl"
                            />
                        </PreviewMediaWrapper>
                        <div className="grid flex-1 gap-2 md:grid-cols-5">
                            <div className="space-y-2">
                                <p>
                                    {`${relativeAcc.relative_member_profile?.first_name ?? '-'} ${relativeAcc.relative_member_profile?.middle_name ?? '-'} ${relativeAcc.relative_member_profile?.last_name ?? '-'} ${relativeAcc.relative_member_profile?.suffix ?? ''}`}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Full Name
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p>
                                    {relativeAcc.relative_member_profile
                                        ?.passbook ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Passbook Number{' '}
                                    {relativeAcc.relative_member_profile
                                        ?.passbook && (
                                        <CopyTextButton
                                            successText="Passbook number copied"
                                            textContent={
                                                relativeAcc
                                                    .relative_member_profile
                                                    .passbook
                                            }
                                        />
                                    )}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="truncate">
                                    {relativeAcc.relative_member_profile
                                        ?.member_type?.name ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Member Type
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="truncate">
                                    {relativeAcc.relative_member_profile
                                        ?.passbook ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Passbook Number
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{toReadableDate(relativeAcc.created_at)}</p>
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
                                            relativeAcc.description &&
                                                relativeAcc.description.length >
                                                    0
                                                ? relativeAcc.description
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

export default RelativeAccountsDisplay
