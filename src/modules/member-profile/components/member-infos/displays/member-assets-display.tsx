import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { IMemberAsset } from '@/modules/member-asset'

import { BoxesStackedIcon } from '@/components/icons'
import TextRenderer from '@/components/text-renderer'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

import { IClassProps } from '@/types'

import SectionTitle from '../section-title'

interface Props extends IClassProps {
    assets?: IMemberAsset[]
}

const MemberAssetsDisplay = ({ assets, className }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                Icon={BoxesStackedIcon}
                subTitle="List of member assets"
                title="Assets"
            />
            {(!assets || assets.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No assets details
                </p>
            )}
            {assets &&
                assets.map((asset) => {
                    return (
                        <div
                            className="grid grid-cols-4 rounded-xl border bg-popover/60 p-4"
                            key={asset.id}
                        >
                            <div className="space-y-2">
                                <p>{asset.name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {asset.created_at
                                        ? toReadableDate(asset.entry_date)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Entry Date
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {asset.created_at
                                        ? toReadableDate(asset.created_at)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Updated At
                                </p>
                            </div>

                            <Accordion
                                className="col-span-4 w-full"
                                collapsible
                                type="single"
                            >
                                <AccordionItem
                                    className="border-b-0"
                                    value="item-1"
                                >
                                    <AccordionTrigger className="text-sm text-muted-foreground/60">
                                        Description..
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 rounded-xl bg-popover p-4">
                                        <TextRenderer
                                            content={asset.description || ''}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )
                })}
        </div>
    )
}

export default MemberAssetsDisplay
