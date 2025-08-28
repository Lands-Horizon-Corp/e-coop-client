import { cn } from '@/helpers'
import { IconType } from 'react-icons/lib'

interface Props {
    Icon?: IconType
    title: string
    subTitle?: string
}

const SectionTitle = ({ Icon, title, subTitle }: Props) => {
    return (
        <div
            className={cn(
                'relative flex items-start gap-x-2',
                !subTitle && 'items-center'
            )}
        >
            {Icon && (
                <>
                    <Icon className="relative z-10 inline size-8 text-foreground" />
                    <Icon className="absolute z-0 size-8 text-green-400/70 blur-md" />
                </>
            )}
            <div className="space-y-2">
                <p>{title}</p>
                {subTitle && (
                    <p className="!mt-0 text-sm text-muted-foreground/60">
                        {subTitle}
                    </p>
                )}
            </div>
        </div>
    )
}

export default SectionTitle
