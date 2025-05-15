import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { WarningFillIcon } from '@/components/icons'
import RawDescription from '../../raw-description'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { IMemberCloseRemark } from '@/types'
import { abbreviateUUID } from '@/utils/formatting-utils'

const MemberCloseAccountBanner = ({
    className,
    closeRemarks,
    showRemarksList = false,
}: IClassProps & {
    closeRemarks?: Partial<IMemberCloseRemark>[]
    showRemarksList?: boolean
}) => {
    return (
        <div className={cn('pointer-events-auto space-y-0.5', className)}>
            <div className="flex items-center gap-x-2 rounded-xl border border-rose-400 bg-rose-400/30 p-2">
                <WarningFillIcon className="size-8 text-rose-400" />
                <div className="space-y-1">
                    <p>Closed Account</p>
                    <p className="text-sm text-muted-foreground/80">
                        This account has been closed. You are not allowed to
                        update this account or perform any transactions in the
                        cooperative
                    </p>
                </div>
            </div>
            {showRemarksList && closeRemarks && closeRemarks.length > 0 && (
                <Accordion
                    type="single"
                    collapsible
                    className="col-span-4 w-full"
                >
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-sm text-muted-foreground/60">
                            Show Account Closure Reasons
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 rounded-xl">
                            {closeRemarks.length === 0 && (
                                <p className="text-center text-xs text-muted-foreground/70">
                                    No close remarks closure
                                </p>
                            )}
                            <div className="space-y-2">
                                {closeRemarks.map((closeRemark) => (
                                    <div
                                        key={closeRemark?.id}
                                        className="space-y-2 rounded-xl border border-rose-300/40 bg-popover p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-foreground">
                                                ID:{' '}
                                                <span className="text-xs text-muted-foreground/60">
                                                    {closeRemark?.id
                                                        ? abbreviateUUID(
                                                              closeRemark?.id
                                                          )
                                                        : '-'}
                                                </span>
                                            </p>

                                            <p className="text-sm text-foreground">
                                                <span className="text-xs text-muted-foreground/60">
                                                    {closeRemark?.created_at
                                                        ? toReadableDate(
                                                              closeRemark?.created_at,
                                                              "MMM dd, yyyy 'at' hh:mm a"
                                                          )
                                                        : '-'}
                                                </span>
                                            </p>
                                        </div>
                                        <p className="text-sm">Description :</p>
                                        <RawDescription
                                            className="rounded-xl bg-secondary p-4"
                                            content={
                                                closeRemark?.description ?? '-'
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}

export default MemberCloseAccountBanner
