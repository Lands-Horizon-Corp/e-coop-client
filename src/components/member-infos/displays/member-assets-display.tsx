import { cn } from '@/lib'
import { toReadableDate } from '@/utils'

import { BoxesStackedIcon } from '@/components/icons'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

import { IClassProps } from '@/types'
import { IMemberAsset } from '@/types'

import RawDescription from '../../raw-description'
import SectionTitle from '../section-title'

interface Props extends IClassProps {
    assets?: IMemberAsset[]
}

const MemberAssetsDisplay = ({ assets, className }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                title="Assets"
                Icon={BoxesStackedIcon}
                subTitle="List of member assets"
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
                            key={asset.id}
                            className="grid grid-cols-4 rounded-xl border bg-popover/60 p-4"
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
                                type="single"
                                collapsible
                                className="col-span-4 w-full"
                            >
                                <AccordionItem
                                    value="item-1"
                                    className="border-b-0"
                                >
                                    <AccordionTrigger className="text-sm text-muted-foreground/60">
                                        Description..
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 rounded-xl bg-popover p-4">
                                        <RawDescription
                                            content={asset.description}
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
