import { toReadableDate } from '@/helpers/date-utils'
import { IMemberJointAccount } from '@/modules/member-joint-account'

import { CalendarIcon, Users3Icon, WoodSignsIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Separator } from '@/components/ui/separator'
import { PlainTextEditor } from '@/components/ui/text-editor'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

interface JoinAccountCardViewProps {
    jointAccounts: IMemberJointAccount
    className?: string
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const TransactionJointMemberCard = ({
    jointAccounts,
    className,
    onClick,
}: JoinAccountCardViewProps) => {
    return (
        <div
            className={`flex flex-col gap-y-1 rounded-xl border bg-background p-4 ${className}`}
            onClick={onClick}
        >
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <Users3Icon className="inline size-6 text-muted-foreground" />
                    <p className="font-bold">{jointAccounts.full_name}</p>
                </div>
            </div>
            <Separator className="!my-2" />
            <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="col-span-full flex flex-1 flex-col items-center sm:col-span-2">
                    <PreviewMediaWrapper media={jointAccounts.picture_media}>
                        <ImageDisplay
                            src={jointAccounts.picture_media?.download_url}
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Picture
                    </span>
                </div>
                <div className="col-span-full flex flex-1 flex-col items-center sm:col-span-2">
                    <PreviewMediaWrapper media={jointAccounts.signature_media}>
                        <ImageDisplay
                            src={jointAccounts.signature_media?.download_url}
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Signature
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 space-y-2 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">First Name</p>
                    <p>{jointAccounts.first_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Middle Name</p>
                    <p>
                        {jointAccounts.middle_name || (
                            <span className="italic text-muted-foreground/60">
                                -
                            </span>
                        )}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Last Name</p>
                    <p>{jointAccounts.last_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Suffix</p>
                    <p>
                        {jointAccounts.suffix || (
                            <span className="italic text-muted-foreground/60">
                                -
                            </span>
                        )}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Birthday</p>
                    <p>
                        <CalendarIcon className="mr-1 hidden size-4 text-muted-foreground/60 2xl:inline" />
                        {jointAccounts.birthday
                            ? toReadableDate(jointAccounts.birthday)
                            : '-'}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Relationship</p>
                    <p>{jointAccounts.family_relationship}</p>
                </div>
            </div>
            <div className="col-span-full !mt-4 space-y-2">
                <p className="text-muted-foreground/70">Description</p>
                {jointAccounts?.description ? (
                    <PlainTextEditor
                        content={jointAccounts.description ?? 'no description'}
                    />
                ) : (
                    <p className="text-sm italic text-muted-foreground/60">
                        No Description <WoodSignsIcon className="ml-1 inline" />
                    </p>
                )}
            </div>
        </div>
    )
}

export default TransactionJointMemberCard
