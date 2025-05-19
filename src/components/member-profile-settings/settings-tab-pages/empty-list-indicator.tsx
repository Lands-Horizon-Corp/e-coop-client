import { GhostIcon } from '@/components/icons'

type Props = { message?: string }

const EmptyListIndicator = ({ message }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center gap-y-2 py-8">
            <GhostIcon className="size-6 text-muted-foreground" />
            <span className="text-sm italic text-muted-foreground/30">
                {message ?? ' no record found yet '}
            </span>
        </div>
    )
}

export default EmptyListIndicator
