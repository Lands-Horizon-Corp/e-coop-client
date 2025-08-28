import { cn } from '@/helpers'

import { Separator } from '@/components/ui/separator'

import { IClassProps, TEntityId } from '@/types'

import { IMemberProfile, useGetById } from '../..'
import MemberAssetsDisplay from './displays/member-assets-display'
import MemberIncomeDisplay from './displays/member-income-display'

interface Props extends IClassProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberFinancialInfo = ({ profileId, className, defaultData }: Props) => {
    const { data } = useGetById({
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
        </div>
    )
}

export default MemberFinancialInfo
