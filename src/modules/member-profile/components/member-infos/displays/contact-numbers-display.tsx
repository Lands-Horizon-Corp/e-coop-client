import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { IMemberContactReference } from '@/modules/member-contact-reference'

import { TelephoneIcon } from '@/components/icons'
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
    contactNumbers?: IMemberContactReference[]
}

const ContactNumbersDisplay = ({ className, contactNumbers }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <p></p>
            <p className="!mt-0 text-sm text-muted-foreground/60"></p>
            <SectionTitle
                Icon={TelephoneIcon}
                subTitle="Other contact number references"
                title="Contact Number References"
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
                                <div className="space-y-2 text-sm">
                                    <p>{contactNumberReference.name}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Name
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        {contactNumberReference.contact_number}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Contact Number
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        {toReadableDate(
                                            contactNumberReference.created_at
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Date Added
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        {contactNumberReference.created_at
                                            ? toReadableDate(
                                                  contactNumberReference.created_at
                                              )
                                            : '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Date Edited
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
