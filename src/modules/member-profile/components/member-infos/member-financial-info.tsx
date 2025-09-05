import { cn } from '@/helpers'

import { Separator } from '@/components/ui/separator'

import { IClassProps, TEntityId } from '@/types'

import { IMemberProfile } from '../..'
import { useGetMemberProfileById } from '../../member-profile.service'
import MemberAssetsDisplay from './displays/member-assets-display'
import MemberExpensesDisplay from './displays/member-expenses-display'
import MemberIncomeDisplay from './displays/member-income-display'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberFinancialInfo = ({ profileId, className, defaultData }: Props) => {
    const { data } = useGetMemberProfileById({
        id: profileId,
        options: { initialData: defaultData },
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
