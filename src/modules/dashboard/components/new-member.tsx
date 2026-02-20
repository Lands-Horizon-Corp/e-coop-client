import { PeopleGroupIcon } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface NewMemberType {
    members?: any[]
    isLoading?: boolean
}
type MemberItem = {
    id: string
    full_name: string
    passbook: string
    occupation: string
    member_type?: {
        name: string
    }
    media?: {
        download_url?: string
    }
}

const sampleMembers: MemberItem[] = [
    {
        id: crypto.randomUUID(),
        full_name: 'Juan Dela Cruz',
        passbook: 'PB-100245',
        occupation: 'Farmer',
        member_type: { name: 'Regular' },
        media: {
            download_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
    },
    {
        id: crypto.randomUUID(),
        full_name: 'Maria Santos',
        passbook: 'PB-100246',
        occupation: 'Teacher',
        member_type: { name: 'Associate' },
        media: {
            download_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
    },
    {
        id: crypto.randomUUID(),
        full_name: 'Carlos Reyes',
        passbook: 'PB-100247',
        occupation: 'Vendor',
        member_type: { name: 'Youth Savers' },
        media: {
            download_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
    },
]
const NewMember = ({ members = [], isLoading = false }: NewMemberType) => {
    const displayMembers = members.length > 0 ? members : sampleMembers

    return (
        <section className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                    <PeopleGroupIcon className="text-primary size-4" />
                    New Members
                </h2>

                <span className="text-xs text-muted-foreground">
                    {displayMembers.length} members
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-1">
                <ul className="space-y-3">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                              <div
                                  className="flex items-center gap-3 animate-pulse"
                                  key={i}
                              >
                                  <Skeleton className="w-10 h-10 rounded-full" />
                                  <div className="flex-1 space-y-2">
                                      <Skeleton className="h-4 w-2/3" />
                                      <Skeleton className="h-3 w-1/3" />
                                  </div>
                              </div>
                          ))
                        : displayMembers.map((member) => (
                              <li
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition"
                                  key={member.id}
                              >
                                  <Avatar className="size-10">
                                      <AvatarImage
                                          alt={member.full_name}
                                          src={member.media?.download_url}
                                      />
                                      <AvatarFallback className="text-sm bg-secondary text-muted-foreground">
                                          {member.full_name.charAt(0)}
                                      </AvatarFallback>
                                  </Avatar>

                                  <div className="flex flex-col flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium truncate">
                                              {member.full_name}
                                          </span>

                                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                                              {member.member_type?.name ??
                                                  'Regular'}
                                          </span>
                                      </div>

                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[11px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                                              {member.passbook}
                                          </span>

                                          <span className="text-xs text-muted-foreground truncate">
                                              {member.occupation}
                                          </span>
                                      </div>
                                  </div>
                              </li>
                          ))}
                </ul>
            </div>
        </section>
    )
}

export default NewMember
