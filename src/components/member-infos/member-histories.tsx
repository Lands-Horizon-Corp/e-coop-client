import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'

import Modal, { IModalProps } from '../modals/modal'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
    // BankIco,
    UserIcon,
    GendersIcon,
    UserCogIcon,
    UserGroupIcon,
    BriefCaseIcon,
} from '../icons'
import MemberCenterHistoryTable from '../tables/member/members-profile-table/member-histories/center-history'
import MemberGenderHistoryTable from '../tables/member/members-profile-table/member-histories/gender-history'
import MemberTypeHistoryTable from '../tables/member/members-profile-table/member-histories/member-type-history'
// import MemberMutualFundsHistoryTable from '../tables/member/members-profile-table/member-histories/mutualfunds-history'

import { cn } from '@/lib'
import { TEntityId, IClassProps } from '@/types'
import MemberGroupHistoryTable from '../tables/member/members-profile-table/member-histories/group-history'
import MemberClassificationHistoryTable from '../tables/member/members-profile-table/member-histories/classification-history'
import MemberOccupationHistoryTable from '../tables/member/members-profile-table/member-histories/occupation-history'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useQueryClient } from '@tanstack/react-query'

interface IMemberHistoriesProps {
    profileId: TEntityId
}

const historyTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (props: { profileId: TEntityId } & IClassProps) => ReactNode
}[] = [
    {
        value: 'member-occupation-history',
        title: 'Member Occupation',
        Icon: BriefCaseIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_occupation_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-occupation-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )

            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Occupation History of this member
                    </p>
                    <MemberOccupationHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    {
        value: 'member-center-history',
        title: 'Member Center',
        Icon: UserIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_center_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-center-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )

            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Center History of this member
                    </p>
                    <MemberCenterHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    {
        value: 'member-classification-history',
        title: 'Member Classification',
        Icon: UserCogIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_classification_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-classification-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )

            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Classification history of this member
                    </p>
                    <MemberClassificationHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    {
        value: 'member-type-history',
        title: 'Member Type',
        Icon: UserCogIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_type_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-type-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )

            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Type history of this member
                    </p>
                    <MemberTypeHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    {
        value: 'member-group-history',
        title: 'Member Group',
        Icon: UserGroupIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_group_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-group-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )
            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Group history of this member
                    </p>
                    <MemberGroupHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    {
        value: 'member-gender-history',
        title: 'Gender',
        Icon: GendersIcon,
        Component: ({ profileId }) => {
            const queryClient = useQueryClient()
            useSubscribe(
                `member_gender_history.create.member_profile.${profileId}`,
                () =>
                    queryClient.invalidateQueries({
                        queryKey: [
                            'member-gender-history',
                            'resource-query',
                            profileId,
                        ],
                    })
            )
            return (
                <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
                    <p className="text-sm">
                        Member Gender history for this member
                    </p>
                    <MemberGenderHistoryTable
                        className="grow"
                        profileId={profileId}
                    />
                </div>
            )
        },
    },
    // {
    //     value: 'member-mutualfunds-history',
    //     title: 'Mutual Funds',
    //     Icon: BankIcon,
    //     Component: ({ profileId }) => {
    //         const queryClient = useQueryClient()
    //         useSubscribe(
    //             `member_mutualfunds_history.create.member_profile.${profileId}`,
    //             () =>
    //                 queryClient.invalidateQueries({
    //                     queryKey: [
    //                         'member-mutualfunds-history',
    //                         'resource-query',
    //                         profileId,
    //                     ],
    //                 })
    //         )

    //         return (
    //             <div className="flex min-h-[90%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4">
    //                 <p className="text-sm">
    //                     Member Gender history for this member
    //                 </p>
    //                 <MemberMutualFundsHistoryTable
    //                     className="grow"
    //                     profileId={profileId}
    //                 />
    //             </div>
    //         )
    //     },
    // },
]

const MemberHistories = ({ profileId }: IMemberHistoriesProps) => {
    return (
        <div className="flex min-h-[80vh] w-full max-w-full flex-1 flex-col gap-y-4 p-4">
            <div className="space-y-2">
                <p className="text-xl">Member History</p>
                <p className="text-sm text-muted-foreground">
                    Member profile changes overtime, all of the past
                    informations for this member is recorded here for reference.
                </p>
            </div>
            <Tabs
                defaultValue="member-center-history"
                className="flex-1 flex-col"
            >
                <ScrollArea>
                    <TabsList className="mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                        {historyTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {historyTabs.map((tab) => (
                    <TabsContent value={tab.value} key={tab.value} asChild>
                        {tab.Component({ profileId })}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export const MemberHistoriesModal = ({
    title,
    className,
    memberHistoryProps,
    ...other
}: IModalProps & { memberHistoryProps: IMemberHistoriesProps }) => {
    return (
        <Modal
            title={title}
            titleClassName="hidden"
            descriptionClassName="hidden"
            closeButtonClassName="hidden"
            className={cn('flex max-w-7xl p-1', className)}
            {...other}
        >
            <MemberHistories {...memberHistoryProps} />
        </Modal>
    )
}

export default MemberHistories
