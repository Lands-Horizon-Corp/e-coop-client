import {
    StoreIcon,
    Users3Icon,
    CalendarIcon,
    TelephoneIcon,
    LocationPinIcon,
} from '@/components/icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { ICompanyResource } from '@/types'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    company: ICompanyResource
}

const CompanyBasicDetailsList = ({ company, className }: Props) => {
    return (
        <div className={cn('flex flex-col justify-start gap-y-4', className)}>
            <span className="inline-flex items-center gap-x-2">
                <TelephoneIcon className="text-foreground/70" />
                {company.contactNumber}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <CalendarIcon className="text-foreground/70" />
                {toReadableDate(company.createdAt)}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <LocationPinIcon className="text-foreground/70" />{' '}
                {company.address}
            </span>
            <span className="inline-flex items-center gap-x-2">
                <StoreIcon className="text-foreground/70" /> {8} Branches
            </span>
            <span className="inline-flex items-center gap-x-2">
                <Users3Icon className="text-foreground/70" /> {4.8}K Members
            </span>
        </div>
    )
}

export default CompanyBasicDetailsList
