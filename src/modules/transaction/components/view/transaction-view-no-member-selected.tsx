import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

type NoMemberSelectedViewProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabledSelectTrigger?: boolean
    isDisplay?: boolean
}

const TransactionViewNoMemberSelected = ({
    onClick,
    disabledSelectTrigger,
    isDisplay = true,
}: NoMemberSelectedViewProps) => {
    if (!isDisplay) return null

    return (
        <div className="relative flex h-full min-h-[230px] w-full max-w-full flex-col items-center justify-center gap-y-2 rounded-xl bg-muted-foreground/10 dark:bg-background before:absolute before:left-1/2 before:top-[40%] before:z-0 before:h-28 before:w-28 sm:before:size-36 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/20 dark:before:bg-secondary/20 before:content-[''] after:absolute after:left-1/2 after:top-[40%] after:z-0 after:h-24 after:w-48 sm:after:h-32 sm:after:w-64 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-xl after:bg-muted-foreground/30 dark:after:bg-secondary/60 after:content-['']">
            {/* Skeleton Card */}
            <div className="absolute left-1/2 top-[40%] z-10 flex h-20 w-56 sm:h-24 sm:w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-muted-foreground/50 p-3 sm:p-5 dark:bg-secondary">
                <div className="h-12 w-12 sm:size-16 rounded-xl bg-sidebar" />
                <div className="flex grow flex-col space-y-2 px-3 sm:px-4">
                    <div className="h-[12px] sm:h-[15px] w-full rounded-full bg-sidebar" />
                    <div className="h-[12px] sm:h-[15px] w-3/4 rounded-full bg-sidebar" />
                    <div className="h-[12px] sm:h-[15px] w-1/2 rounded-full bg-sidebar" />
                </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-4 flex flex-col items-center justify-center gap-y-2">
                <p className="z-10 text-center text-xs sm:text-sm text-accent-foreground/70">
                    {/* Select a member first to add transaction */}
                </p>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            disabled={disabledSelectTrigger}
                            size="sm"
                            onClick={onClick}
                            className="px-3 sm:px-4"
                        >
                            Select Member
                            <span className="ml-1 sm:ml-2 text-base sm:text-lg translate-y-[2px]">
                                ↵
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        "↵" press enter to open member picker
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
export default TransactionViewNoMemberSelected
