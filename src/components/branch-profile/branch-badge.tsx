import { BadgeCheckFillIcon, BadgeQuestionFillIcon } from '../icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IBranchResource } from '@/server'

interface Props extends IClassProps {
    branch: IBranchResource
}

const BranchBadge = ({ branch, className }: Props) => {
    if (!branch) return

    if (branch.isAdminVerified)
        return <BadgeCheckFillIcon className={cn('text-primary', className)} />

    return <BadgeQuestionFillIcon className={cn('text-amber-500', className)} />
}

export default BranchBadge
