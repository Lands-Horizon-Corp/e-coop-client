import { forwardRef } from 'react'

import { cn } from '@/helpers'
import { IMemberJointAccount } from '@/modules/member-joint-account'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { useHotkeys } from 'react-hotkeys-hook'

import { EmptyIcon, UserPlusIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useInternalState } from '@/hooks/use-internal-state'

import JointAccountCardView from '../../view/transaction-joint-member-card'

interface JointMemberPickerProps extends IPickerBaseProps<IMemberJointAccount | null> {
    jointMembers: IMemberJointAccount[]
    allowShortcutCommand?: boolean
    allowClear?: boolean
    placeholder?: string
    triggerContentMode?: 'icon' | 'full'
    triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    shortcutKeyTrigger?: string
}

const JointMemberPicker = forwardRef<HTMLButtonElement, JointMemberPickerProps>(
    (
        {
            value,
            jointMembers,
            disabled,
            modalState,
            onSelect,
            triggerClassName,
            allowShortcutCommand = true,
            placeholder = 'Select joint member',
            triggerContentMode,
            triggerProps,
            shortcutKeyTrigger = '',
            ...rest
        },
        ref
    ) => {
        const [state, setState] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )

        const selectedMember =
            jointMembers.find((m) => m.id === value?.id) ?? null

        useHotkeys(
            shortcutKeyTrigger,
            (e) => {
                e.preventDefault()
                if (!disabled || allowShortcutCommand) {
                    setState(!state)
                }
            },
            { enableOnFormTags: true },
            [disabled, allowShortcutCommand, state]
        )
        const hasJointMembers = jointMembers.length > 0
        const hasSelectedMember = !!selectedMember

        return (
            <>
                <Modal
                    description="Co-owners of this account that have the access and share financial responsibility of this account (Select a one joint member)"
                    onOpenChange={setState}
                    open={state}
                    title="Joint Accounts"
                    {...rest}
                    className="max-w-7xl!"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {hasSelectedMember && (
                            <Button
                                className="p-2 rounded-md text-xl text-muted-foreground h-full flex flex-col gap-y-2 justify-center items-center"
                                disabled={!hasSelectedMember}
                                onClick={() => {
                                    onSelect?.(null)
                                }}
                                variant={'outline'}
                            >
                                <EmptyIcon className="ml-2" size={50} />
                                Select None
                            </Button>
                        )}
                        {hasJointMembers ? (
                            jointMembers.map((jointMember) => (
                                <JointAccountCardView
                                    className={`hover:border-primary hover:opacity-80 cursor-pointer ${selectedMember ? 'border-primary border-2' : ''}`}
                                    jointAccounts={jointMember}
                                    key={jointMember.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onSelect?.(jointMember)
                                        setState(false)
                                    }}
                                />
                            ))
                        ) : (
                            <div className="col-span-2 min-h-52 border rounded-2xl text-muted-foreground flex h-full items-center justify-center">
                                No Joint Members Found
                            </div>
                        )}
                    </div>
                </Modal>
                <Button
                    className={cn(
                        `${hasSelectedMember ? 'justify-start' : ''} items-center gap-x-2  px-2`,
                        triggerClassName,
                        triggerContentMode === 'full' && 'w-full'
                    )}
                    onClick={(e) => {
                        e.preventDefault()
                        setState(true)
                    }}
                    ref={ref}
                    size={triggerContentMode === 'icon' ? 'icon' : 'default'}
                    type="button"
                    variant={'outline'}
                    {...triggerProps}
                >
                    {hasSelectedMember ? (
                        <p className="items-center flex">
                            <ImageDisplay
                                className="size-5 shrink-0"
                                src={value?.picture_media.download_url}
                            />
                            {triggerContentMode === 'full' && (
                                <span className="ml-2 inline-block truncate">
                                    {value?.full_name}
                                </span>
                            )}
                        </p>
                    ) : (
                        <>
                            <UserPlusIcon className="inline" />
                            {triggerContentMode === 'full' && (
                                <span className="ml-2">
                                    {placeholder
                                        ? placeholder
                                        : 'Select Joint Member'}
                                </span>
                            )}
                        </>
                    )}
                </Button>
            </>
        )
    }
)

export default JointMemberPicker
