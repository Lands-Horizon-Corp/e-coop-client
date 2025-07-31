import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

import { useHeartbeat } from '@/hooks/api-hooks/use-heartbeat'
import { useSubscribe } from '@/hooks/use-pubsub'

const Heartbeat = () => {
    const { data, isLoading, error, refetch } = useHeartbeat()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    useSubscribe(`user_organization.status.branch.${branch_id}`, refetch)

    if (isLoading) return <div>Loading heartbeat...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Heartbeat Status</h1>
            <button onClick={() => refetch()}>Refresh</button>

            {data && (
                <div>
                    <p>Online Users: {data.online_users_count}</p>
                    <p>Online Members: {data.online_members}</p>
                    <p>Total Members: {data.total_members}</p>
                    <p>Online Employees: {data.online_employees}</p>
                    <p>Total Employees: {data.total_employees}</p>
                    <p>Active Employees: {data.total_active_employees}</p>
                </div>
            )}
        </div>
    )
}

export default Heartbeat
