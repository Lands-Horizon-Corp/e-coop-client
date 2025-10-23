import React, { useState } from 'react'

import { cn } from '@/helpers'
import { IMemberJointAccount } from '@/modules/member-joint-account'

import { EmptyIcon, UserPlusIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { TEntityId } from '@/types'

import JointAccountCardView from '../../view/transaction-joint-member-card'

interface JointMemberModalProps extends IModalProps {
    value?: TEntityId
    allowShorcutCommand?: boolean
    modalOnly?: boolean
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    onSelect?: (jointMember: IMemberJointAccount | undefined) => void
    selectedMemberJointId?: TEntityId
    memberJointProfile: IMemberJointAccount[]
    triggerClassName?: string
    triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    triggerContentMode?: 'icon' | 'full'
}

const TransactionModalJointMember = ({
    onSelect,
    memberJointProfile,
    triggerClassName,
    triggerProps,
    value,
    triggerContentMode = 'icon',
    ...rest
}: JointMemberModalProps) => {
    const [openPicker, setOpenPicker] = useState(false)

    const selectedJointMember =
        memberJointProfile.find(
            (joint) => joint.id === value || joint.id === value
        ) || null

    const handleSelected = (jointMember: IMemberJointAccount) => {
        if (onSelect) {
            onSelect(jointMember)
            setOpenPicker(false)
        }
    }

    const hasSelectedMember = selectedJointMember !== null

    const hasNoJointMember = memberJointProfile.length === 0

    return (
        <>
            <Modal
                description="Co-owners of this account that have the access and share financial responsibility of this account (Select a one joint member)"
                onOpenChange={setOpenPicker}
                open={openPicker}
                title="Joint Accounts"
                {...rest}
                className="!max-w-7xl"
            >
                <div className="grid grid-cols-2 gap-4">
                    {hasSelectedMember && (
                        <Button
                            className="p-2 rounded-md text-xl text-muted-foreground h-full flex flex-col gap-y-2 justify-center items-center"
                            disabled={!hasSelectedMember}
                            onClick={() => {
                                setOpenPicker(false)
                                onSelect?.(undefined)
                            }}
                            variant={'outline'}
                        >
                            <EmptyIcon className="ml-2" size={50} />
                            Select None
                        </Button>
                    )}
                    {!hasNoJointMember ? (
                        memberJointProfile.map((jointMember) => (
                            <JointAccountCardView
                                className="hover:border-primary hover:opacity-80 cursor-pointer"
                                jointAccounts={jointMember}
                                key={jointMember.id}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelected(jointMember)
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
                    setOpenPicker(true)
                }}
                size={triggerContentMode === 'icon' ? 'icon' : 'default'}
                variant={'outline'}
                {...triggerProps}
            >
                {hasSelectedMember ? (
                    <p className="items-center flex">
                        <ImageDisplay
                            className="size-5 shrink-0"
                            src={selectedJointMember?.picture_media.url}
                        />
                        {triggerContentMode === 'full' && (
                            <span className="ml-2 inline-block truncate">
                                {selectedJointMember?.full_name}
                            </span>
                        )}
                    </p>
                ) : (
                    <>
                        <UserPlusIcon className="inline" />
                        {triggerContentMode === 'full' && (
                            <span className="ml-2">Add Joint Member</span>
                        )}
                    </>
                )}
            </Button>
        </>
    )
}

export default TransactionModalJointMember
