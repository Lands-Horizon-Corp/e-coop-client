import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/components/ui/accordion'
import SectionTitle from '../section-title'
import RawDescription from './raw-description'
import { TelephoneIcon } from '@/components/icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { IMemberContactNumberReferencesResource } from '@/server'

interface Props extends IClassProps {
    contactNumbers?: IMemberContactNumberReferencesResource[]
}

const ContactNumbersDisplay = ({ className, contactNumbers }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <p></p>
            <p className="!mt-0 text-sm text-muted-foreground/60"></p>
            <SectionTitle
                title="Contact Number References"
                Icon={TelephoneIcon}
                subTitle="Other contact number references"
            />
            {(!contactNumbers || contactNumbers.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No other contact numbers referenced
                </p>
            )}
            {contactNumbers && (
                <div className="space-y-4">
                    {contactNumbers?.map((contactNumberReference) => (
                        <div
                            className="rounded-xl border p-4"
                            key={contactNumberReference.id}
                        >
                            <div className="grid grid-cols-4 gap-x-4 gap-y-1">
                                <div className="space-y-2">
                                    <p>{contactNumberReference.name}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Name
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        {contactNumberReference.contactNumber}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Contact Number
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        {toReadableDate(
                                            contactNumberReference.createdAt
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Date Added
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p>
                                        {contactNumberReference.updatedAt
                                            ? toReadableDate(
                                                  contactNumberReference.updatedAt
                                              )
                                            : '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Date Edited
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
                                                content={
                                                    contactNumberReference.description
                                                }
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContactNumbersDisplay
