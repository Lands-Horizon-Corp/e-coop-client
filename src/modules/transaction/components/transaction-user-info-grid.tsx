import { cn } from '@/helpers'

interface UserInfoItemProps {
    label: string
    value: string | number | React.ReactNode
}

export const TransactionUserInfoItem = ({
    label,
    value,
}: UserInfoItemProps) => (
    <div className="space-y-1">
        <p className="text-[11px] dark:text-muted-foreground  text-muted-foreground">
            {label}
        </p>
        <p className="font-semibold dark:text-gray-200 text-muted-foreground">
            {value}
        </p>
    </div>
)

interface UserInfoGridProps {
    data: { label: string; value: string | number | React.ReactNode }[]
    title?: string
    className?: string
}

export const TransactionUserInfoGrid = ({
    data,
    title,
    className,
}: UserInfoGridProps) => {
    return (
        <div
            className={cn(
                `dark:bg-secondary/30 bg-transparent p-4 dark:rounded-xl`,
                className
            )}
        >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {title}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
                {data.map((item, index) => (
                    <TransactionUserInfoItem
                        key={index}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>
        </div>
    )
}
export default TransactionUserInfoGrid
