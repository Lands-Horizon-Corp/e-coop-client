import React, { useState } from 'react'

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
}

const TransactionModalJointMember = ({
    onSelect,
    memberJointProfile,
    triggerClassName,
    triggerProps,
    value,
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
                open={openPicker}
                onOpenChange={setOpenPicker}
                title="Joint Accounts"
                description="Co-owners of this account that have the access and share financial responsibility of this account (Select a one joint member)"
                {...rest}
                className="!max-w-7xl"
            >
                <div className="grid grid-cols-2 gap-4">
                    {hasSelectedMember && (
                        <Button
                            variant={'outline'}
                            className="p-2 rounded-md text-xl text-muted-foreground h-full flex flex-col gap-y-2 justify-center items-center"
                            onClick={() => {
                                setOpenPicker(false)
                                onSelect?.(undefined)
                            }}
                            disabled={!hasSelectedMember}
                        >
                            <EmptyIcon size={50} className="ml-2" />
                            Select None
                        </Button>
                    )}
                    {!hasNoJointMember ? (
                        memberJointProfile.map((jointMember) => (
                            <JointAccountCardView
                                className="hover:border-primary hover:opacity-80 cursor-pointer"
                                key={jointMember.id}
                                jointAccounts={jointMember}
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
                onClick={(e) => {
                    e.preventDefault()
                    setOpenPicker(true)
                }}
                variant={'outline'}
                className={`w-full ${hasSelectedMember ? 'justify-start' : ''} gap-x-2 px-2 ${triggerClassName}`}
                {...triggerProps}
            >
                {hasSelectedMember ? (
                    <span className="w-full flex justify-between items-center">
                        <span className="flex">
                            <ImageDisplay
                                className="mr-2"
                                src={selectedJointMember?.picture_media.url}
                            />
                            {selectedJointMember?.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {selectedJointMember.family_relationship}
                        </span>
                    </span>
                ) : (
                    <>
                        <UserPlusIcon className="" />
                        <span className="text-xs text-muted-foreground">
                            Select Joint Member
                        </span>
                    </>
                )}
            </Button>
        </>
    )
}

export default TransactionModalJointMember
