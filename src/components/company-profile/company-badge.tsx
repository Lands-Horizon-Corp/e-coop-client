import { BadgeCheckFillIcon, BadgeQuestionFillIcon } from '../icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { ICompanyResource } from '@/types'

interface Props extends IClassProps {
    company: ICompanyResource
}

const CompanyBadge = ({ company, className }: Props) => {
    if (!company) return

    if (company.isAdminVerified)
        return <BadgeCheckFillIcon className={cn('text-primary', className)} />

    return <BadgeQuestionFillIcon className={cn('text-amber-500', className)} />
}

export default CompanyBadge
