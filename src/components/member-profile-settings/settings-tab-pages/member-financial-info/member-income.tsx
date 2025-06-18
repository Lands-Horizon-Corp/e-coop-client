import { useState } from 'react'

import {
    PlusIcon,
    TrashIcon,
    MoneyIcon,
    PencilFillIcon,
    CalendarDotsIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MemberIncomeCreateUpdateFormModal } from './member-income-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberProfileIncome } from '@/hooks/api-hooks/member/use-member-profile-settings'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import EmptyListIndicator from '../empty-list-indicator'

import { IMemberIncome, IMemberProfile } from '@/types'
import { formatNumber, toReadableDate } from '@/utils'
import ImageDisplay from '@/components/image-display'

const MemberIncomeCard = ({ income }: { income: IMemberIncome }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteIncome, isPending: isDeleting } =
        useDeleteMemberProfileIncome()

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberIncomeCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Income"
                description="Modify / Update this income information."
                formProps={{
                    memberProfileId: income.member_profile_id,
                    defaultValues: income,
                }}
            />
            <div className="flex justify-between">
                <p className="font-bold">{income.name}</p>
                <div className="flex items-center justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        disabled={isDeleting}
                        onClick={() => setEdit(true)}
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Income',
                                description:
                                    'Are you sure to delete this income?',
                                onConfirm: () =>
                                    deleteIncome({
                                        memberProfileId:
                                            income.member_profile_id,
                                        incomeId: income.id,
                                    }),
                            })
                        }
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
            <Separator className="!my-2" />
            <ImageDisplay
                className="mb-4 h-[150px] w-full rounded-lg"
                src={income.media?.download_url}
            />
            <div className="space-y-2 text-sm">
                <div>
                    <MoneyIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Amount:{' '}
                    </span>
                    {formatNumber(income.amount)}
                </div>
                <div>
                    <CalendarDotsIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Release Date:
                    </span>{' '}
                    {income.release_date
                        ? toReadableDate(income.release_date)
                        : 'no release date'}
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberIncome = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberIncomeCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Income"
                description="Add new income information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        branch_id: memberProfile.branch_id,
                        member_profile_id: memberProfile.id,
                    },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Member Income</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Income <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {memberProfile.member_income?.map((income) => (
                    <MemberIncomeCard key={income.id} income={income} />
                ))}
                {(!memberProfile.member_income ||
                    memberProfile.member_income.length === 0) && (
                    <EmptyListIndicator
                        message="No income yet"
                        className="col-span-3"
                    />
                )}
            </div>
        </div>
    )
}

export default MemberIncome
