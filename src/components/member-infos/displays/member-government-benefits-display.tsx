import DOMPurify from 'dompurify'

import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/components/ui/accordion'
import ImageDisplay from '@/components/image-display'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberGovernmentBenefitsResource } from '@/types'
import { toReadableDate } from '@/utils'
interface IGovernmentCardDisplay
    extends IClassProps,
        IMemberGovernmentBenefitsResource {}

export const GovernmentCardDisplay = ({
    name,
    value,
    country,
    className,
    backMedia,
    createdAt,
    frontMedia,
    description,
}: IGovernmentCardDisplay) => {
    return (
        <div
            className={cn(
                'space-y-4 rounded-xl border bg-popover/40 p-4',
                className
            )}
        >
            <div className="relative flex gap-x-2 rounded-xl">
                <div className="space-y-4">
                    <ImageDisplay
                        className="h-36 w-64 rounded-lg"
                        src={frontMedia?.downloadURL}
                    />
                    <p className="text-xs text-muted-foreground/70">
                        ID Front Photo
                    </p>
                </div>
                <div className="space-y-2">
                    <ImageDisplay
                        className="h-36 w-64 rounded-lg"
                        src={backMedia?.downloadURL}
                    />
                    <p className="text-xs text-muted-foreground/70">
                        ID Back Photo
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-5">
                <div className="space-y-2">
                    <p>{name}</p>
                    <p className="text-xs text-muted-foreground/70">Name</p>
                </div>
                <div className="space-y-2">
                    <p>{country}</p>
                    <p className="text-xs text-muted-foreground/70">Country</p>
                </div>
                <div className="col-span-2 space-y-2">
                    <p>{value}</p>
                    <p className="text-xs text-muted-foreground/70">Value</p>
                </div>
                <div className="space-y-2">
                    <p>
                        {toReadableDate(createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Updated At
                    </p>
                </div>
            </div>
            <Accordion collapsible type="single" className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="text-sm font-normal">
                        Show Description...
                    </AccordionTrigger>
                    <AccordionContent className="w-full !max-w-full rounded-xl bg-popover p-4 text-sm text-foreground/70 prose-h1:prose dark:prose-invert prose-p:text-foreground/80 prose-strong:text-foreground sm:text-sm">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    description ?? '<i>No Description</i>'
                                ),
                            }}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

interface Props extends IClassProps {
    governmentBenefits?: IMemberGovernmentBenefitsResource[]
}

const MemberGovernmentBenefitsDisplay = ({
    governmentBenefits,
    className,
}: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            {(!governmentBenefits || governmentBenefits.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    no government benefits
                </p>
            )}
            {governmentBenefits &&
                governmentBenefits.map((governmentBenefit) => (
                    <GovernmentCardDisplay
                        key={governmentBenefit.id}
                        {...governmentBenefit}
                    />
                ))}
        </div>
    )
}

export default MemberGovernmentBenefitsDisplay
