import { ReactNode, forwardRef } from 'react'

import { cn } from '@/helpers'
import { IMemberAsset } from '@/modules/member-asset'
import { IMemberExpense } from '@/modules/member-expense'
import { IMemberIncome } from '@/modules/member-income'
import {
    Banknote,
    Building2,
    Calendar,
    DollarSign,
    Receipt,
    TrendingUp,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { TEntityId } from '@/types'

import { useGetMemberProfileById } from '../../member-profile.service'
import { IMemberProfile } from '../../member-profile.types'

interface Props {
    className?: string
    profileId: TEntityId
    defaultData?: IMemberProfile
}

interface SectionCardProps {
    icon: ReactNode
    title: string
    subtitle: string
    children: ReactNode
}

const SectionCard = ({ icon, title, subtitle, children }: SectionCardProps) => {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    {icon}
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    )
}

const InfoItem = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType
    label: string
    value: ReactNode
}) => {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                    {label}
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                    {value}
                </p>
            </div>
        </div>
    )
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })
}

const EmptyState = ({
    icon: Icon,
    message,
}: {
    icon: React.ElementType
    message: string
}) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
    </div>
)

const IncomeCard = ({ income }: { income: IMemberIncome }) => {
    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {income.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Income Source
                        </p>
                    </div>
                </div>
                <Badge
                    className="border-green-500/30 text-green-400"
                    variant="outline"
                >
                    {formatCurrency(income.amount)}
                </Badge>
            </div>

            <div className="p-5 space-y-5">
                {income.media?.download_url && (
                    <div className="group relative">
                        <div className="aspect-[3/1] rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted overflow-hidden transition-all duration-300 group-hover:border-primary/30">
                            <img
                                alt={income.name}
                                className="h-full w-full object-cover rounded-md"
                                src={income.media.download_url}
                            />
                        </div>
                        <p className="mt-2 text-xs font-medium text-muted-foreground text-center">
                            Supporting Document
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem
                        icon={DollarSign}
                        label="Amount"
                        value={formatCurrency(income.amount)}
                    />
                    {income.release_date && (
                        <InfoItem
                            icon={Calendar}
                            label="Release Date"
                            value={formatDate(income.release_date)}
                        />
                    )}
                    <InfoItem
                        icon={Calendar}
                        label="Last Updated"
                        value={formatDate(income.updated_at)}
                    />
                </div>
            </div>
        </div>
    )
}

const AssetCard = ({ asset }: { asset: IMemberAsset }) => {
    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {asset.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">Asset</p>
                    </div>
                </div>
                <Badge
                    className="border-blue-500/30 text-blue-400"
                    variant="outline"
                >
                    {formatCurrency(asset.cost)}
                </Badge>
            </div>

            <div className="p-5 space-y-5">
                {asset.media?.download_url && (
                    <div className="group relative">
                        <div className="aspect-[3/1] rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted overflow-hidden transition-all duration-300 group-hover:border-primary/30">
                            <img
                                alt={asset.name}
                                className="h-full w-full object-cover rounded-md"
                                src={asset.media.download_url}
                            />
                        </div>
                        <p className="mt-2 text-xs font-medium text-muted-foreground text-center">
                            Asset Image
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem
                        icon={DollarSign}
                        label="Cost"
                        value={formatCurrency(asset.cost)}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Entry Date"
                        value={formatDate(asset.entry_date)}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Last Updated"
                        value={formatDate(asset.updated_at)}
                    />
                </div>

                {asset.description && (
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                            Show Description
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 animate-fade-in">
                            <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {asset.description}
                                </p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </div>
    )
}

const ExpenseCard = ({ expense }: { expense: IMemberExpense }) => {
    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                        <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            {expense.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">Expense</p>
                    </div>
                </div>
                <Badge
                    className="border-red-500/30 text-red-400"
                    variant="outline"
                >
                    {formatCurrency(expense.amount)}
                </Badge>
            </div>

            <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem
                        icon={DollarSign}
                        label="Amount"
                        value={formatCurrency(expense.amount)}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Last Updated"
                        value={formatDate(expense.updated_at)}
                    />
                </div>

                {expense.description && (
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                            Show Description
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 animate-fade-in">
                            <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {expense.description}
                                </p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </div>
    )
}

const MemberFinancials = forwardRef<HTMLDivElement, Props>(
    ({ className, profileId, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        const incomes = data?.member_incomes || []
        const assets = data?.member_assets || []
        const expenses = data?.member_expenses || []

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                    className
                )}
                ref={ref}
            >
                <SectionCard
                    icon={<Banknote className="h-5 w-5" />}
                    subtitle="Different source of income of this member"
                    title="Income"
                >
                    {incomes.length > 0 ? (
                        <div className="space-y-4 grid-cols-2 grid gap-x-4">
                            {incomes.map((income, index) => (
                                <div
                                    className="animate-fade-in"
                                    key={income.id}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <IncomeCard income={income} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Banknote}
                            message="No income details found"
                        />
                    )}
                </SectionCard>

                <SectionCard
                    icon={<Building2 className="h-5 w-5" />}
                    subtitle="List of member assets"
                    title="Assets"
                >
                    {assets.length > 0 ? (
                        <div className="space-y-4 grid-cols-2 grid gap-x-4">
                            {assets.map((asset, index) => (
                                <div
                                    className="animate-fade-in"
                                    key={asset.id}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <AssetCard asset={asset} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Building2}
                            message="No assets details"
                        />
                    )}
                </SectionCard>

                <SectionCard
                    icon={<Receipt className="h-5 w-5" />}
                    subtitle="Different expenses"
                    title="Expenses"
                >
                    {expenses.length > 0 ? (
                        <div className="space-y-4 grid-cols-3 grid gap-x-4">
                            {expenses.map((expense, index) => (
                                <div
                                    className="animate-fade-in"
                                    key={expense.id}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <ExpenseCard expense={expense} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Receipt}
                            message="No income details found"
                        />
                    )}
                </SectionCard>
            </div>
        )
    }
)

MemberFinancials.displayName = 'MemberFinancials'

export default MemberFinancials
