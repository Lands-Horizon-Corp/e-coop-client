import { useState } from 'react'

import {
    PlusIcon,
    TrashIcon,
    MoneyIcon,
    WoodSignsIcon,
    PencilFillIcon,
    CalendarDotsIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import EmptyListIndicator from '../empty-list-indicator'
import RawDescription from '@/components/raw-description'
import useConfirmModalStore from '@/store/confirm-modal-store'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { MemberExpenseCreateUpdateFormModal } from './member-expense-create-update-form'
import { useDeleteMemberProfileExpense } from '@/hooks/api-hooks/member/use-member-profile-settings'

import { formatNumber, toReadableDate } from '@/utils'

import { IMemberExpense, IMemberProfile } from '@/types'

const MemberExpenseCard = ({ expense }: { expense: IMemberExpense }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteExpense, isPending: isDeleting } =
        useDeleteMemberProfileExpense()

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberExpenseCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Expense"
                description="Modify / Update this expense information."
                formProps={{
                    expenseId: expense.id,
                    memberProfileId: expense.member_profile_id,
                    defaultValues: expense,
                }}
            />
            <div className="flex justify-between">
                <p className="font-bold">{expense.name}</p>
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
                                title: 'Delete Expense',
                                description:
                                    'Are you sure to delete this expense?',
                                onConfirm: () =>
                                    deleteExpense({
                                        memberProfileId:
                                            expense.member_profile_id,
                                        expenseId: expense.id,
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
            <div className="space-y-2 text-sm">
                <div>
                    <MoneyIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Amount:{' '}
                    </span>
                    {formatNumber(expense.amount)}
                </div>
                <div>
                    <CalendarDotsIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Date:
                    </span>{' '}
                    {expense.created_at
                        ? toReadableDate(expense.created_at)
                        : 'no date'}
                </div>
                <div className="!mt-5 space-y-2">
                    <p className="text-muted-foreground/70">Description</p>
                    {expense?.description ? (
                        <RawDescription
                            content={expense.description ?? 'no description'}
                        />
                    ) : (
                        <p className="text-sm italic text-muted-foreground/60">
                            No Description{' '}
                            <WoodSignsIcon className="ml-1 inline" />
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberExpenses = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberExpenseCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Expense"
                description="Add new expense information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        branch_id: memberProfile.branch_id,
                        member_profile_id: memberProfile.id,
                    },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Expenses</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Expense <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {memberProfile.member_expenses?.map((expense) => (
                    <MemberExpenseCard key={expense.id} expense={expense} />
                ))}
                {(!memberProfile.member_expenses ||
                    memberProfile.member_expenses.length === 0) && (
                    <EmptyListIndicator message="No expenses yet" />
                )}
            </div>
        </div>
    )
}

export default MemberExpenses
