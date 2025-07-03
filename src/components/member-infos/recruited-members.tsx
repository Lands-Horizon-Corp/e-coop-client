import { forwardRef } from 'react'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'

import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IBaseProps, IMemberProfile, TEntityId } from '@/types'

import GeneralStatusBadge from '../badges/general-status-badge'
import ImageNameDisplay from '../elements/image-name-display'
import { UserPlusIcon } from '../icons'
import LoadingSpinner from '../spinners/loading-spinner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import SectionTitle from './section-title'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const RecruitedMembers = forwardRef<HTMLDivElement, Props>(
    ({ className, profileId, defaultData }, ref) => {
        const { data, isPending } = useMemberProfile({
            profileId,
            initialData: defaultData,
        })

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <SectionTitle title="Recruited Members" Icon={UserPlusIcon} />
                {!data && isPending && <LoadingSpinner />}
                {data && (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Fullname</TableHead>
                                <TableHead>Passbook No.</TableHead>
                                <TableHead>Member Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Date Joined
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recruited_members !== undefined &&
                            data.recruited_members.length > 0 ? (
                                data.recruited_members?.map(
                                    ({
                                        id,
                                        membersProfileRecruited: {
                                            media,
                                            passbook,
                                            full_name,
                                            member_type,
                                            status,
                                            created_at,
                                        },
                                    }) => (
                                        <TableRow key={id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <ImageNameDisplay
                                                        src={
                                                            media?.download_url
                                                        }
                                                        name={full_name}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>{passbook}</TableCell>
                                            <TableCell>
                                                {member_type?.name}
                                            </TableCell>
                                            <TableCell>
                                                <GeneralStatusBadge
                                                    generalStatus={status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {created_at
                                                    ? toReadableDate(created_at)
                                                    : ''}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <p className="py-16 text-center text-sm text-muted-foreground/80">
                                            No recruited member(s) yet.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        )
    }
)

export default RecruitedMembers
