import { cn } from '@/lib'

import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IClassProps } from '@/types'
import { IMemberProfile, TEntityId } from '@/types'

import { Separator } from '../ui/separator'
import MemberAssetsDisplay from './displays/member-assets-display'
import MemberExpensesDisplay from './displays/member-expenses-display'
import MemberIncomeDisplay from './displays/member-income-display'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberFinancialInfo = ({ profileId, className, defaultData }: Props) => {
    const { data } = useMemberProfile({
        profileId,
        initialData: defaultData,
    })

    return (
        <div
            className={cn(
                'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                className
            )}
        >
            <MemberIncomeDisplay incomes={data?.member_incomes} />
            <Separator />
            <MemberAssetsDisplay assets={data?.member_assets} />
            <Separator />
            <MemberExpensesDisplay expenses={data?.member_expenses} />
        </div>
    )
}

export default MemberFinancialInfo
