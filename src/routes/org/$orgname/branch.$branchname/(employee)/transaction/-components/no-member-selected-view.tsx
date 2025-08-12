import { Button } from '@/components/ui/button'

type NoMemberSelectedViewProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabledSelectTrigger?: boolean
    isDisplay?: boolean
}

const NoMemberSelectedView = ({
    onClick,
    disabledSelectTrigger,
    isDisplay,
}: NoMemberSelectedViewProps) => {
    if (!isDisplay) return null

    return (
        <div className="relative flex h-64 min-w-64 flex-col items-center justify-center gap-y-2 rounded-xl bg-sidebar/50 before:absolute before:left-1/2 before:top-[40%] before:z-0 before:size-44 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-secondary/20 before:content-[''] after:absolute after:left-1/2 after:top-[40%] after:z-0 after:h-32 after:w-64 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-xl after:bg-secondary/60 after:content-['']">
            <div className="absolute left-1/2 top-[40%] z-10 flex h-24 w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-secondary p-5">
                <div className="size-16 rounded-xl bg-sidebar" />
                <div className="flex grow flex-col space-y-2 px-4">
                    <div className="h-[15px] w-full rounded-full bg-sidebar" />
                    <div className="h-[15px] w-3/4 rounded-full bg-sidebar" />
                    <div className="h-[15px] w-1/2 rounded-full bg-sidebar" />
                </div>
            </div>
            <div className="absolute bottom-5 flex flex-col items-center justify-center gap-y-2">
                <p className="z-10 text-center text-xs text-accent-foreground/70">
                    Select a member first to add transaction
                </p>{' '}
                <Button
                    disabled={disabledSelectTrigger}
                    size={'sm'}
                    variant={'secondary'}
                    onClick={onClick}
                    className=""
                >
                    Select Member{' '}
                    <span className="text-lg ml-2 translate-y-[2px]">↵</span>
                </Button>
            </div>
        </div>
    )
}
export default NoMemberSelectedView
