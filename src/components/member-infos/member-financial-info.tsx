import MemberIncomeDisplay from './displays/member-income-display'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberProfileResource, TEntityId } from '@/server'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import MemberAssetsDisplay from './displays/member-assets-display'
import MemberExpensesDisplay from './displays/member-expenses-display'
import { Separator } from '../ui/separator'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfileResource
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
            <MemberIncomeDisplay incomes={data?.memberIncome} />
            <Separator />
            <MemberAssetsDisplay assets={data?.memberAssets} />
            <Separator />
            <MemberExpensesDisplay expenses={data?.memberExpenses} />
        </div>
    )
}

export default MemberFinancialInfo
