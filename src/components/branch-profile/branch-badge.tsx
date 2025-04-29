import { BadgeCheckFillIcon, BadgeQuestionFillIcon } from '../icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IBranch } from '@/types'

interface Props extends IClassProps {
    branch: IBranch
}

const BranchBadge = ({ branch, className }: Props) => {
    if (!branch) return

    if (branch.isAdminVerified)
        return <BadgeCheckFillIcon className={cn('text-primary', className)} />

    return <BadgeQuestionFillIcon className={cn('text-amber-500', className)} />
}

export default BranchBadge
