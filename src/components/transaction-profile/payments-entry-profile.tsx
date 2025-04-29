import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, UserX } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { BadgeCheckFillIcon, Image2Icon } from '../icons'
import { IMember } from '@/types'
import CopyTextButton from '@/components/copy-text-button'
import { ImagePreviewData } from '@/store/image-preview-store'

type PaymentsEntryProfileProps = {
    profile: IMember | null
    onOpen: (image: ImagePreviewData) => void
}

const NoMemberSelected = () => (
    <Card className="flex flex-col items-center justify-center gap-4 rounded-2xl p-5 shadow-md">
        <UserX size={48} className="text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-700">
            No Member Selected
        </h2>
        <p className="text-center text-sm text-gray-500">
            There’s no member selected. Please add a member first to continue.
        </p>
    </Card>
)

const PaymentsEntryProfile = ({
    profile,
    onOpen,
}: PaymentsEntryProfileProps) => {
    if (!profile) return <NoMemberSelected />

    const { id, memberProfile, fullName, permanentAddress, media } = profile

    return (
        <Card className="flex items-center gap-6 rounded-2xl p-5 shadow-md">
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                {media?.url ? (
                    <img
                        onClick={() => {
                            onOpen({ Images: [media] })
                        }}
                        className="h-full w-full cursor-pointer object-cover"
                        src={media?.url ?? 'https://via.placeholder.com/150'}
                        alt={fullName ?? 'Member Image'}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary dark:bg-popover">
                        <Image2Icon
                            className="text-muted-foreground"
                            size={100}
                        />
                    </div>
                )}
            </div>

            <CardContent className="flex flex-col justify-between gap-2 p-0">
                <h2 className="text-2xl font-bold text-accent-foreground">
                    {fullName}
                    <BadgeCheckFillIcon className="ml-2 inline size-5 text-primary" />
                </h2>
                <p className="text-sm text-gray-500">
                    <span className="text-sm font-light"> Passbook No:</span>{' '}
                    <span className="text-sidebar-accent-foreground">
                        {memberProfile?.passbookNumber}
                    </span>
                    <CopyTextButton
                        className="ml-2"
                        textContent={memberProfile?.passbookNumber ?? ''}
                    />
                </p>
                <div className="flex gap-2 text-sm text-gray-600">
                    <Link
                        to={`/members/${id}` as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-black hover:underline dark:text-primary-foreground"
                    >
                        profile <ArrowUpRight size={14} />
                    </Link>
                    <span className="text-sidebar-accent-foreground">
                        • {permanentAddress}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default PaymentsEntryProfile
