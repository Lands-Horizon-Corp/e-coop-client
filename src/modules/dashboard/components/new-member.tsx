import { PeopleGroupIcon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface NewMemberType {
    members?: any[]
    isLoading?: boolean
}

const sampleMembers = [
    {
        full_name: 'Juan Dela Cruz',
        passbook_number: 'PB-100245',
        media: {
            download_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
    },
    {
        full_name: 'Maria Santos',
        passbook_number: 'PB-100246',
        media: {
            download_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
    },
    {
        full_name: 'Carlos Reyes',
        passbook_number: 'PB-100247',
        media: {
            download_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
    },
]

const NewMember = ({ members = [], isLoading = false }: NewMemberType) => {
    const displayMembers = members.length > 0 ? members : sampleMembers

    return (
        <section className="bg-card min-w-[10rem] border border-border rounded-xl p-4 h-full">
            {/* Header */}
            <h2 className="text-sm font-semibold text-foreground mb-4 inline-flex items-center">
                <PeopleGroupIcon className="text-primary mr-1" />
                New Members
            </h2>

            <ul className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div className="inline-flex space-x-2" key={i}>
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    displayMembers.map((member, index) => (
                        <li
                            className="flex items-center gap-3"
                            key={`${member.full_name}-${index}`}
                        >
                            <Avatar className="size-9">
                                <AvatarImage
                                    alt={member.full_name}
                                    src={member.media?.download_url}
                                />
                                <AvatarFallback className="text-xs bg-secondary text-muted-foreground">
                                    {member.full_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground truncate">
                                    {member.full_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {member.passbook_number}
                                </span>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </section>
    )
}

export default NewMember
