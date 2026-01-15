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
        <div className="relative flex h-full w-full max-w-full flex-col items-center justify-center gap-y-1 rounded-xl bg-muted-foreground/10 dark:bg-background before:absolute before:left-1/2 before:top-[40%] before:z-0 before:size-[100px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/20 dark:before:bg-secondary/20 before:content-[''] after:absolute after:left-1/2 after:top-[40%] after:z-0 after:h-20 after:w-48 sm:after:w-64 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-xl after:bg-muted-foreground/30 dark:after:bg-secondary/60 after:content-['']">
            {/* Skeleton Card */}
            <div className="absolute left-1/2 top-[40%] z-10 flex w-56 h-fit sm:w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-muted-foreground/50 p-2 dark:bg-secondary">
                <div className="size-12 rounded-xl bg-sidebar" />
                <div className="flex grow flex-col justify-center space-y-2 px-2 ">
                    <div className="h-[5px] w-full rounded-full bg-sidebar" />
                    <div className="h-[5px] w-3/4 rounded-full bg-sidebar" />
                    <div className="h-[5px]  w-1/2 rounded-full bg-sidebar" />
                </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-8 flex flex-col items-center justify-center gap-y-2">
                <p className="z-10 text-center text-xs sm:text-sm /70">
                    {/* Select a member first to add transaction */}
                </p>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="px-3 sm:px-4 z-10"
                            disabled={disabledSelectTrigger}
                            onClick={onClick}
                            size="sm"
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
