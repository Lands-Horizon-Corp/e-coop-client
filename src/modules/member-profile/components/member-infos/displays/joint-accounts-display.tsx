import { IMemberJointAccount } from '@/modules/member-joint-account'

import { HandShakeHeartIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import TextRenderer from '@/components/text-renderer'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import SectionTitle from '../section-title'

interface Props {
    jointAccounts?: IMemberJointAccount[]
}

const JointAccountsDisplay = ({ jointAccounts }: Props) => {
    return (
        <div className="space-y-4">
            <SectionTitle
                Icon={HandShakeHeartIcon}
                subTitle="Co-owners of this account that have the access and share
                financial responsibility of this account "
                title="Joint Accounts"
            />
            {(!jointAccounts || jointAccounts.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    no joint accounts
                </p>
            )}
            {jointAccounts?.map((jointAcc) => (
                <div
                    className="space-y-2 rounded-xl bg-secondary/20 p-4"
                    key={jointAcc.id}
                >
                    <div className="flex gap-x-4">
                        <div className="grid w-80 grid-cols-2 gap-x-4">
                            <div className="">
                                <PreviewMediaWrapper
                                    media={jointAcc.picture_media}
                                >
                                    <ImageDisplay
                                        className="h-24 w-full rounded-xl"
                                        src={
                                            jointAcc.picture_media?.download_url
                                        }
                                    />
                                </PreviewMediaWrapper>
                                <p className="mt-1 text-xs text-muted-foreground/70">
                                    Photo
                                </p>
                            </div>

                            <div className="">
                                <PreviewMediaWrapper
                                    media={jointAcc.signature_media}
                                >
                                    <ImageDisplay
                                        className="h-24 w-full rounded-xl"
                                        src={
                                            jointAcc.signature_media
                                                ?.download_url
                                        }
                                    />
                                </PreviewMediaWrapper>
                                <p className="mt-1 text-xs text-muted-foreground/70">
                                    Signature
                                </p>
                            </div>
                        </div>

                        <div className="grid flex-1 gap-2 md:grid-cols-4">
                            <div className="space-y-2">
                                <p>{jointAcc.first_name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    First Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{jointAcc.middle_name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Middle Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{jointAcc.last_name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Last Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{jointAcc.suffix ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Suffix
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{jointAcc.family_relationship ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Relationship
                                </p>
                            </div>
                        </div>
                    </div>
                    <Accordion className="w-full" collapsible type="single">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-normal">
                                Description
                            </AccordionTrigger>
                            <AccordionContent className="prose-h1: prose w-full !max-w-full rounded-xl p-4 text-sm text-foreground/70 dark:prose-invert prose-p:text-foreground/80 prose-strong:text-foreground sm:text-sm">
                                <TextRenderer
                                    content={
                                        jointAcc.description &&
                                        jointAcc.description.length > 0
                                            ? jointAcc.description
                                            : '<i>No Description</i>'
                                    }
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            ))}
        </div>
    )
}

export default JointAccountsDisplay
