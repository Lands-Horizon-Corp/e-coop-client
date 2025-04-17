import {
    CalendarIcon,
    TelephoneIcon,
    LocationPinIcon,
    Users3Icon,
} from '@/components/icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IBranchResource } from '@/server'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    branch: IBranchResource
}

const BranchBasicDetailsList = ({ branch, className }: Props) => {
    return (
        <div className={cn('flex flex-col justify-start gap-y-4', className)}>
            <span className="inline-flex items-center gap-x-2">
                <TelephoneIcon className="text-foreground/70" />
                {branch.contactNumber}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <CalendarIcon className="text-foreground/70" />
                {toReadableDate(branch.createdAt)}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <LocationPinIcon className="text-foreground/70" />
                {branch.address}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <Users3Icon className="text-foreground/70" />{' '}
                {branch.members?.length || 0} Members
            </span>
        </div>
    )
}

export default BranchBasicDetailsList
