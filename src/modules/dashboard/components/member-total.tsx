import { HeartbeatResponse } from '@/modules/heartbeat/heartbeat.types'
import { UserIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

interface MemberTotalProps {
    memberData?: HeartbeatResponse
}

const MemberTotal = ({ memberData }: MemberTotalProps) => {
    return (
        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <UserIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            Total Members
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {memberData?.total_members.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            +
                            {memberData?.online_members &&
                                (
                                    (memberData?.online_members /
                                        memberData?.total_members) *
                                    100
                                ).toFixed(0)}
                            % online now
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MemberTotal
