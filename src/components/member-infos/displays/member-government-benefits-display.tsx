import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { sanitizeHtml } from '@/utils/sanitizer'

import ImageDisplay from '@/components/image-display'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IClassProps } from '@/types'
import { IMemberGovernmentBenefit } from '@/types'

interface IGovernmentCardDisplay
    extends IClassProps,
        IMemberGovernmentBenefit {}

export const GovernmentCardDisplay = ({
    name,
    value,
    country_code,
    className,
    back_media,
    created_at,
    front_media,
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
                    <PreviewMediaWrapper media={front_media}>
                        <ImageDisplay
                            className="h-36 w-64 rounded-lg"
                            src={front_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <p className="text-xs text-muted-foreground/70">
                        ID Front Photo
                    </p>
                </div>
                <div className="space-y-2">
                    <PreviewMediaWrapper media={back_media}>
                        <ImageDisplay
                            className="h-36 w-64 rounded-lg"
                            src={back_media?.download_url}
                        />
                    </PreviewMediaWrapper>
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
                    <p>{country_code}</p>
                    <p className="text-xs text-muted-foreground/70">Country</p>
                </div>
                <div className="col-span-2 space-y-2">
                    <p>{value}</p>
                    <p className="text-xs text-muted-foreground/70">Value</p>
                </div>
                <div className="space-y-2">
                    <p>
                        {toReadableDate(
                            created_at,
                            "MMM dd, yyyy 'at' hh:mm a"
                        )}
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
                                __html: sanitizeHtml(
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
    governmentBenefits?: IMemberGovernmentBenefit[]
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
