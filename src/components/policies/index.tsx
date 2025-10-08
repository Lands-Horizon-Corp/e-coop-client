import { useState } from 'react'

import { ScrollArea } from '@radix-ui/react-scroll-area'

import { cn } from '@/helpers/tw-utils'
import { IOrganizationWithPolicies } from '@/modules/organization'

import { Checkbox } from '@/components/ui/checkbox'
import { Popover } from '@/components/ui/popover'

import TextEditor from '../text-editor'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

export type PolicyKey =
    | 'terms_and_conditions'
    | 'privacy_policy'
    | 'refund_policy'
    | 'user_agreement'
    | 'cookie_policy'

type PolicyItemsProps = {
    policyType: PolicyKey
    policyName: string
    policyContent: string
    onAcceptPolicy?: (policyValue: string) => void
    isChecked?: boolean
    isIncludeIAccept?: boolean
    viewCheckBox?: boolean
    className?: string
    organazationName?: string
}

type PoliciesProps = {
    organization: IOrganizationWithPolicies
    onPolicyChange?: (isChecked: boolean) => void
    isIncludeIAccept?: boolean
    className?: string
    classNamePolicyItem?: string
}
const OrganizationPolicies = ({
    organization,
    onPolicyChange,
    isIncludeIAccept = false,
    className,
    classNamePolicyItem,
}: PoliciesProps) => {
    const initialTermsState = [
        {
            name: 'Terms And Condition',
            value: 'terms_and_conditions',
            isChecked: false,
            content: organization.terms_and_conditions,
        },
        {
            name: 'Privacy Policy',
            value: 'privacy_policy',
            isChecked: false,
            content: organization.privacy_policy,
        },
        {
            name: 'Refund Policy',
            value: 'refund_policy',
            isChecked: false,
            content: organization.refund_policy,
        },
        {
            name: 'User Agreement',
            value: 'user_agreement',
            isChecked: false,
            content: organization.user_agreement,
        },
        {
            name: 'Cookie Policy',
            value: 'cookie_policy',
            isChecked: false,
            content: organization.cookie_policy,
        },
    ]

    const [termsAndConditions, setTermsAndConditions] =
        useState(initialTermsState)

    const handlePolicyAcceptance = (policyValue: string) => {
        setTermsAndConditions((prev) =>
            prev.map((term) =>
                term.value === policyValue
                    ? { ...term, isChecked: !term.isChecked }
                    : term
            )
        )
    }

    const allAccepted = termsAndConditions.every((term) => term.isChecked)

    onPolicyChange?.(allAccepted)

    return (
        <div
            className={cn(
                'w-full text-xs mt-5 flex flex-wrap justify-center lg:flex-row lg:space-y-0',
                className
            )}
        >
            <span className="mr-1">&copy; {new Date().getFullYear()}</span>
            <span className="font-semibold">{organization.name}</span>
            <span className="mr-1">. All rights reserved.</span>
            {termsAndConditions.map((term) => (
                <PolicyItems
                    className={classNamePolicyItem}
                    isChecked={term.isChecked}
                    isIncludeIAccept={isIncludeIAccept}
                    key={term.value}
                    onAcceptPolicy={handlePolicyAcceptance}
                    organazationName={organization.name}
                    policyContent={term.content}
                    policyName={term.name}
                    policyType={term.value as PolicyKey}
                />
            ))}
        </div>
    )
}

const PolicyItems = ({
    policyType,
    policyName,
    policyContent,
    onAcceptPolicy,
    isChecked,
    isIncludeIAccept = false,
    className,
    organazationName,
}: PolicyItemsProps) => {
    const [open, setOpen] = useState(false)

    const handleAcceptClick = () => {
        onAcceptPolicy?.(policyType)
        setOpen(false)
    }

    return (
        <Popover>
            <Dialog onOpenChange={setOpen} open={open}>
                <div className="flex items-center gap-x-2">
                    <DialogTrigger
                        className={cn(
                            'text-xs text-muted-foreground hover:underline mr-1',
                            className
                        )}
                        disabled={isChecked}
                    >
                        {policyName}
                    </DialogTrigger>
                    {isIncludeIAccept && (
                        <Checkbox
                            checked={isChecked}
                            className="h-4 w-4 mr-2"
                            onCheckedChange={() => {
                                onAcceptPolicy?.(policyType)
                            }}
                        />
                    )}
                </div>
                <DialogContent className="w-full max-w-[800px] border-0 dark:bg-transparent dark:backdrop-blur-lg p-4">
                    <span className="font-bold text-xl   mb-2 block">
                        {organazationName} {policyName}
                    </span>
                    <ScrollArea className="max-h-[30rem] text-sm overflow-y-auto pr-2">
                        <div className="p-1">
                            {policyContent ? (
                                <TextEditor
                                    content={policyContent}
                                    editable={false}
                                    showToolbar={false}
                                    textEditorClassName="!max-w-full !h-full !border-0 !rounded-none !w-full"
                                />
                            ) : (
                                <p>No content available for {policyName}.</p>
                            )}
                        </div>
                    </ScrollArea>
                    {isIncludeIAccept && (
                        <div className="w-full flex justify-end gap-x-2 mt-4">
                            <Button
                                onClick={() => setOpen(false)}
                                size={'sm'}
                                variant={'ghost'}
                            >
                                Close
                            </Button>
                            {!isChecked && (
                                <Button onClick={handleAcceptClick} size={'sm'}>
                                    Accept
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Popover>
    )
}

export default OrganizationPolicies
