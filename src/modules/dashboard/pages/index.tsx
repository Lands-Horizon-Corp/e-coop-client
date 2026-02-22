import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { useGetHeartbeat } from '@/modules/heartbeat/heartbeat.service'
import {
    useGetMemberDashboardSummary,
    useGetPendingMemberProfiles,
} from '@/modules/member-profile'

import {
    BankIcon,
    PeopleGroupIcon,
    PulseIcon,
    RefreshIcon,
    UserIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'

import IncomeExpenseChart from '../components/income-expense-chart'
import KpiCard from '../components/kpi-cards'
import MemberTypePieChart from '../components/member-type-pie-chart'
import MembersGrowthChart from '../components/members-growth-chart'
import NewMember from '../components/new-member'

const Dashboard = () => {
    const { data, refetch } = useGetHeartbeat()

    const {
        currentAuth: {
            // user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const {
        data: getMemberDashboardSummary,
        isLoading: getMemberIsLoading,
        // isRefetching: isRefetchingMember,
        refetch: refetchMemberDashBoard,
    } = useGetMemberDashboardSummary({
        options: {},
    })
    const getNewMember = useGetPendingMemberProfiles({})

    useSubscribe(`user_organization.status.branch.₱{branch_id}`, refetch)

    // const totalMembers = getMemberDashboardSummary?.total_members ?? 0
    // const totalMale = getMemberDashboardSummary?.total_male_members ?? 0
    // const totalFemale = getMemberDashboardSummary?.total_female_members ?? 0
    // const totaNewMember = getNewMember.data?.length ?? 0

    // const malePercentage =
    //     totalMembers > 0 ? ((totalMale / totalMembers) * 100).toFixed(0) : 0

    // const femalePercentage =
    //     totalMembers > 0 ? ((totalFemale / totalMembers) * 100).toFixed(0) : 0

    const isLoading = getMemberIsLoading
    const isLoadingNew = getNewMember.isLoading

    const totalMembers = 1245
    const totalMale = 720
    const totalFemale = 525

    const malePercentage = ((totalMale / totalMembers) * 100).toFixed(1)
    const femalePercentage = ((totalFemale / totalMembers) * 100).toFixed(1)

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <PulseIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">
                            Organization Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time activity and member status
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="gap-1" variant="outline">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Online ({data?.online_users_count || 0})
                    </Badge>

                    <Button
                        onClick={() => {
                            refetch()
                            refetchMemberDashBoard()
                        }}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-4 gap-2 w-full">
                {/* LEFT SIDE */}
                <div className=" col-span-3 space-y-2">
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <KpiCard
                            description="Trending up this month"
                            icon={<UserIcon className="size-4 text-primary" />}
                            label="Total Revenue"
                            subDescription="Income as for to date"
                            trend={
                                <span className="text-emerald-500">+12.5%</span>
                            }
                            value="₱1,250.00"
                        />

                        <KpiCard
                            description="Down 20% this period"
                            icon={
                                <PeopleGroupIcon className="size-4 text-primary" />
                            }
                            label="New Members"
                            subDescription="Number of members achieves"
                            trend={<span className="text-red-500">20%</span>}
                            value="1,234"
                        />

                        <KpiCard
                            description="Strong user retention"
                            icon={<UserIcon className="size-4 text-primary" />}
                            label="Active Accounts"
                            subDescription="Engagement exceed targets"
                            trend={
                                <span className="text-emerald-500">+12.5%</span>
                            }
                            value="45,678"
                        />

                        <KpiCard
                            description="Active registered members"
                            icon={
                                <PeopleGroupIcon className="size-4 text-primary" />
                            }
                            label="Total Members"
                            subDescription="Gender distribution overview"
                            trend={
                                <span className="text-emerald-500">+3.2%</span>
                            }
                            value={
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold">
                                        {totalMembers.toLocaleString()}
                                    </span>

                                    <span className="text-xs tracking-wide text-muted-foreground">
                                        Male {malePercentage}% • Female{' '}
                                        {femalePercentage}%
                                    </span>
                                </div>
                            }
                        />
                    </section>
                    {/* Charts Row */}
                    <section className="flex flex-col lg:flex-row gap-2 w-full">
                        <div className="w-full lg:w-1/3">
                            <MemberTypePieChart
                                data={getMemberDashboardSummary}
                                isLoading={isLoading}
                            />
                        </div>

                        <div className="w-full lg:w-3/4">
                            <IncomeExpenseChart />
                        </div>
                    </section>

                    {/* Full Width Chart */}
                    <section className="flex w-full gap-x-2">
                        <div className="w-3/4">
                            <MembersGrowthChart />
                        </div>
                        <KpiCard
                            className="w-full lg:w-1/4"
                            description="Loan portfolio increased"
                            icon={<BankIcon className="size-4 text-primary" />}
                            label="Total Loans"
                            subDescription="Compared to last month"
                            trend={
                                <span className="text-emerald-500">+8.2%</span>
                            }
                            value="₱3,450,000"
                        />
                    </section>
                </div>

                {/* RIGHT SIDE (Sidebar) */}
                <div className="">
                    <NewMember
                        isLoading={isLoadingNew}
                        members={getNewMember.data}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
