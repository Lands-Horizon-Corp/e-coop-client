import MemberLoanTableSummary from '@/modules/loan-transaction/components/member-loan-table-summary'

import { TEntityId } from '@/types'

type Props = {
    memberProfileId: TEntityId
}

const MemberLoanSummary = ({ memberProfileId }: Props) => {
    return (
        <div>
            <MemberLoanTableSummary
                className="h-[500px]"
                memberProfileId={memberProfileId}
            />
        </div>
    )
}

export default MemberLoanSummary
